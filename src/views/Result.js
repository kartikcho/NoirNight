import React from 'react';
import Bill from '../assets/bill.png';
import Macklyn from '../assets/macklyn.png';
import Owl from '../assets/doctorOwl.png';

export default function Result() {
  return (
    <div className="result-container">
      <div className="result-left">
        <img src={Bill} alt="Bill" />
      </div>
      <div className="result-middle">
        <img src={Macklyn} alt="Bill" />
      </div>
      <div className="result-right">
        <img src={Owl} alt="Bill" />
      </div>
    </div>
  );
}
