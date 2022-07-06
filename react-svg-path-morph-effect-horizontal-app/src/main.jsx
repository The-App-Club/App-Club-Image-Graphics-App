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
import gsap, {Power0, Power1, Power2, Power3, Power4, Sine} from 'gsap';
import {Button} from '@mui/material';
import {motion, transform} from 'framer-motion';

// edit here: https://yqnn.github.io/svg-path-editor/
const paths = {
  step1: {
    unfilled: 'M 0 0 h 0 c 0 50 0 50 0 100 H 0 V 0 Z',
    inBetween: 'M 0 0 h 33 c -30 54 113 65 0 100 H 0 V 0 Z',
    /*
      M 0 0 h 34 c 73 7 73 94 0 100 H 0 V 0 Z
      M 0 0 h 33 c -30 54 113 65 0 100 H 0 V 0 Z
      M 0 0 h 34 c 112 44 -32 49 0 100 H 0 V 0 Z
      */
    filled: 'M 0 0 h 100 c 0 50 0 50 0 100 H 0 V 0 Z',
  },
  step2: {
    filled: 'M 100 0 H 0 c 0 50 0 50 0 100 h 100 V 50 Z',
    //inBetween: 'M 100 0 H 50 c 20 33 20 67 0 100 h 50 V 0 Z',
    inBetween: 'M 100 0 H 50 c 28 43 4 81 0 100 h 50 V 0 Z',
    unfilled: 'M 100 0 H 100 c 0 50 0 50 0 100 h 0 V 0 Z',
  },
};
const App = () => {
  const svgDomRef = useRef(null);
  const pathDomRef = useRef(null);
  const [play, setPlay] = useState(false);
  const [animating, setAnimating] = useState(false);
  const tl = useMemo(() => {
    return gsap.timeline({
      paused: true,
      onComplete: () => {
        setAnimating(false);
      },
    });
  }, []);

  const handleDo = useCallback((e) => {
    setPlay((play) => {
      return !play;
    });
  }, []);

  useEffect(() => {
    tl.set(pathDomRef.current, {
      attr: {d: paths.step1.unfilled},
    })
      .to(
        pathDomRef.current,
        {
          duration: 0.8,
          ease: Power4.easeIn,
          attr: {d: paths.step1.inBetween},
        },
        0
      )
      .to(pathDomRef.current, {
        duration: 0.2,
        ease: Power1,
        attr: {d: paths.step1.filled},
        onComplete: () => {
          // switchPages()
          console.log(`switchPages`);
        },
      })
      .set(pathDomRef.current, {
        attr: {d: paths.step2.filled},
      })
      .to(pathDomRef.current, {
        duration: 0.2,
        ease: Sine.easeIn,
        attr: {d: paths.step2.inBetween},
      })
      .to(pathDomRef.current, {
        duration: 1,
        ease: 'power4',
        attr: {d: paths.step2.unfilled},
      });
  }, []);

  useEffect(() => {
    if (play) {
      tl.play();
    } else {
      tl.reverse();
    }
  }, [play]);
  return (
    <>
      <Button variant={'outlined'} onClick={handleDo}>
        {'Do'}
      </Button>
      <svg
        ref={svgDomRef}
        width={window.innerWidth}
        height={window.innerHeight}
        viewBox={`0 0 100 100`}
        preserveAspectRatio="none"
        className={cx(css``, ``)}
      >
        <path
          ref={pathDomRef}
          vectorEffect="non-scaling-stroke"
          d={paths.step1.unfilled}
        />
      </svg>
    </>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
