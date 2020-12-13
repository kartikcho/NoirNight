import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <>
      <h1 className="glowing-text">Noir Night.</h1>
      <div className="btns">
        <Link to="/play" class="play">
          Let's Play!
        </Link>
        <a className="info" href="https://github.com/kartikcho/MatBM">
          Star us on GitHub
        </a>
      </div>
    </>
  );
}
