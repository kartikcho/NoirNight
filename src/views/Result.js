import React, { useState } from 'react';
import Bill from '../assets/bill.png';
import Elizabeth from '../assets/macklyn.png';
import Owl from '../assets/doctorOwl.png';
import { Link } from 'react-router-dom';

export default function Result() {
  const [Suspect, setSuspect] = useState('default');

  let content;

  if (Suspect === 'Bill') {
    content = (
      <h1 className="speech-input" style={{ fontSize: '3.5em' }}>
        It was {Suspect}, you found Smith's murderer!
      </h1>
    );
  } else if (Suspect === 'Owl' || Suspect === 'Elizabeth') {
    content = (
      <h1 className="speech-output" style={{ fontSize: '3.5em' }}>
        It wasn't {Suspect}. You caught the wrong person :\
      </h1>
    );
  } else if (Suspect === 'default') {
    content = (
      <>
        <h1 className="speech-input">Choose a suspect</h1>
        <div className="result-container">
          <div onClick={() => setSuspect('Bill')}>
            <img src={Bill} alt="Bill" />
            <p>Bill</p>
          </div>
          <div onClick={() => setSuspect('Elizabeth')}>
            <img src={Elizabeth} alt="Elizabeth" />
            <p>Elizabeth</p>
          </div>
          <div onClick={() => setSuspect('Owl')}>
            <img src={Owl} alt="Owl" />
            <p>Owl</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {content}
      <div className="result-btn">
        <Link to="/play">Play Again</Link>
      </div>
    </>
  );
}
