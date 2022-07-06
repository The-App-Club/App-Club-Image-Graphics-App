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
import {Button} from '@mui/material';
import {Conic} from './components/Conic';

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
      <div
        className={cx(
          css`
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            min-height: 100vh;
          `,
          ``
        )}
      >
        <div
          className={cx(
            css`
              display: flex;
              justify-content: center;
              align-items: center;
            `,
            ``
          )}
        >
          <Conic tik={tik} />
          <Conic
            tik={tik}
            colorList={['#EA907A', '#FBC687', '#F4F7C5', '#AACDBE']}
          />
          <Conic
            tik={tik}
            colorList={['#064635', '#519259', '#F0BB62', '#F4EEA9']}
          />
        </div>
        <div
          className={cx(
            css`
              display: flex;
              justify-content: center;
              align-items: center;
            `,
            ``
          )}
        >
          <Conic
            tik={tik}
            colorList={['#4B778D', '#28B5B5', '#8FD9A8', '#D2E69C']}
          />
          <Conic
            tik={tik}
            colorList={['#1A374D', '#406882', '#6998AB', '#B1D0E0']}
          />
          <Conic
            tik={tik}
            colorList={['#DDDDDD', '#125D98', '#3C8DAD', '#F5A962']}
          />
        </div>
        <div
          className={cx(
            css`
              display: flex;
              justify-content: center;
              align-items: center;
            `,
            ``
          )}
        >
          <Conic
            tik={tik}
            colorList={['#781D42', '#A3423C', '#A3423C', '#F0D290']}
          />
          <Conic
            tik={tik}
            colorList={['#EEEBDD', '#810000', '#630000', '#1B1717']}
          />
          <Conic
            tik={tik}
            colorList={['#7C7575', '#B8B0B0', '#DFD3D3', '#FBF0F0']}
          />
        </div>
      </div>
    </>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
