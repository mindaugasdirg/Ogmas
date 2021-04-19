import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { array, task, taskEither } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { getGame, getPlayers } from "../clients/ApiClient";
import { Game, Player } from "../types/types";
import format from "date-fns/format";
import { makeStyles } from '@material-ui/core/styles';
import { Fragment } from "react";
import { Loader } from "./Loader";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

interface RouteParams {
  game: string;
}

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    minWidth: 275
  },
  title: {
    marginBottom: 12
  }
}));

export const GameHost = (props: RouteComponentProps<RouteParams>) => {
  const [hostedGame, setHostedGame] = React.useState<Game>();
  const [players, setPlayers] = React.useState<Player[]>();
  const classes = useStyles();

  React.useEffect(() => {
    const getHostedGame = pipe(
      getGame(props.match.params.game),
      taskEither.fold(
        left => task.fromIO(() => console.log("Error getting game: ", left)),
        right => task.fromIO(() => setHostedGame(right))
      )
    );

    const getGamePlayers = pipe(
      getPlayers(props.match.params.game),
      taskEither.fold(
        left => task.fromIO(() => console.log("Error getting players: ", left)),
        right => task.fromIO(() => setPlayers(right))
      )
    );

    getHostedGame();
    getGamePlayers();
  }, [props.match.params.game]);

  const renderGameSetup = (hosted: Game) => (
    <Fragment>
      <Typography variant="body2" component="p">
        Start time: {hostedGame!.startTime.toLocaleString()}
        <br />
        Interval between starts: {format(hostedGame!.startInterval, "HH:mm:ss")}
      </Typography>
    </Fragment>
  );

  const renderPlayers = (players: Player[]) => players.length === 0 ? renderEmptyList() : renderPlayersTable(players);
  
  const renderPlayersTable = (players: Player[]) => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Player</TableCell>
            <TableCell>Start time</TableCell>
            <TableCell>Finish time</TableCell>
            <TableCell>Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {array.map((p: Player) => (
            <TableRow key={p.id}>
              <TableCell>{p.id}</TableCell>
              <TableCell>{p.startTime.toLocaleString()}</TableCell>
              <TableCell>{p.finishTime ? p.finishTime.toLocaleString() : ""}</TableCell>
              <TableCell>{0}</TableCell>
            </TableRow>
          ))(players)}
        </TableBody>
      </Table>
    </TableContainer>
  
  );
  const renderEmptyList = () => (
    <Fragment>
      <Typography variant="body2" component="p">No players have joined yet</Typography>
    </Fragment>
  );

  return (
    <Fragment>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" component="h2" className={classes.title}>Game Setup</Typography>
          <Loader resource={hostedGame} render={renderGameSetup} />
        </CardContent>
      </Card>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" component="h2" className={classes.title}>Players</Typography>
          <Loader resource={players} condition={x => !!x} render={renderPlayers} />
        </CardContent>
      </Card>
    </Fragment>
  );
};