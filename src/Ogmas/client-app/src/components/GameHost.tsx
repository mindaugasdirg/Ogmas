import { array, task, taskEither } from "fp-ts";
import { flow, pipe } from "fp-ts/lib/function";
import React from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { getAnswers, getGame, getGameType, getPlayers, getQuestions, getUsername } from "../clients/ApiClient";
import { Game, GameData, Player, Question } from "../types/types";
import { Fragment } from "react";
import { useAuthorizeComponent, useErrorHelper } from "../functions/hooks";
import { AlertsContainer } from "./AlertsContainer";
import { GameSetup } from "./GameSetup";
import { PlayersList } from "./PlayersList";
import { QuestionsList } from "./QuestionsList";
import { foldError } from "../functions/utils";
import { getUser } from "../clients/AuthorizationClient";

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
  const history = useHistory();

  useAuthorizeComponent();

  React.useEffect(() => {
    const getHostedGame = pipe(
      getGame(props.match.params.game),
      foldError(addAlert, setHostedGame)
    );

    const getGamePlayers = pipe(
      getPlayers(props.match.params.game),
      foldError(addAlert, setPlayers)
    );

    getHostedGame();
    getGamePlayers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.match.params.game]);

  React.useEffect(() => {
    const retreiveUsername = (player: Player) => pipe(
      player.id,
      getUsername,
      foldError(addAlert, right => setNamedPlayers(prev => [...prev, { ...player, name: right }]))
    );

    players?.forEach(async player => {
      const namingPlayer = retreiveUsername(player);
      await namingPlayer();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players]);

  React.useEffect(() => {
    if (!hostedGame) return;

    const checkIfHost = async () => {
      const user = await getUser();
      if(!user || user.sub !== hostedGame.organizerId) {
        history.push("/");
      }
    }

    const getGameData = pipe(
      getGameType(hostedGame.gameTypeId),
      foldError(addAlert, setGameData)
    );
    
    checkIfHost();
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