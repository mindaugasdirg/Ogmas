import { array, taskEither } from "fp-ts";
import { either } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { parseGame, parsePlayer } from "../types/typeConverters";
import { GameDto, GameType, PlayerDto } from "../types/types";
import { getAccessTokenFp } from "./AuthorizationClient";
import { getRequest, postRequest } from "./request";

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

export const getPlayers = (gameId: string) => {
  const makeRequest = (headers: ApiHeaders) => getRequest<PlayerDto[]>(`/api/games/${gameId}/players`, headers);

  return pipe(
    getRequestHeaders(),
    taskEither.chain(makeRequest),
    taskEither.chainEitherK(array.traverse(either)(parsePlayer))
  );
};