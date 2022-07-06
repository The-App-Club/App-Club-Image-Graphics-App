import {useCallback, useRef, useState, useEffect, createRef} from 'react';
import {cx, css} from '@emotion/css';
import {createRoot} from 'react-dom/client';
import '@fontsource/inter';
import './styles/index.scss';
import {MathUtils} from 'three';
import {transform} from 'framer-motion';

const interpolate = (start = []) => {
  return (end = []) => {
    return (t) => {
      return MathUtils.mapLinear(t, ...start, ...end);
    };
  };
};

const coordinate = {
  x: [0, 1],
  y: [0, 1],
  // x: [-1, 1],
  // y: [1, -1],
};

let t = 0;
const App = () => {
  const reqId = useRef(null);
  const cursor = useRef({x: window.innerWidth / 2, y: window.innerHeight / 2});
  const getCursorPos = useCallback((e) => {
    cursor.current = {
      x: e.clientX,
      y: e.clientY,
    };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', getCursorPos);
    return () => {
      window.removeEventListener('mousemove', getCursorPos);
    };
  }, []);

  const loop = useCallback((time) => {
    t = t + 0.001;
    t = t % 1;
    const dt = Math.abs(Math.sin(t * Math.PI));
    const dx = interpolate([0, window.innerWidth])(coordinate.x)(
      cursor.current.x
    );
    const dy = interpolate([0, window.innerHeight])(coordinate.y)(
      cursor.current.y
    );

    const cx = transform([0, 1], [0, 100])(dx);
    const cy = transform([0, 1], [0, 100])(dy);
    const mouseColor = `rgba(238,174,202,1)`;
    const backgroundColor = `rgba(148,187,233,1)`;
    const mousePointColor = `radial-gradient(at ${cx}% ${cy}%, ${mouseColor} ${dt}%, ${backgroundColor} ${
      1 + dt
    }%)`;
    document.body.style.background = `${mousePointColor}`;
    reqId.current = window.requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    reqId.current = window.requestAnimationFrame(loop);
    return () => {
      window.cancelAnimationFrame(reqId.current);
    };
  }, []);

  return null;
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
