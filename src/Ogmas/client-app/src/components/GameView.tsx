import { task, taskEither } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import React, { Fragment } from "react";
import { RouteComponentProps } from "react-router-dom";
import { finishGame, getGame, getGameType, getPlayer, getQuestions, submitAnswer } from "../clients/ApiClient";
import { useErrorHelper } from "../hooks";
import { Game, GameData, Player, Question, TypedError } from "../types/types";
import { AlertsContainer } from "./AlertsContainer";
import { Loader } from "./Loader";
import { Map } from "./Map";
import { SubmitAnswer } from "./SubmitAnswer";
import { FabHolder } from './FabHolder';
import Fab from '@material-ui/core/Fab';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import Card from "@material-ui/core/Card";
import { CardContent, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { safeCall } from "../utils";

interface RouteParams {
  player: string;
}

const useStyles = makeStyles((theme) => ({
  fab: {
    zIndex: 1
  }
}));

export const GameView = (props: RouteComponentProps<RouteParams>) => {
  const [game, setGame] = React.useState<Game>();
  const [gameData, setGameData] = React.useState<GameData>();
  const [player, setPlayer] = React.useState<Player>();
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = React.useState<Question>();
  const [showMap, setShowMap] = React.useState(true);
  const [removeSelected, setRemoveSelected] = React.useState<() => void>();
  const [addAlert, setAddAlert] = useErrorHelper();
  const classes = useStyles();

  React.useEffect(() => {
    const getGamePlayer = pipe(
      getPlayer(props.match.params.player),
      taskEither.fold(
        left => task.fromIO(() => addAlert(left.message, "error")),
        right => task.fromIO(() => setPlayer(right))
      )
    );
    getGamePlayer();
  }, [props.match.params.player]);

  React.useEffect(() => {
    if (!player) return;

    const getCurrentGame = pipe(
      getGame(player.gameId),
      taskEither.fold(
        left => task.fromIO(() => addAlert(left.message, "error")),
        right => task.fromIO(() => setGame(right))
      )
    );
    getCurrentGame();
  }, [player]);

  React.useEffect(() => {
    if (!game) return;

    const getGameData = pipe(
      getGameType(game.gameTypeId),
      taskEither.fold(
        left => task.fromIO(() => addAlert(left.message, "error")),
        right => task.fromIO(() => setGameData(right))
      )
    );
    getGameData();
  }, [game]);

  React.useEffect(() => {
    if (!gameData) return;

    const getGameQuestions = pipe(
      getQuestions(gameData.id),
      taskEither.fold(
        left => task.fromIO(() => addAlert(left.message, "error")),
        right => task.fromIO(() => setQuestions(right))
      )
    );
    getGameQuestions();
  }, [gameData]);

  React.useEffect(() => {
    if(!player) return;

    const sendGameFinish = pipe(
      finishGame(player.id, new Date()),
      taskEither.fold(
        left => task.fromIO(() => addAlert(left.message, "error")),
        right => task.fromIO(() => {})
      )
    );

    const allAnswered = questions.length > 0 && questions.every(x => x.answered);
    if (allAnswered) {
      console.log("finishing game");
      sendGameFinish();
    }
  }, [player, questions]);

  const handleAnswer = async (answer: string) => {
    if (!game) return;
    if (!selectedQuestion) {
      addAlert("No question circle is selected", "error");
      return;
    }

    const sendAnswer = pipe(
      submitAnswer(game.id, selectedQuestion.id, answer),
      taskEither.fold(
        left => task.fromIO(() => addAlert(left.message, "error")),
        right => task.fromIO(() => {
          setQuestions([...questions.filter(x => x.id !== selectedQuestion.id), { ...selectedQuestion, answered: true }]);
          safeCall(removeSelected)();
          setSelectedQuestion(undefined);
        })
      ),
      task.map(task.fromIO(() => { setShowMap(true); }))
    );
    await sendAnswer();
  };

  const onError = (error: TypedError) => addAlert(error.message, "error");

  const giveHint = () => {
    selectedQuestion && addAlert(selectedQuestion.hint, "info");
  };

  const toggleQrMode = () => {
    !showMap && setSelectedQuestion(undefined);
    setShowMap(!showMap);
  };

  const renderView = ({ questions: definedQuestions }: { questions: Question[] }) => (
    <Fragment>
      {selectedQuestion &&
        <Fragment>
          <Card>
            <CardContent>
              <Typography variant="body1">{selectedQuestion.question}</Typography>
              <Button variant="text" onClick={giveHint}>Hint</Button>
            </CardContent>
          </Card>
          <FabHolder side="left">
            <Fab color="primary" onClick={toggleQrMode}><CameraAltIcon /></Fab>
          </FabHolder>
        </Fragment>
      }
      {showMap ?
        <Map questions={definedQuestions.filter(x => !x.answered)} onQuestionSelected={setSelectedQuestion} removeSelectedCallback={callback => setRemoveSelected(() => callback)} /> :
        <SubmitAnswer submit={handleAnswer} onError={onError} />
      }
    </Fragment>
  );

  return (
    <div>
      <Loader resource={{ questions, gameData, game } as any} condition={(data: any) => data && data.game && data.gameData && data.questions?.length} render={renderView} />
      <AlertsContainer setter={setAddAlert} />
    </div>
  );
};