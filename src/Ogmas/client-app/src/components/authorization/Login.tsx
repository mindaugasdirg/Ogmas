import React from 'react'
import { completeSignIn, signIn } from '../../clients/AuthorizationClient';
import { ApplicationPaths, LoginActions, QueryParameterNames } from '../../constants/ApiAuthorizationConstants';
import { AuthenticationResultStatus } from '../../types/types';

const redirectToApiAuthorizationPath = (apiAuthorizationPath: string) => {
    const redirectUrl = `${window.location.origin}${apiAuthorizationPath}`;
    // It's important that we do a replace here so that when the user hits the back arrow on the
    // browser he gets sent back to where it was on the app instead of to an endpoint on this
    // component.
    window.location.replace(redirectUrl);
}

const navigateToReturnUrl = (returnUrl: string) => {
    // It's important that we do a replace here so that we remove the callback uri with the
    // fragment containing the tokens from the browser history.
    window.location.replace(returnUrl);
}

const redirectToRegister = () =>
redirectToApiAuthorizationPath(`${ApplicationPaths.IdentityRegisterPath}?${QueryParameterNames.ReturnUrl}=${encodeURI(ApplicationPaths.Login)}`);
const redirectToProfile = () =>
redirectToApiAuthorizationPath(ApplicationPaths.IdentityManagePath);

const getReturnUrl = (state?: any) => {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get(QueryParameterNames.ReturnUrl);
    if (fromQuery && !fromQuery.startsWith(`${window.location.origin}/`)) {
        // This is an extra check to prevent open redirects.
        throw new Error("Invalid return url. The return url needs to have the same origin as the current page.")
    }
    return (state && state.returnUrl) || fromQuery || `${window.location.origin}/`;
}

interface Props {
    action: LoginActions;
}

// The main responsibility of this component is to handle the user's login process.
// This is the starting point for the login process. Any component that needs to authenticate
// a user can simply perform a redirect to this component with a returnUrl query parameter and
// let the component perform the login and return back to the return url.
export const Login = (props: Props) => {
    const [message, setMessage] = React.useState<string>();
    
    const login = async (returnUrl: string) => {
        const state = { returnUrl };
        const result = await signIn(state);
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
                throw new Error('Invalid status result.');
        }
    }

    const processLoginCallback = async () => {
        const url = window.location.href;
        const result = await completeSignIn(url);
        switch (result.status) {
            case AuthenticationResultStatus.Redirect:
                // There should not be any redirects as the only time completeSignIn finishes
                // is when we are doing a redirect sign in flow.
                throw new Error('Should not redirect.');
            case AuthenticationResultStatus.Success:
                navigateToReturnUrl(getReturnUrl(result.state));
                break;
            case AuthenticationResultStatus.Fail:
                setMessage(result.message);
                break;
            default:
                throw new Error('Invalid authentication result status.');
        }
    }

    React.useEffect(() => {
        switch(props.action) {
            case LoginActions.Login:
                login(getReturnUrl());
                break;
            case LoginActions.LoginCallback:
                processLoginCallback();
                break;
            case LoginActions.LoginFailed:
                const params = new URLSearchParams(window.location.search);
                const error = params.get(QueryParameterNames.Message);
                setMessage(error || undefined);
                break;
            case LoginActions.Register:
                redirectToRegister();
                break;
            case LoginActions.Profile:
                redirectToProfile();
                break;
            default:
                throw new RangeError("Invalid action type");
        }
    }, [props.action]);

    if(!message) {
        return <div>{message}</div>
    } else {
        switch(props.action) {
            case LoginActions.Login:
                return <div>Processing login</div>;
                case LoginActions.LoginCallback:
                return <div>Processing login callback</div>;
            case LoginActions.Profile:
            case LoginActions.Register:
                return <div></div>;
            default:
                throw new RangeError("Invalid action type");
        }
    }
}