export enum AuthenticationResultStatus {
    Redirect = 'redirect',
    Success = 'success',
    Fail = 'fail'
};

export interface AuthenticationSuccessResult {
    status: AuthenticationResultStatus.Success;
    state?: any;
}

export interface AuthenticationErrorResult {
    status: AuthenticationResultStatus.Fail;
    message: string;
}

export interface AuthenticationRedirectResult {
    status: AuthenticationResultStatus.Redirect;
}

export type AuthenticationResult = AuthenticationSuccessResult | AuthenticationErrorResult | AuthenticationRedirectResult;