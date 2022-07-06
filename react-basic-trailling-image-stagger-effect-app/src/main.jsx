import {
  useMemo,
  useCallback,
  useRef,
  useState,
  useEffect,
  createRef,
} from 'react';
import {cx, css} from '@emotion/css';
import {createRoot} from 'react-dom/client';
import '@fontsource/inter';
import './styles/index.scss';
import gsap, {Power0, Power1, Power2, Power3, Power4} from 'gsap';
import {Button} from '@mui/material';
import {motion, transform} from 'framer-motion';
import {MathUtils} from 'three';

const lerp = (from) => {
  return (to) => {
    return (t) => {
      return MathUtils.lerp(from, to, t);
    };
  };
};

const interpolate = (start = []) => {
  return (end = []) => {
    return (t) => {
      return MathUtils.mapLinear(t, ...start, ...end);
    };
  };
};

const amt = (pos) => {
  return 0.02 * pos + 0.05;
};

const coordinate = {
  // x: [-390, 390],
  // y: [-390, 390],
  x: [-window.innerWidth / 2, window.innerWidth / 2],
  y: [-window.innerHeight / 2, window.innerHeight / 2],
};
const itemCount = 15;
let t = 0;
const App = () => {
  const itemsDomRef = useMemo(() => {
    return [...Array(itemCount).keys()]
      .map((n) => {
        return createRef();
      })
      .map((ref) => {
        return {x: 0, y: 0, current: ref.current};
      });
  }, []);
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

  // useEffect(() => {
  //   console.log(itemsDomRef);
  // }, []);

  // https://github.com/codrops/codrops-sketches/blob/main/006-image-motion-trail-semitransparent/js/index.js#L128-L147
  const loop = useCallback((time) => {
    t = t + 0.001;
    t = t % 1;
    const dx = interpolate([0, window.innerWidth])(coordinate.x)(
      cursor.current.x
    );
    const dy = interpolate([0, window.innerHeight])(coordinate.y)(
      cursor.current.y
    );
    for (let index = 0; index < itemCount; index++) {
      let delta =
        index < itemCount - 1 ? amt(index) : 0.3 ? 0.3 : amt(itemCount - 1);
      // Apply interpolated values (smooth effect)
      itemsDomRef[index].x = lerp(itemsDomRef[index].x)(dx)(delta);
      itemsDomRef[index].y = lerp(itemsDomRef[index].y)(dy)(delta);
      itemsDomRef[
        index
      ].current.style.transform = `translateX(${itemsDomRef[index].x}px) translateY(${itemsDomRef[index].y}px)`;
    }
    reqId.current = window.requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    reqId.current = window.requestAnimationFrame(loop);
    return () => {
      window.cancelAnimationFrame(reqId.current);
    };
  }, []);

  return (
    <div
      className={cx(
        css`
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        `,
        ``
      )}
    >
      {[...Array(itemCount).keys()].map((n, index) => {
        return (
          <div
            ref={itemsDomRef[index]}
            key={index}
            className={css`
              position: absolute;
              top: 10vmin;
              width: min(50vmin, 320px);
            `}
          >
            <img
              src={`https://media.giphy.com/media/4ilFRqgbzbx4c/giphy.gif`}
              alt={``}
              className={css`
                display: block;
                max-width: 100%;
                width: 100%;
              `}
            />
          </div>
        );
      })}
    </div>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
