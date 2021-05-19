import { array, taskEither } from "fp-ts";
import { flow, pipe } from "fp-ts/lib/function";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { getAnswers, getGame, getGameType, getPlayerAnswers, getPlayers, getQuestions, getUsername } from "../clients/ApiClient";
import { Game, GameData, PickedAnswer, Player, Question } from "../types/types";
import { Fragment } from "react";
import { useAuthorizeComponent, useCheckIfHost, useErrorHelper } from "../functions/hooks";
import { AlertsContainer } from "./AlertsContainer";
import { GameSetup } from "./GameSetup";
import { PlayersList } from "./PlayersList";
import { QuestionsList } from "./QuestionsList";
import { foldError } from "../functions/utils";

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
  const isHost = useCheckIfHost(hostedGame);

  React.useEffect(() => {
    const getHostedGame = pipe(
      getGame(props.match.params.game),
      foldError(addAlert, setHostedGame)
    );

    const getGamePlayers = pipe(
      getPlayers(props.match.params.game),
      foldError(addAlert, setPlayers)
    );

    const timerCleanup = setInterval(getGamePlayers, 60000);

    getHostedGame();
    getGamePlayers();
    return () => clearInterval(timerCleanup);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.match.params.game]);

  React.useEffect(() => {
    if(!hostedGame) return;

    const retreiveUsername = (player: Player) => pipe(
      player.id,
      getUsername,
      foldError(addAlert, right => setNamedPlayers(prev => [...prev, { ...player, name: right }]))
    );

    const retrievePlayerAnswers = (game: Game, player: Player) => pipe(
      getPlayerAnswers(game.id, player.id),
      taskEither.map(array.reduce(0, (sum: number, answer: PickedAnswer) => sum + (answer.isCorrect ? 100 : -50))),
      foldError(addAlert, right => setNamedPlayers(prev =>
        [{ ...prev[0], score: right - (prev[0].finishTime ? Math.floor((prev[0].finishTime.getTime() - prev[0].startTime.getTime()) / 60000) : 0) }, ...prev.slice(1)]))
    );

    setNamedPlayers([]);
    players?.forEach(async player => {
      const namingPlayer = retreiveUsername(player);
      await namingPlayer();
      await retrievePlayerAnswers(hostedGame, player)();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players]);

  React.useEffect(() => {
    if (!hostedGame || !isHost) return;

    const getGameData = pipe(
      getGameType(hostedGame.gameTypeId),
      foldError(addAlert, setGameData)
    );

    getGameData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hostedGame, isHost]);

  React.useEffect(() => {
    if (!gameData) return;

    const getGameQuestions = pipe(
      getQuestions(gameData.id),
      taskEither.chain(flow(
        array.map((question: Question) => pipe(question.id, getAnswers, taskEither.map(answers => ({ ...question, answers })))),
        array.sequence(taskEither.taskEither))
      ),
      foldError(addAlert, setQuestions)
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