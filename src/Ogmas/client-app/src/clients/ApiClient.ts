import { array, taskEither } from "fp-ts";
import { either } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { parseGame, parsePlayer } from "../types/typeConverters";
import { Answer, GameDto, GameType, PlayerDto, Question } from "../types/types";
import { getAccessTokenFp } from "./AuthorizationClient";
import { getRequest, getTextRequest, patchRequestWithoutResult, postRequest, postRequestWithoutResult } from "./request";

const mapTokenToHeader = (token: string) => ({ Authorization: `Bearer ${token}`, "Content-Type": "application/json" });
type ApiHeaders = ReturnType<typeof mapTokenToHeader>

const getRequestHeaders = () => pipe(getAccessTokenFp(), taskEither.map(mapTokenToHeader));

export const createGame = (gameType: string, startTime: Date, timeInterval: Date) => {
  const makeRequest = (headers: ApiHeaders) =>
    postRequest<GameDto>("/api/games",
      JSON.stringify({
        startTime: startTime.toISOString(),
        startInterval: Math.trunc(timeInterval.getHours() * 3600 + timeInterval.getMinutes() * 60 + timeInterval.getSeconds()),
        gameTypeId: gameType
      }), headers);

  return pipe(
    getRequestHeaders(),
    taskEither.chain(makeRequest),
    taskEither.chainEitherK(parseGame)
  );
};

export const getGame = (gameId: string) => {
  const makeRequest = (headers: ApiHeaders) => getRequest<GameDto>(`/api/games/${gameId}`, headers);

  return pipe(
    getRequestHeaders(),
    taskEither.chain(makeRequest),
    taskEither.chainEitherK(parseGame)
  );
}

export const getGameTypes = () => {
  const makeRequest = (headers: ApiHeaders) => getRequest<GameType[]>("/api/gametypes", headers);

  return pipe(
    getRequestHeaders(),
    taskEither.chain(makeRequest)
  );
}

export const getGameType = (gameTypeId: string) => {
  const makeRequest = (headers: ApiHeaders) => getRequest<GameType>(`/api/gametypes/${gameTypeId}`, headers);

  return pipe(
    getRequestHeaders(),
    taskEither.chain(makeRequest)
  );
}

export const getQuestions = (gameTypeId: string) => {
  const makeRequest = (headers: ApiHeaders) => getRequest<Question[]>(`api/gametypes/${gameTypeId}/questions`, headers);

  return pipe(
    getRequestHeaders(),
    taskEither.chain(makeRequest)
  );
}

export const getAnswers = (questionId: string) => {
  const makeRequest = (headers: ApiHeaders) => getRequest<Answer[]>(`api/questions/${questionId}/answers`, headers);

  return pipe(
    getRequestHeaders(),
    taskEither.chain(makeRequest)
  );
}

export const submitAnswer = (gameId: string, questionId: string, answerId: string) => {
  const makeRequest = (headers: ApiHeaders) => postRequestWithoutResult(`api/games/${gameId}/questions/${questionId}/answers/${answerId}`, undefined, headers);

  return pipe(
    getRequestHeaders(),
    taskEither.chain(makeRequest)
  );
}

export const finishGame = (playerId: string, time: Date) => {
  const makeRequest = (headers: ApiHeaders) => patchRequestWithoutResult(`api/players/${playerId}/finish/${time.toISOString()}`, undefined, headers);

  return pipe(
    getRequestHeaders(),
    taskEither.chain(makeRequest)
  );
}

export const getPlayers = (gameId: string) => {
  const makeRequest = (headers: ApiHeaders) => getRequest<PlayerDto[]>(`/api/games/${gameId}/players`, headers);

  return pipe(
    getRequestHeaders(),
    taskEither.chain(makeRequest),
    taskEither.chainEitherK(array.traverse(either)(parsePlayer))
  );
};

export const getPlayer = (playerId: string) => {
  const makeRequest = (headers: ApiHeaders) => getRequest<PlayerDto>(`/api/players/${playerId}`, headers);

  return pipe(
    getRequestHeaders(),
    taskEither.chain(makeRequest),
    taskEither.chainEitherK(parsePlayer)
  );
};

export const getUsername = (playerId: string) => {
  const makeRequest = (headers: ApiHeaders) => getTextRequest(`/api/players/${playerId}/username`, headers);

  return pipe(
    getRequestHeaders(),
    taskEither.chain(makeRequest),
  );
}

export const joinGame = (gameId: string) => {
  const makeRequest = (headers: ApiHeaders) => postRequest<PlayerDto>(`/api/games/${gameId}/players`, undefined, headers);

  return pipe(
    getRequestHeaders(),
    taskEither.chain(makeRequest),
    taskEither.chainEitherK(parsePlayer)
  );
}