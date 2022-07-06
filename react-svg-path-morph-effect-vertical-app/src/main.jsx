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
    unfilled: 'M 0 100 V 100 Q 50 100 100 100 V 100 z',
    inBetween: {
      curve1: 'M 0 100 V 50 Q 50 0 100 50 V 100 z',
      curve2: 'M 0 100 V 50 Q 50 100 100 50 V 100 z',
    },
    filled: 'M 0 100 V 0 Q 50 0 100 0 V 100 z',
  },
  step2: {
    filled: 'M 0 0 V 100 Q 50 100 100 100 V 0 z',
    inBetween: {
      curve1: 'M 0 0 V 50 Q 50 0 100 50 V 0 z',
      curve2: 'M 0 0 V 50 Q 50 100 100 50 V 0 z',
    },
    unfilled: 'M 0 0 V 0 Q 50 0 100 0 V 0 z',
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
          attr: {d: paths.step1.inBetween.curve1},
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
        attr: {d: paths.step2.inBetween.curve1},
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
