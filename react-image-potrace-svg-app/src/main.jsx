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
import * as d3 from 'd3';
import {Button, Slider} from '@mui/material';
import slack from './assets/SlackImage-w300xh300.png';
import {default as potrace} from 'potrace';
import {default as cheerio} from 'cheerio';

const App = () => {
  const svgDomRef = useRef(null);
  const pathDomRef = useRef(null);
  const vivusDomRef = useRef(null);

  const [debugProgress, setDebugProgress] = useState(0);

  const handleChange = (e) => {
    setDebugProgress(e.target.value);
  };

  const getPotracePath = (callback) => {
    potrace.trace(slack, (error, svgDomText) => {
      if (error) {
        return;
      }
      const $ = cheerio.load(svgDomText);
      const path = $('path').attr('d');
      callback({path});
    });
  };

  const trace = useCallback(({t}) => {
    const pathDom = d3.select(pathDomRef.current);
    const length = pathDom.node().getTotalLength();
    // console.log(t, length, (1 - t) * length);
    pathDom
      .attr('stroke', `black`)
      .attr('stroke-dasharray', length + ' ' + length)
      .attr('stroke-dashoffset', length)
      .transition()
      .duration(700)
      .ease(d3.easeLinear)
      .attrTween('stroke-dashoffset', function (d) {
        return () => {
          return (1 - t) * length;
        };
      });
  }, []);

  useEffect(() => {
    trace({t: debugProgress});
  }, [debugProgress]);

  useEffect(() => {
    getPotracePath(({path}) => {
      const pathDom = pathDomRef.current;
      const length = pathDom.getTotalLength();
      pathDom.setAttribute('d', path);
      pathDom.setAttribute('stroke-dasharray', length + ' ' + length);
      pathDom.setAttribute('stroke-dashoffset', length);
    });
  }, []);

  return (
    <>
      <div
        className={css`
          max-width: 300px;
          padding: 3rem;
        `}
      >
        <Slider
          defaultValue={0}
          min={0}
          max={1}
          step={0.01}
          value={debugProgress}
          aria-label="Default"
          valueLabelDisplay="auto"
          onChange={handleChange}
        />
      </div>
      <div
        className={css`
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 70vh;
        `}
      >
        <svg
          ref={svgDomRef}
          width={300}
          height={300}
          // viewBox="0 0 40 40"
          preserveAspectRatio="none"
          className={css`
            display: block;
          `}
        >
          <g transform="translate(3 3)">
            <path
              // d={`M 23.6 2 C 20.237 2 17.342 4.736 16.001 7.594 C 14.659 4.736 12 2 8.4 2 C 3.763 2 0 5.764 0 10.401 C 0 19.834 9.516 22.307 16.001 31.633 C 22.131 22.365 32 19.533 32 10.401 C 32 5.764 28.237 2 23.6 2 Z`}
              ref={pathDomRef}
              strokeWidth={1}
              fill={'none'}
            ></path>
          </g>
        </svg>
      </div>
    </>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
