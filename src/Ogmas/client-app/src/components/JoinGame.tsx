import Typography from "@material-ui/core/Typography";
import { task, taskEither } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import React, { Fragment } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { joinGame } from "../clients/ApiClient";
import { useAuthorizeComponent, useErrorHelper } from "../functions/hooks";
import { AlertsContainer } from "./AlertsContainer";

interface RouteParams {
  game: string;
}

export const JoinGame = (props: RouteComponentProps<RouteParams>) => {
  const history = useHistory();
  const [addAlert, setAddAlert] = useErrorHelper();

  useAuthorizeComponent();

  React.useEffect(() => {
    pipe(
      joinGame(props.match.params.game),
      taskEither.fold(
        left => task.fromIO(() => addAlert(`Error while joining game: ${left.message}`, "error")),
        right => task.fromIO(() => {
          console.log("game joined");
          console.log("player ID: ", right.id);
          history.push(`/game/${right.id}`)
        })
      )
    )();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.match.params.game, history]);

  return (
    <Fragment>
      <Typography>Joining game...</Typography>
      <AlertsContainer setter={setAddAlert} />
    </Fragment>
  );
}