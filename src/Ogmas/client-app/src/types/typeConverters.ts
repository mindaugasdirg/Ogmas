import { either } from "fp-ts";
import { Game, GameDto } from "./types";

export const parseGame = (response: GameDto): either.Either<Error, Game> => {
  const timestamp = Date.parse(response.startTime);
  if(!timestamp || isNaN(timestamp)) {
    either.left(new Error("start time is invalid date"));
  }

  const startInterval = new Date(2020, 1, 1, 0, 0, response.startInterval);

  return either.right({
    id: response.id,
    startTime: new Date(timestamp),
    startInterval: startInterval,
    gameTypeId: response.gameTypeId,
    organizerId: response.organizerId
  });
};