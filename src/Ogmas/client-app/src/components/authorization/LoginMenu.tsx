import React, { Fragment } from 'react';
import { NavItem, NavLink } from 'reactstrap';
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
            <NavItem>
                <NavLink tag={Link} className="text-dark" to={profilePath}>Hello {userName}</NavLink>
            </NavItem>
            <NavItem>
                <NavLink tag={Link} className="text-dark" to={logoutPath}>Logout</NavLink>
            </NavItem>
        </Fragment>);

    }

    const anonymousView = (registerPath: string, loginPath: string) => {
        return (<Fragment>
            <NavItem>
                <NavLink tag={Link} className="text-dark" to={registerPath}>Register</NavLink>
            </NavItem>
            <NavItem>
                <NavLink tag={Link} className="text-dark" to={loginPath}>Login</NavLink>
            </NavItem>
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
