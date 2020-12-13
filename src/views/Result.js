import React from 'react';
import Bill from '../assets/bill.png';
import Macklyn from '../assets/macklyn.png';
import Owl from '../assets/doctorOwl.png';
import { Link } from 'react-router-dom';

export default function Result() {
  return (
    <>
      <h1 className="speech-input">Choose the murderer!</h1>
      <div className="result-container">
        <div>
          <img src={Bill} alt="Bill" />
          <p>Bill</p>
        </div>
        <div>
          <img src={Macklyn} alt="Bill" />
          <p>Elizabeth</p>
        </div>
        <div>
          <img src={Owl} alt="Bill" />
          <p>Owl</p>
        </div>
      </div>
      <div className="result-btn">
        <Link to="/play">Play Again</Link>
      </div>
    </>
  );
}
