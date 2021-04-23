import { array, task, taskEither } from "fp-ts";
import { flow, pipe } from "fp-ts/lib/function";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { getAnswers, getGame, getGameType, getPlayers, getQuestions, getUsername } from "../clients/ApiClient";
import { Game, GameData, Player, Question } from "../types/types";
import { makeStyles } from '@material-ui/core/styles';
import { Fragment } from "react";
import { useErrorHelper } from "../hooks";
import { AlertsContainer } from "./AlertsContainer";
import { GameSetup } from "./GameSetup";
import { PlayersList } from "./PlayersList";
import { QuestionsList } from "./QuestionsList";

interface RouteParams {
  game: string;
}

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    minWidth: 275
  },
  title: {
    marginBottom: 12
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  paperTitle: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginBottom: 12
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

export const GameHost = (props: RouteComponentProps<RouteParams>) => {
  const [hostedGame, setHostedGame] = React.useState<Game>();
  const [gameData, setGameData] = React.useState<GameData>();
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [players, setPlayers] = React.useState<Player[]>();
  const [namedPlayers, setNamedPlayers] = React.useState<Player[]>([]);
  const [addAlert, setAddAlert] = useErrorHelper();
  const classes = useStyles();

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