import {
  useMemo,
  useCallback,
  useRef,
  useState,
  useEffect,
  createRef,
} from 'react';
import {cx, css} from '@emotion/css';
import {motion, transform} from 'framer-motion';
import {samples, interpolate, formatHex} from 'culori';
import {wrap} from 'popmotion';

const Conic = ({
  tik,
  size = 200,
  colorList = ['#FFE3A9', '#FFC3C3', '#FF8C8C', '#FF5D5D'],
}) => {
  const width = size;
  const height = size;
  const radius = size;
  const [rotate, setRotate] = useState(0);
  useEffect(() => {
    if (!tik) {
      return;
    }
    setRotate((rotate) => {
      rotate = rotate + 60;
      return rotate;
    });
  }, [tik]);

  // https://codepen.io/AnotherLinuxUser/pen/QEJmZN
  const polarToCartesian = ({centerX, centerY, radius, angle}) => {
    const angleInRadians = ((angle - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = ({centerX, centerY, radius, startAngle, endAngle}) => {
    const start = polarToCartesian({centerX, centerY, radius, angle: endAngle});
    const end = polarToCartesian({centerX, centerY, radius, angle: startAngle});
    const arcSweep = endAngle - startAngle <= 180 ? 0 : 1;
    return [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      arcSweep,
      0,
      end.x,
      end.y,
      'L',
      centerX,
      centerY,
      'L',
      start.x,
      start.y,
    ].join(' ');
  };

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

  const makeConicInfoList = ({
    startRange,
    endRange,
    colorCount,
    offset,
    colorInterpolator,
  }) => {
    colorCount = colorCount - 1;
    const {list} = [...samples(colorCount)].reduce(
      (acc, t, idx) => {
        const currentAngle =
          acc.prev + (endRange - startRange - offset) / colorCount;
        acc.list.push({
          color: colorInterpolator(
            transform([0, 1], [0, (1 / colorCount) * (colorCount - 1)])(t)
          ),
          angleFrom: acc.prev,
          angleTo: currentAngle,
          t: transform([0, 1], [0, (1 / colorCount) * (colorCount - 1)])(t),
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
    return makeConicInfoList({
      colorCount: 6,
      startRange: 0,
      endRange: 320,
      offset: 20,
      colorInterpolator: bebopColorInterpolator,
    }).map((conicInfo) => {
      return {
        ...conicInfo,
        angleFrom: conicInfo.angleFrom + rotate,
        angleTo: conicInfo.angleTo + rotate,
      };
    });
  }, [rotate]);

  const makeClipPathList = ({
    conicInfoList,
    centerX = 50,
    centerY = 50,
    radius = 100,
  }) => {
    const pathList = [];
    for (let index = 0; index < conicInfoList.length; index++) {
      const conicInfo = conicInfoList[index];
      const {angleFrom, angleTo, color} = conicInfo;
      const path = describeArc({
        centerX,
        centerY,
        radius,
        startAngle: angleFrom,
        endAngle: angleTo,
      });
      pathList.push({path, color});
    }
    return pathList;
  };

  const clipPathInfoList = makeClipPathList({
    conicInfoList,
    centerX: width / 2,
    centerY: height / 2,
    radius: radius,
  });
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
      {clipPathInfoList.map((clipPathInfo, index) => {
        return (
          <div
            key={index}
            className={css`
              position: absolute;
              top: 0;
              left: 0;
              width: ${width}px;
              height: ${height}px;
              background-color: ${clipPathInfo.color};
              clip-path: path('${clipPathInfo.path}');
              :hover {
                cursor: pointer;
              }
              transition: clip-path 1s ease-in-out;
            `}
            onClick={(e) => {
              console.log(clipPathInfo.color);
              setRotate((rotate) => {
                rotate = rotate + 60;
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
