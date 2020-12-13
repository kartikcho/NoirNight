import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Landing from './views/Landing';
import Play from './views/Play';
import Result from './views/Result';
import StarBox from './components/StarBox';

import './globals.css';

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/result">
            <Result />
          </Route>
          <Route exact path="/play">
            <Play />
          </Route>
          <Route exact path="/">
            <Landing />
          </Route>
        </Switch>
        <StarBox />
      </Router>
    </>
  );
}

export default App;
