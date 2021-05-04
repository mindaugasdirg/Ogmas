import { taskEither } from "fp-ts";
import { memoize } from "lodash/fp";
import { User, UserManager, UserManagerSettings, WebStorageStateStore } from "oidc-client";
import { ApplicationPaths } from "../ApiAuthorizationConstants";
import { AuthenticationErrorResult, AuthenticationRedirectResult, AuthenticationResult, AuthenticationResultStatus, AuthenticationSuccessResult, TypedError } from "../types/types";
import { mapError } from "../functions/utils";
import { fetchJson } from "./request";

const defaultSettings: UserManagerSettings = {
  automaticSilentRenew: true,
  includeIdTokenInSilentRenew: true,
  userStore: new WebStorageStateStore({ prefix: "Ogmas" })
};

const getUserManagerSettings = async () => {
  const config = await fetchJson<UserManagerSettings>(ApplicationPaths.ApiAuthorizationClientConfigurationUrl);
  return {
    ...config,
    ...defaultSettings
  };
}

const getUserManager = memoize(async () => new UserManager(await getUserManagerSettings()));

export const isAuthenticated = async () => {
  const user = await getUser();
  return !!user;
}

export const getUser = async () => {
  const userManager = await getUserManager();
  const user = await userManager.getUser();
  return user && user.profile;
};

export const getAccessToken = async () => {
  const userManager = await getUserManager();
  const user = await userManager.getUser();
  return user && user.access_token;
}

export const getAccessTokenFp = () => taskEither.tryCatch(
  async () => {
    const user = await getUserManager().then(userManager => userManager.getUser());
    if (!user)
      throw new TypedError("AuthorizationError", "User is not logged in");
    return user.access_token;
  },
  mapError("AuthorizationError")
);

export const signIn = async (state: { returnUrl: string }): Promise<AuthenticationResult> => {
  const userManager = await getUserManager();

  try {
    const silentUser = await userManager.signinSilent(createArguments());
    return success(silentUser);
  } catch (silentError) {
    // User might not be authenticated, fallback to popup authentication
    console.log("Silent authentication error: ", silentError);

    try {
      await userManager.signinRedirect(createArguments(state));
      return redirect();
    } catch (redirectError) {
      console.log("Redirect authentication error: ", redirectError);
      return error(redirectError);
    }
  }
}

export const completeSignIn = async (url: string): Promise<AuthenticationResult> => {
  try {
    const userManager = await getUserManager();
    const user = await userManager.signinCallback(url);
    return success(user && user.state);
  } catch (error) {
    console.log('There was an error signing in: ', error);
    return error('There was an error signing in.');
  }
}

export const signOut = async (state: any): Promise<AuthenticationResult> => {
  const userManager = await getUserManager();
  try {
    await userManager.signoutRedirect(createArguments(state));
    return redirect();
  } catch (redirectSignOutError) {
    console.log("Redirect signout error: ", redirectSignOutError);
    return error(redirectSignOutError);
  }
}

export const completeSignOut = async (url: string): Promise<AuthenticationResult> => {
  const userManager = await getUserManager();
  try {
    const response = await userManager.signoutCallback(url);
    return success(response && response.state);
  } catch (error) {
    console.log(`There was an error trying to log out '${error}'.`);
    return error(error);
  }
}

const createArguments = (state?: any) => ({ useReplaceToNavigate: true, data: state });
const success = (state?: User): AuthenticationSuccessResult => ({ status: AuthenticationResultStatus.Success, state });
const error = (message: string): AuthenticationErrorResult => ({ status: AuthenticationResultStatus.Fail, message });
const redirect = (): AuthenticationRedirectResult => ({ status: AuthenticationResultStatus.Redirect });