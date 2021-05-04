import { array, task, taskEither } from "fp-ts";
import { flow, pipe } from "fp-ts/lib/function";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { getAnswers, getGame, getGameType, getPlayers, getQuestions, getUsername } from "../clients/ApiClient";
import { Game, GameData, Player, Question } from "../types/types";
import { Fragment } from "react";
import { useAuthorizeComponent, useErrorHelper } from "../functions/hooks";
import { AlertsContainer } from "./AlertsContainer";
import { GameSetup } from "./GameSetup";
import { PlayersList } from "./PlayersList";
import { QuestionsList } from "./QuestionsList";

interface RouteParams {
  game: string;
}

export const GameHost = (props: RouteComponentProps<RouteParams>) => {
  const [hostedGame, setHostedGame] = React.useState<Game>();
  const [gameData, setGameData] = React.useState<GameData>();
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [players, setPlayers] = React.useState<Player[]>();
  const [namedPlayers, setNamedPlayers] = React.useState<Player[]>([]);
  const [addAlert, setAddAlert] = useErrorHelper();

  useAuthorizeComponent();

  React.useEffect(() => {
    const getHostedGame = pipe(
      getGame(props.match.params.game),
      taskEither.fold(
        left => task.fromIO(() => addAlert(left.message, "error")),
        right => task.fromIO(() => setHostedGame(right))
      )
    );

    const getGamePlayers = pipe(
      getPlayers(props.match.params.game),
      taskEither.fold(
        left => task.fromIO(() => addAlert(left.message, "error")),
        right => task.fromIO(() => setPlayers(right))
      )
    );

    getHostedGame();
    getGamePlayers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.match.params.game]);

  React.useEffect(() => {
    const retreiveUsername = (player: Player) => pipe(
      player.id,
      getUsername,
      taskEither.fold(
        left => task.fromIO(() => addAlert(left.message, "error")),
        right => task.fromIO(() => setNamedPlayers(prev => [...prev, { ...player, name: right }]))
      )
    );

    players?.forEach(async player => {
      const namingPlayer = retreiveUsername(player);
      await namingPlayer();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players]);

  React.useEffect(() => {
    if (!hostedGame) return;

    const getGameData = pipe(
      getGameType(hostedGame.gameTypeId),
      taskEither.fold(
        left => task.fromIO(() => addAlert(left.message, "error")),
        right => task.fromIO(() => setGameData(right))
      )
    );
    getGameData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hostedGame]);

  React.useEffect(() => {
    if (!gameData) return;

    const getGameQuestions = pipe(
      getQuestions(gameData.id),
      taskEither.chain(flow(
        array.map((question: Question) => pipe(question.id, getAnswers, taskEither.map(answers => ({ ...question, answers })))),
        array.sequence(taskEither.taskEither))
      ),
      // taskEither.chain(flow(array.map(question => ({ ...question, })), array.sequence(taskEither))),
      taskEither.fold(
        left => task.fromIO(() => addAlert(left.message, "error")),
        right => task.fromIO(() => setQuestions(right))
      )
    );
    getGameQuestions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameData]);

  return (
    <Fragment>
      <GameSetup game={hostedGame}/>
      <PlayersList players={namedPlayers} joinLink={`${window.location.protocol}//${window.location.host}/join-game/${props.match.params.game}`} />
      <QuestionsList questions={questions} />
      <AlertsContainer setter={setAddAlert} />
    </Fragment>
  );
};