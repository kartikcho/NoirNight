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
  const [response, setResponse] = useState('Lets get started detective!');

  useEffect(() => {
    const timer = setInterval(() => {
      setQuery(transcript);
    }, 800);

    return () => clearInterval(timer);
  }, [transcript]);

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
          console.log(res.data);
          setResponse(JSON.stringify(res.data.body));
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
          onClick={SpeechRecognition.startListening({ language: 'en-IN' })}
        >
          <img style={{ maxWidth: '40px' }} src={speak} alt="speak icon" />
        </button>
      </div>
      {/* {listening && <div>Listening... (or some better wave animation) </div>} */}
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
