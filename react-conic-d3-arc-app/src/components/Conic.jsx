import {
  useMemo,
  useCallback,
  useRef,
  useState,
  useEffect,
  createRef,
} from 'react';
import {cx, css} from '@emotion/css';
import {transform} from 'framer-motion';
import {samples, interpolate, formatHex} from 'culori';
import {MathUtils} from 'three';
import * as d3 from 'd3';

import SVGPathCommander from 'svg-path-commander';

const Conic = ({
  tik,
  colorCount = 6,
  startRange = 0,
  endRange = 320,
  offset = 20,
  size = 200,
  colorList = ['#FFE3A9', '#FFC3C3', '#FF8C8C', '#FF5D5D'],
}) => {
  const svgDomRef = useRef(null);
  const deltaRotate = 360 / colorCount;
  // console.log(deltaRotate);
  const width = size;
  const height = size;
  const radius = size;
  const [rotate, setRotate] = useState(0);
  useEffect(() => {
    if (!tik) {
      return;
    }
    setRotate((rotate) => {
      rotate = rotate + deltaRotate;
      return rotate;
    });
  }, [tik]);

  const getDomain = (data, key) => {
    const {min, max} = data.reduce(
      (acc, row) => {
        return {
          min: Math.min(acc.min, row[key]),
          max: Math.max(acc.max, row[key]),
        };
      },
      {min: Infinity, max: -Infinity}
    );
    return [min, max];
  };
  const makeConicGradient = ({
    startRange,
    endRange,
    colorCount,
    offset,
    colorInterpolator,
  }) => {
    colorCount = colorCount - 1;
    const {list} = [...samples(colorCount)].reduce(
      (acc, t, idx) => {
        const clampedT = transform(
          [0, 1],
          [0, (1 / colorCount) * (colorCount - 1)]
        )(t);
        const currentAngle =
          acc.prev + (endRange - startRange - offset) / colorCount;
        acc.list.push({
          color: colorInterpolator(clampedT),
          angleFrom: acc.prev,
          angleTo: currentAngle,
          t: clampedT,
        });
        acc.prev = currentAngle;
        return acc;
      },
      {prev: offset, list: []}
    );
    const minAngle = Math.min(...getDomain(list, 'angleFrom'));
    const maxAngle = Math.max(...getDomain(list, 'angleTo'));
    list.push({
      color: colorInterpolator(1),
      angleFrom: maxAngle - 360,
      angleTo: minAngle,
      t: 1,
    });
    return list;
  };

  const bebopColorInterpolator = (t) => {
    const info = interpolate(colorList)(t);
    return formatHex(info);
  };

  const conicInfoList = useMemo(() => {
    return makeConicGradient({
      colorCount,
      startRange,
      endRange:
        offset === 0
          ? endRange
          : (colorCount - 1) * (360 / colorCount) + offset,
      offset,
      colorInterpolator: bebopColorInterpolator,
    }).map((conicInfo) => {
      const startAngle = MathUtils.degToRad(conicInfo.angleFrom + rotate);
      const endAngle = MathUtils.degToRad(conicInfo.angleTo + rotate);
      const path = d3
        .arc()
        .innerRadius(0)
        .outerRadius(radius)
        .startAngle(startAngle)
        .endAngle(endAngle)();
      const fitPath = new SVGPathCommander(path)
        .transform({translate: [width / 2, height / 2, 0]})
        .toString();
      return {
        ...conicInfo,
        angleFrom: conicInfo.angleFrom + rotate,
        angleTo: conicInfo.angleTo + rotate,
        path: fitPath,
      };
    });
  }, [rotate, radius, colorCount, startRange, endRange, offset]);

  return (
    <div
      className={cx(
        css`
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          width: ${width}px;
          height: ${height}px;
        `,
        ``
      )}
    >
      {conicInfoList.map((conicInfo, index) => {
        return (
          <div
            key={index}
            className={css`
              position: absolute;
              top: 0;
              left: 0;
              width: ${width}px;
              height: ${height}px;
              background-color: ${conicInfo.color};
              clip-path: path('${conicInfo.path}');
              :hover {
                cursor: pointer;
              }
              transition: clip-path 1s ease-in-out;
            `}
            onClick={(e) => {
              console.log(conicInfo.color);
              setRotate((rotate) => {
                rotate = rotate + deltaRotate;
                return rotate;
              });
            }}
          />
        );
      })}
    </div>
  );
};

export {Conic};
