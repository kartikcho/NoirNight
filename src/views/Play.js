import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import speak from '../assets/speak.svg';

export default function Play() {
  const { transcript, resetTranscript, listening } = useSpeechRecognition();
  const [voiceSupport, setVoiceSupport] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const [query, setQuery] = useState('');
  const [textQuery, setTextQuery] = useState('');
  const [audioBuffer, setAudioBuffer] = useState(undefined);
  const [bars, setBars] = useState([]);
  const [response, setResponse] = useState('Lets get started detective!');
  const history = useHistory();

  const countdown = () => {
    let timerDuration = 60;
    setInterval(() => {
      if (timerDuration >= 0) {
        timerDuration = timerDuration - 1;
        setTimeLeft(timerDuration);
      }
    }, 1000);
  };

  const onKeyUpQuestion = (e) => {
    e.preventDefault();
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      console.log('Enter key pressed!!!!!');
      setTextQuery(e.target.value);
    }
  };

  useEffect(() => {
    countdown();

    setTimeout(() => {
      history.push('/result');
    }, 60000);
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
    <div>
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
        <h1>Maybe try asking: Sample placeholder hint</h1>
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
          onChange={(e) => onKeyUpQuestion(e)}
          type="text"
          className="question_input"
          id="name"
          placeholder="Can't use a mic? Ask here!"
          required=""
          autoComplete="off"
        />
        <label htmlFor="name" className="question_label">
          Can't use a mic? Ask here!
        </label>
      </div>
    </div>
  );
}

const Visualizer = ({ bars }) => {
  return bars.map((bar, i) => <span id={`${i + 1}`} style={{ height: bar }} />);
};
