import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles/index.scss';
import {css} from '@emotion/css';
import {Button} from '@mui/material';
import gsap, {Power1, Power2, Power3, Linear} from 'gsap';
import {samples, interpolate, formatHex} from 'culori';
import {transform} from 'framer-motion';
import {MathUtils} from 'three';
import * as d3 from 'd3';
import {Conic} from './components/Conic';

const colorList = ['#FFE3A9', '#FFC3C3', '#FF8C8C', '#FF5D5D'];

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

// https://github.com/d3/d3-shape#_arc
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

const App = () => {
  const [tik, setTik] = useState(null);

  return (
    <>
      <Button
        variant={'outlined'}
        onClick={(e) => {
          setTik(new Date());
        }}
      >
        Do
      </Button>
      <Conic
        tik={tik}
        colorCount={8}
        startRange={0}
        endRange={335}
        offset={20}
        colorList={['#064635', '#519259', '#F0BB62', '#F4EEA9']}
      />
      <Conic
        tik={tik}
        colorCount={7}
        startRange={0}
        endRange={328}
        offset={20}
        colorList={['#064635', '#519259', '#F0BB62', '#F4EEA9']}
      />
      <Conic
        tik={tik}
        colorCount={6}
        startRange={0}
        endRange={320}
        offset={20}
        colorList={['#064635', '#519259', '#F0BB62', '#F4EEA9']}
      />
      <Conic
        tik={tik}
        colorCount={5}
        startRange={0}
        endRange={308} // 288=(360/5)*(5-1) + 20
        offset={20}
        colorList={['#064635', '#519259', '#F0BB62', '#F4EEA9']}
      />
      <Conic
        tik={tik}
        colorCount={4}
        startRange={0}
        endRange={290}
        offset={20}
        colorList={['#064635', '#519259', '#F0BB62', '#F4EEA9']}
      />
      <Conic
        tik={tik}
        colorCount={3}
        startRange={0}
        endRange={260}
        offset={20}
        colorList={['#064635', '#519259', '#F0BB62', '#F4EEA9']}
      />
      <Conic
        tik={tik}
        colorCount={2}
        startRange={0}
        endRange={200}
        offset={20}
        colorList={['#064635', '#519259', '#F0BB62', '#F4EEA9']}
      />
    </>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
