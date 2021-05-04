import { Fragment } from 'react';
import { Route } from 'react-router';
import { ApplicationPaths, LoginActions, LogoutActions } from '../../ApiAuthorizationConstants';
import { Login } from './Login'
import { Logout } from './Logout'

const loginAction = (name: LoginActions) => <Login action={name}></Login>;
const logoutAction = (name: LogoutActions) => <Logout action={name}></Logout>;

export const ApiAuthorizationRoutes = () =>
  <Fragment>
    <Route path={ApplicationPaths.Login} render={() => loginAction(LoginActions.Login)} />
    <Route path={ApplicationPaths.LoginFailed} render={() => loginAction(LoginActions.LoginFailed)} />
    <Route path={ApplicationPaths.LoginCallback} render={() => loginAction(LoginActions.LoginCallback)} />
    <Route path={ApplicationPaths.Profile} render={() => loginAction(LoginActions.Profile)} />
    <Route path={ApplicationPaths.Register} render={() => loginAction(LoginActions.Register)} />
    <Route path={ApplicationPaths.LogOut} render={() => logoutAction(LogoutActions.Logout)} />
    <Route path={ApplicationPaths.LogOutCallback} render={() => logoutAction(LogoutActions.LogoutCallback)} />
    <Route path={ApplicationPaths.LoggedOut} render={() => logoutAction(LogoutActions.LoggedOut)} />
  </Fragment>;
