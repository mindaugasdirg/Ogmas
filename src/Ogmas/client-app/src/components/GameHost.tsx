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
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccordionDetails from "@material-ui/core/AccordionDetails";
import { QrTile } from "./QrTile";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

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
      <Paper className={classes.card}>
        <Typography variant="h5" component="h2" className={classes.paperTitle}>Answers</Typography>
        <Typography variant="body2" className={classes.paperTitle}>Print each QR code and place them at the correct locations</Typography>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>Quetion 1</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={3}>
                <QrTile title={"aaaa aaaaaaa aaaaaaaaa aaaaaaaaaa aaaaaaaa"} value={"aaa"} correct={true} />
              </Grid>
              <Grid item xs={3}>
                <QrTile title={"bbb"} value={"bbb"} />
              </Grid>
              <Grid item xs={3}>
                <QrTile title={"ccc"} value={"ccc"} />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>Quetion 2</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={3}>
                <QrTile title={"aaa"} value={"aaa"} />
              </Grid>
              <Grid item xs={3}>
                <QrTile title={"bbb"} value={"bbb"} />
              </Grid>
              <Grid item xs={3}>
                <QrTile title={"ccc"} value={"ccc"} />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>Quetion 3</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={3}>
                <QrTile title={"aaa"} value={"aaa"} />
              </Grid>
              <Grid item xs={3}>
                <QrTile title={"bbb"} value={"bbb"} />
              </Grid>
              <Grid item xs={3}>
                <QrTile title={"ccc"} value={"ccc"} />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Fragment>
  );
};