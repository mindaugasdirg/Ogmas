import { AlertProps } from "@material-ui/lab/Alert";

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
  name?: string;
}

export interface GameData {
  id: string;
  name: string;
}

export interface Answer {
  id: string;
  answer: string;
  location: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  question: string;
  hint: string;
  x: number;
  y: number;
  radius: number;
  answered?: true;
  answers?: Answer[];
}

export type SeverityTypes = Required<AlertProps["severity"]>;

export interface ErrorDto {
  message: string;
  errorType: string;
}

export class TypedError extends Error {
  constructor(public type: string, message: string) {
    super(message);
  }
}