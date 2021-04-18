import Button from '@material-ui/core/Button';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { getUser, isAuthenticated } from '../../clients/AuthorizationClient';
import { ApplicationPaths } from '../../constants/ApiAuthorizationConstants';

interface LogoutPath {
  pathname: string;
  state: {
    local: boolean;
  }
}

export const LoginMenu = () => {
  const [authenticated, setAuthenticated] = React.useState(false);
  const [username, setUsername] = React.useState<string>();

  const populateState = async () => {
    const [authenticatedResult, user] = await Promise.all([isAuthenticated(), getUser()])
    setAuthenticated(authenticatedResult);
    user && setUsername(user.name);
  };

  React.useEffect(() => { populateState(); });

  const authenticatedView = (userName: string, profilePath: string, logoutPath: LogoutPath) => {
    return (<Fragment>
      <Button color="inherit" component={Link} to={profilePath}>Hello {userName}</Button>
      <Button color="inherit"component={Link} to={logoutPath}>Logout</Button>
    </Fragment>);

  }

  const anonymousView = (registerPath: string, loginPath: string) => {
    return (<Fragment>
      <Button color="inherit" component={Link} to={registerPath}>Register</Button>
      <Button color="inherit" component={Link} to={loginPath}>Login</Button>
    </Fragment>);
  }
  if (!authenticated) {
    const registerPath = `${ApplicationPaths.Register}`;
    const loginPath = `${ApplicationPaths.Login}`;
    return anonymousView(registerPath, loginPath);
  } else {
    const profilePath = `${ApplicationPaths.Profile}`;
    const logoutPath = { pathname: `${ApplicationPaths.LogOut}`, state: { local: true } };
    return authenticatedView(username!, profilePath, logoutPath);
  }

}
