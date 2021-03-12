import React from 'react'
import { completeSignOut, isAuthenticated, signOut } from '../../clients/AuthorizationClient';
import { ApplicationPaths, LogoutActions, QueryParameterNames } from '../../constants/ApiAuthorizationConstants';
import { AuthenticationResultStatus } from '../../types';

const getReturnUrl = (state?: { returnUrl?: string }) => {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get(QueryParameterNames.ReturnUrl);
    if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
        // This is an extra check to prevent open redirects.
        throw new Error("Invalid return url. The return url needs to have the same origin as the current page.")
    }
    return (state && state.returnUrl) ||
        fromQuery ||
        `${window.location.origin}${ApplicationPaths.LoggedOut}`;
}

const navigateToReturnUrl = (returnUrl: string) => {
    return window.location.replace(returnUrl);
}

interface Props {
    action: LogoutActions;
}

// The main responsibility of this component is to handle the user's logout process.
// This is the starting point for the logout process, which is usually initiated when a
// user clicks on the logout button on the LoginMenu component.
export const Logout = (props: Props) => {
    const [message, setMessage] = React.useState<string>();
    const [isReady, setIsReady] = React.useState(false);
    // const [authenticated, setAuthenticated] = React.useState(false);

    const populateAuthenticationState = async () => {
        await isAuthenticated();
        setIsReady(true);
        // setAuthenticated(authenticated);
    }

    const logout = async (returnUrl: string) => {
        const state = { returnUrl };
        const isauthenticated = await isAuthenticated();
        if (isauthenticated) {
            const result = await signOut(state);
            switch (result.status) {
                case AuthenticationResultStatus.Redirect:
                    break;
                case AuthenticationResultStatus.Success:
                    navigateToReturnUrl(returnUrl);
                    break;
                case AuthenticationResultStatus.Fail:
                    setMessage(result.message);
                    break;
                default:
                    throw new Error("Invalid authentication result status.");
            }
        } else {
            setMessage("You successfully logged out!");
        }
    }

    const processLogoutCallback = async () => {
        const url = window.location.href;
        const result = await completeSignOut(url);
        switch (result.status) {
            case AuthenticationResultStatus.Redirect:
                // There should not be any redirects as the only time completeAuthentication finishes
                // is when we are doing a redirect sign in flow.
                throw new Error('Should not redirect.');
            case AuthenticationResultStatus.Success:
                navigateToReturnUrl(getReturnUrl(result.state));
                break;
            case AuthenticationResultStatus.Fail:
                setMessage(result.message);
                break;
            default:
                throw new Error("Invalid authentication result status.");
        }
    }

    React.useEffect(() => {
        switch (props.action) {
            case LogoutActions.Logout:
                if (!!window.history.state.state.local) {
                    logout(getReturnUrl());
                } else {
                    // This prevents regular links to <app>/authentication/logout from triggering a logout
                    setIsReady(true);
                    setMessage("The logout was not initiated from within the page.");
                }
                break;
            case LogoutActions.LogoutCallback:
                processLogoutCallback();
                break;
            case LogoutActions.LoggedOut:
                setIsReady(true);
                setMessage("You successfully logged out!");
                break;
            default:
                throw new Error(`Invalid action`);
        }

        populateAuthenticationState();
    }, [props.action]);

    if (!isReady) {
        return <div></div>
    }
    if (!!message) {
        return (<div>{message}</div>);
    } else {
        const action = props.action;
        switch (action) {
            case LogoutActions.Logout:
                return (<div>Processing logout</div>);
            case LogoutActions.LogoutCallback:
                return (<div>Processing logout callback</div>);
            case LogoutActions.LoggedOut:
                return (<div>{message}</div>);
            default:
                throw new Error(`Invalid action '${action}'`);
        }
    }
}