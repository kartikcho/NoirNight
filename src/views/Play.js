import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import speak from '../assets/speak.svg';
import hintsCollection from './hints';

export default function Play() {
  const MAX_TIME = 120;
  const HINTS_TIME = 30;
  const { transcript, listening } = useSpeechRecognition();
  const [voiceSupport, setVoiceSupport] = useState(true);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [query, setQuery] = useState('');
  const [textQuery, setTextQuery] = useState('');
  const [audioBuffer, setAudioBuffer] = useState(undefined);
  const [bars, setBars] = useState([]);
  const [response, setResponse] = useState('Lets get started detective!');
  const [counter, setCounter] = useState(hintsCollection.length - 1);
  const history = useHistory();

  const countdown = () => {
    let timerDuration = MAX_TIME;
    const timer = setInterval(() => {
      if (timerDuration >= 0) {
        timerDuration = timerDuration - 1;
        setTimeLeft(timerDuration);
      }
    }, 1000);

    return () => clearInterval(timer);
  };

  const hintsDropper = () => {
    let timerDuration = HINTS_TIME;
    const timer = setInterval(() => {
      if (counter >= 0) {
        setCounter((v) => v - 1);
      }
    }, timerDuration * 1000);

    return () => clearInterval(timer);
  };

  useEffect(() => {
    countdown();
    hintsDropper();

    const timer = setTimeout(() => {
      history.push('/result');
    }, MAX_TIME * 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        if (stream) {
          const context = new (window.AudioContext ||
            window.webkitAudioContext)();
          const source = context.createMediaStreamSource(stream);
          const analyser = context.createAnalyser();
          source.connect(analyser);

          function renderFrame() {
            requestAnimationFrame(renderFrame);
            const frequencyData = new Float32Array(256);
            analyser.getFloatTimeDomainData(frequencyData);
            // console.log(frequencyData);
            const bars = [];
            for (let i = 0; i < 54; i++) {
              const val = Math.abs(frequencyData[i]);
              bars.push(`${val * 1000}%`);
            }
            setBars(bars);
          }
          renderFrame();
        }
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuery(transcript);
    }, 1500);

    return () => clearInterval(timer);
  }, [transcript]);

  useEffect(() => {
    if (audioBuffer) {
      const context = new AudioContext() || new window.webkitAudioContext();
      context.decodeAudioData(audioBuffer, (buffer) => {
        const bufferSource = context.createBufferSource();
        bufferSource.buffer = buffer;
        bufferSource.connect(context.destination);
        bufferSource.start();
      });

      return () => context.close();
    }
  }, [audioBuffer]);

  useEffect(() => {
    (async () => {
      if (query) {
        const data = JSON.stringify({ queries: [query] });
        const config = {
          method: 'post',
          url: 'https://o2fast2curious-kkpo.uc.r.appspot.com/intent/text',
          headers: {
            'Content-Type': 'application/json',
          },
          data: data,
        };

        const res = await axios(config);
        if (res && res.data.success) {
          const {
            fulfillmentText,
            outputAudio: { data },
          } = res.data.data[0];
          const arrBuffer = new Uint8Array(data).buffer;
          setAudioBuffer(arrBuffer);
          setResponse(fulfillmentText);
        }
      }
    })();
  }, [query]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    setVoiceSupport(false);
  }

  return (
    <div className="main">
      <h3 className="speech-input">{transcript}</h3>
      <h1 className="speech-output">"{response}"</h1>
      {voiceSupport ? (
        <div className="voice-button">
          <button
            className="voice-button-icon"
            onClick={() =>
              SpeechRecognition.startListening({ language: 'en-IN' })
            }
          >
            <img style={{ maxWidth: '40px' }} src={speak} alt="speak icon" />
          </button>
        </div>
      ) : (
        <span>
          Voice is only supported on Chrome. Switch browser for the best
          experience or use the input box below.
        </span>
      )}
      {listening && voiceSupport && (
        <div className="voice-coder">
          <Visualizer bars={bars} />
        </div>
      )}

      <div className="blockquote hint-box">
        <h1>
          Maybe try asking: <b>{hintsCollection[counter]}</b>
        </h1>
        <h4>
          {/* <img
            style={{ maxWidth: '40px' }}
            src={lightbulb}
            alt="lightbulb icon"
          /> */}
          <span>{timeLeft}</span> Seconds Left
        </h4>
      </div>
      <div className="input-question">
        <input
          value={textQuery}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              setQuery(textQuery);
            }
          }}
          onChange={(e) => setTextQuery(e.target.value)}
          type="text"
          className="question_input"
          id="name"
          placeholder="Can't use a mic? Ask here!"
          required=""
          autoComplete="off"
        />
        <label htmlFor="name" className="question_label">
          Press Enter to submit
        </label>
      </div>
    </div>
  );
}

const Visualizer = ({ bars }) => {
  return bars.map((bar, i) => <span id={`${i + 1}`} style={{ height: bar }} />);
};
