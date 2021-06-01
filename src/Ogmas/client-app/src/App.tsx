import './App.css';
import './custom.css'
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { ApiAuthorizationRoutes } from './components/authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './ApiAuthorizationConstants';
import { CreateGame } from './components/CreateGame';
import { GameHost } from './components/GameHost';
import { JoinGame } from './components/JoinGame';
import { GameView } from './components/GameView';
import { CreateGameType } from './components/CreateGameType';

const App = () => {
  return (
    <Layout>
      <Route exact path='/' component={Home} />
      <Route exact path='/create-game' component={CreateGame} />
      <Route path='/create-game/custom-game' component={CreateGameType} />
      <Route path='/join-game/:game' component={JoinGame} />
      <Route path='/game-host/:game' component={GameHost} />
      <Route path='/game/:player' component={GameView} />
      <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
    </Layout>
  );
};

export default App;