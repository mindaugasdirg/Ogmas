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

export interface GameType {
  id: string;
  name: string;
}

export interface GameDto {
  id: string;
  startTime: string;
  startInterval: number;
  gameTypeId: string;
  organizerId: string;
}

export interface Game {
  id: string;
  startTime: Date;
  startInterval: Date;
  gameTypeId: string;
  organizerId: string;
}

export interface PlayerDto {
  id: string;
  startTime: string;
  finishTime?: string | null;
  gameId: string;
  playerId: string;
}

export interface Player {
  id: string;
  startTime: Date;
  finishTime?: Date;
  gameId: string;
  playerId: string;
}