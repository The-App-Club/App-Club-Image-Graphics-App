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

const itemCount = 5;

const App = () => {
  const itemDomRef = useRef(null);
  const itemsDomRef = useMemo(() => {
    return [...Array(itemCount).keys()].map((n) => {
      return createRef();
    });
  }, []);
  const [play, setPlay] = useState(false);
  const [endAnimation, setEndAnimation] = useState(false);

  const tl = useMemo(() => {
    return gsap.timeline({
      paused: true,
      onStart: () => {
        console.log(`onStart`);
      },
      // https://greensock.com/forums/topic/9182-detect-reverse-start-event/?do=findComment&comment=36992&_rid=115212
      onComplete: () => {
        console.log(`onComplete`);
        // tl.timeScale(1.5);
        // tl.reverse(0);
      },
      onReverseComplete: () => {
        console.log(`onReverseComplete`);
        // tl.timeScale(0.5);
        // tl.play(0);
      },
    });
  }, []);

  const handleDo = useCallback((e) => {
    setPlay((play) => {
      return !play;
    });
  }, []);

  const cowboy = (i) => {
    return transform([0, itemCount - 1], [0, 1])(i);
  };

  const getScaleValue = (i) => {
    let scaleValue = 1 - 0.1 * i;
    return scaleValue >= 0 ? scaleValue : 0;
  };

  const getRotationValue = (i) => {
    return i ? i * 0.6 : 0;
  };

  useEffect(() => {
    const itemDomList = itemsDomRef.map((itemDomRef) => {
      return itemDomRef.current;
    });
    tl.to(itemDomList, {
      y: (i) => {
        return 400 * getScaleValue(i);
      },
      scaleY: (i) => {
        return getScaleValue(i);
      },
      rotation: (i) => {
        return getRotationValue(i) * 20;
      },
      opacity: 0,
      ease: Power2.easeInOut,
      duration: 0.7,
      stagger: 0.1,
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
      <motion.div
        className={cx(
          css`
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            :hover {
              cursor: pointer;
            }
          `,
          ``
        )}
        onHoverStart={(e) => {
          tl.play();
        }}
        onHoverEnd={(e) => {
          tl.reverse();
        }}
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
      </motion.div>
    </>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
