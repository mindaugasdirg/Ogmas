import './App.css';
import './custom.css'
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Counter } from './components/Counter';
import { FetchData } from './components/FetchData';
import { ApiAuthorizationRoutes } from './components/authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './constants/ApiAuthorizationConstants';
import { CreateGame } from './components/CreateGame';
import { GameHost } from './components/GameHost';

const App = () => (
  <Layout>
    <Route exact path='/' component={Home} />
    <Route path='/create-game' component={CreateGame} />
    <Route path='/game-host/:game' component={GameHost} />
    <Route path='/counter' component={Counter} />
    <Route path='/fetch-data' component={FetchData} />
    <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
  </Layout>
);

export default App;