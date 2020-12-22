import React from 'react';
import { Link } from 'react-router-dom';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

export default function Landing() {
  return (
    <>
      <h1 className="glowing-text">Noir Night.</h1>
      <div className="intro">
        It's 2:30 am when you arrive at the Smith Mansion. Elizabeth, Bill and
        Doctor Owl are standing around the bed with the dead body of Mr. Smith.
        Your partner who arrived early on the scene gives you a rundown of the
        suspects: Elizabeth the wife of the deceased, Bill his butler and Doctor
        Owl their family doctor for the last 5 years.
        <br />
        Autopsy report says Smith was choked to death. However, the only person
        next to the body when it was found was Elizabeth, who lay there crying.
        <br />
        Bill recalls Mr. Smith calling the doctor over as he suffered from a
        severe chest pain. But Doctor Owl's car arrived at the mansion half an
        hour earlier than the body was discovered.
        <br />
        <br />
        <br />
        With only this information to start with, figure out who's responsible
        for the murder of Mr. Smith in 2 minutes!
        {!SpeechRecognition.browserSupportsSpeechRecognition() && (
          <>
            <br />
            <br />
            <i>Currently only supported on Chrome :(</i>
          </>
        )}
      </div>
      <div className="btns">
        {SpeechRecognition.browserSupportsSpeechRecognition() && (
          <Link to="/play" class="play">
            Let's Play!
          </Link>
        )}
        <a
          className="info"
          target="_blank"
          rel="noreferrer"
          href="https://github.com/kartikcho/MatBM"
        >
          Star us on GitHub
        </a>
      </div>
    </>
  );
}
