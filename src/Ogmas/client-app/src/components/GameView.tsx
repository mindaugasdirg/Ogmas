import { task } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import React, { Fragment } from "react";
import { RouteComponentProps } from "react-router-dom";
import { finishGame, getGame, getGameType, getPlayer, getQuestions, submitAnswer } from "../clients/ApiClient";
import { useAuthorizeComponent, useErrorHelper } from "../functions/hooks";
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
import { foldError, safeCall } from "../functions/utils";

interface RouteParams {
  player: string;
}

export const GameView = (props: RouteComponentProps<RouteParams>) => {
  const [game, setGame] = React.useState<Game>();
  const [gameData, setGameData] = React.useState<GameData>();
  const [player, setPlayer] = React.useState<Player>();
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = React.useState<Question>();
  const [showMap, setShowMap] = React.useState(true);
  const [removeSelected, setRemoveSelected] = React.useState<() => void>();
  const [addAlert, setAddAlert] = useErrorHelper();

  useAuthorizeComponent();

  React.useEffect(() => {
    const getGamePlayer = pipe(
      getPlayer(props.match.params.player),
      foldError(addAlert, setPlayer)
    );
    getGamePlayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.match.params.player]);

  React.useEffect(() => {
    if (!player) return;

    const getCurrentGame = pipe(
      getGame(player.gameId),
      foldError(addAlert, setGame)
    );
    getCurrentGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]);

  React.useEffect(() => {
    if (!game) return;

    const getGameData = pipe(
      getGameType(game.gameTypeId),
      foldError(addAlert, setGameData)
    );
    getGameData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game]);

  React.useEffect(() => {
    if (!gameData) return;

    const getGameQuestions = pipe(
      getQuestions(gameData.id),
      foldError(addAlert, setQuestions)
    );
    getGameQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameData]);

  React.useEffect(() => {
    if (!player) return;

    const sendGameFinish = pipe(
      finishGame(player.id, new Date()),
      foldError(addAlert, () => { })
    );

    const allAnswered = questions.length > 0 && questions.every(x => x.answered);
    if (allAnswered) {
      console.log("finishing game");
      sendGameFinish();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, questions]);

  const handleAnswer = async (answer: string) => {
    if (!game) return;
    if (!selectedQuestion) {
      addAlert("No question circle is selected", "error");
      return;
    }

    const sendAnswer = pipe(
      submitAnswer(game.id, selectedQuestion.id, answer),
      foldError(addAlert,
        right => {
          setQuestions([...questions.filter(x => x.id !== selectedQuestion.id), { ...selectedQuestion, answered: true }]);
          safeCall(removeSelected)();
        }
      ),
      task.map(task.fromIO(() => setSelectedQuestion(undefined))),
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

  const renderView = ({ questions: definedQuestions, player: definedPlayer }: { questions: Question[]; player: Player }) => {
    console.log(definedPlayer.startTime.getTime(), new Date().getTime());
    if(definedPlayer.startTime.getTime() > new Date().getTime()) {
      return <Typography variant="body1">You start at {definedPlayer.startTime.toLocaleString()}</Typography>
    }

    return (
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
  }

  return (
    <div>
      <Loader resource={{ questions, gameData, game, player } as any} condition={(data: any) => data && data.game && data.gameData && data.questions?.length} render={renderView} />
      <AlertsContainer setter={setAddAlert} />
    </div>
  );
};