import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import lightbulb from '../lightbulb.svg';
import speak from '../speak.svg';

export default function Play() {
  const { transcript, resetTranscript, listening } = useSpeechRecognition();
  const [query, setQuery] = useState('');
  const [textQuery, setTextQuery] = useState('');
  const [audioBuffer, setAudioBuffer] = useState(undefined);
  const [bars, setBars] = useState([]);
  const [response, setResponse] = useState('Lets get started detective!');

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
    // Render some fallback content
    // Disable the microphone button and render only the text input
  }

  return (
    <div>
      <h3 className="speech-input">{transcript}</h3>
      <h1 className="speech-output">"{response}"</h1>
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

      {listening && (
        <div className="voice-coder">
          <Visualizer bars={bars} />
        </div>
      )}
      <div className="blockquote hint-box">
        <h1>Maybe try asking: Sample placeholder hint</h1>
        <h4>
          <img
            style={{ maxWidth: '40px' }}
            src={lightbulb}
            alt="lightbulb icon"
          />
        </h4>
      </div>
      <div className="input-question">
        <input
          value={textQuery}
          onChange={(e) => setTextQuery(e.target.value)}
          type="text"
          className="question_input"
          id="name"
          placeholder="Don't have a mic? Ask here!"
          required=""
          autoComplete="off"
        />
        <label for="name" class="question_label">
          Don't have a mic? Ask here!
        </label>
      </div>
    </div>
  );
}

const Visualizer = ({ bars }) => {
  return bars.map((bar, i) => <span id={`${i + 1}`} style={{ height: bar }} />);
};
