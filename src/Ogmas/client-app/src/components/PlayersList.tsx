import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { array } from "fp-ts";
import { Player } from "../types/types";
import { Loader } from "./Loader";

interface Props {
  joinLink: string;
  players: Player[];
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
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

export const PlayersList = (props: Props) => {
  const classes = useStyles();

  const renderPlayers = (players: Player[]) => players.length === 0 ? renderEmptyList() : renderPlayersTable(players);
  const renderEmptyList = () => <Typography variant="body2" component="p">No players have joined yet</Typography>;
  
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
              <TableCell>{p.name || p.id}</TableCell>
              <TableCell>{p.startTime.toLocaleString()}</TableCell>
              <TableCell>{p.finishTime ? p.finishTime.toLocaleString() : ""}</TableCell>
              <TableCell>{p.score}</TableCell>
            </TableRow>
          ))(players)}
        </TableBody>
      </Table>
    </TableContainer>
  
  );

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h2" className={classes.title}>Players</Typography>
        <Typography variant="body1" component="p">Join link: {props.joinLink}</Typography>
        <Divider className={classes.divider} />
        <Loader resource={props.players} condition={x => !!x} render={renderPlayers} />
      </CardContent>
    </Card>
  );
};