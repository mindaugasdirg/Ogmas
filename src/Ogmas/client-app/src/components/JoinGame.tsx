import Typography from "@material-ui/core/Typography";
import { task, taskEither } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import React from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { joinGame } from "../clients/ApiClient";
import { Player } from "../types/types";

interface RouteParams {
  game: string;
}

export const JoinGame = (props: RouteComponentProps<RouteParams>) => {
  const history = useHistory();

  React.useEffect(() => {
    pipe(
      joinGame(props.match.params.game),
      taskEither.fold(
        left => task.fromIO(() => console.log("Error joining game: ", left)),
        right => task.fromIO(() => {
          console.log("game joined");
          console.log("player ID: ", right.id);
          history.push(`/game/${right.id}`)
        })
      )
    )();
  }, [props.match.params.game, history]);

  return <Typography>Joining game...</Typography>;
}