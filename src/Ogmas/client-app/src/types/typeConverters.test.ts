import { either } from "fp-ts";
import { parseGame, parsePlayer } from "./typeConverters";
import { Game, GameDto, Player, PlayerDto } from "./types";

describe("Type converters", () => {
  describe("parseGame", () => {
    it("should return game when gamedto has correct data", () => {
      const startTime = new Date();
      const dto: GameDto = {
        id: "id",
        startTime: startTime.toISOString(),
        startInterval: 300,
        gameTypeId: "type",
        organizerId: "user"
      };

      const result = parseGame(dto);

      expect(either.isRight(result)).toBe(true);
      const game = (result as either.Right<Game>).right;
      expect(game.id).toBe(dto.id);
      expect(game.gameTypeId).toBe(dto.gameTypeId);
      expect(game.organizerId).toBe(dto.organizerId);
      expect(game.startTime).toStrictEqual(startTime);
      expect(game.startInterval.getHours()).toBe(0);
      expect(game.startInterval.getMinutes()).toBe(5);
      expect(game.startInterval.getSeconds()).toBe(0);
    });

    it("should return error when date is invalid", () => {
      const dto: GameDto = {
        id: "id",
        startTime: "aaa",
        startInterval: 300,
        gameTypeId: "type",
        organizerId: "user"
      };

      const result = parseGame(dto);

      expect(either.isRight(result)).toBe(false);
      const error = (result as either.Left<Error>).left;
      expect(error.message).toBe("start time is invalid date");
    });
  });

  describe("parsePlayer", () => {
    it("should return player when playerdto has correct data", () => {
      const startTime = new Date();
      const dto: PlayerDto = {
        id: "id",
        gameId: "gameId",
        playerId: "playerId",
        startTime: startTime.toISOString(),
        finishTime: null
      };

      const result = parsePlayer(dto);

      expect(either.isRight(result)).toBe(true);
      const player = (result as either.Right<Player>).right;
      expect(player.id).toBe(dto.id);
      expect(player.gameId).toBe(dto.gameId);
      expect(player.playerId).toBe(dto.playerId);
      expect(player.startTime).toStrictEqual(startTime);
      expect(player.finishTime).toBe(undefined);
    });

    it("should return Error when startTime is invalid", () => {
      const dto: PlayerDto = {
        id: "id",
        gameId: "gameId",
        playerId: "playerId",
        startTime: "aaa",
        finishTime: null
      };

      const result = parsePlayer(dto);
      console.log(result);

      expect(either.isRight(result)).toBe(false);
      const error = (result as either.Left<Error>).left;
      expect(error.message).toBe("start time is invalid date");
    });
  });
});