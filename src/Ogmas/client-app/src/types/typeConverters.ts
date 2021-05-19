import { either } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import { Game, GameDto, Player, PlayerDto, TypedError } from "./types";

const validateDateString = (date: string): either.Either<TypedError, Date> => {
  const timestamp = Date.parse(date.endsWith("Z") ? date : `${date}Z`);
  if(!timestamp || isNaN(timestamp)) {
    return either.left(new TypedError("ParseError", "start time is invalid date"));
  }

  return either.right(new Date(timestamp));
};

export const parseGame = (response: GameDto): either.Either<TypedError, Game> => {
  const startInterval = new Date(2020, 1, 1, 0, 0, response.startInterval);

  return pipe(
    validateDateString(response.startTime),
    either.map(date => ({
      id: response.id,
      startTime: date,
      startInterval: startInterval,
      gameTypeId: response.gameTypeId,
      organizerId: response.organizerId
    }))
  );
};

export const parsePlayer = (response: PlayerDto): either.Either<TypedError, Player> => {
  const finishTime = response.finishTime ? new Date(response.finishTime) : undefined;

  return pipe(
    validateDateString(response.startTime),
    either.map(startTime => ({
      id: response.id,
      startTime,
      finishTime,
      gameId: response.gameId,
      playerId: response.playerId,
      score: 0
    }))
  );
};