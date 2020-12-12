import React, { useState } from 'react';
import lightbulb from '../lightbulb.svg';
import speak from '../speak.svg';

export default function Play() {
  const [Speech, setSpeech] = useState('Lets get started detective!');
  const [InputQuestion, setInputQuestion] = useState('');

  return (
    <div>
      <h3 className="speech-input">Why was Blahaj kil?{InputQuestion}</h3>
      <h1 className="speech-output">"{Speech}"</h1>

      <div class="voice-button">
        <button class="voice-button-icon">
          <img style={{ maxWidth: '40px' }} src={speak} alt="speak icon" />
        </button>
      </div>

      <div class="blockquote hint-box">
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
          type="text"
          class="question_input"
          id="name"
          placeholder="Don't have a mic? Ask here!"
          required=""
        />
        <label for="name" class="question_label">
          Don't have a mic? Ask here!
        </label>
      </div>
    </div>
  );
}
