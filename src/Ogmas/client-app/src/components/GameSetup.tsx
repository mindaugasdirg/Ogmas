import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import { Game } from "../types/types"
import { Loader } from "./Loader"
import format from "date-fns/format";

interface Props {
  game?: Game;
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
  }
}));

export const GameSetup = (props: Props) => {
  const classes = useStyles();

  const renderGameSetup = (hosted: Game) => (
    <Typography variant="body2" component="p">
      Start time: {hosted.startTime.toLocaleString()}
      <br />
      Interval between starts: {format(hosted.startInterval, "HH:mm:ss")}
    </Typography>
  );

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h2" className={classes.title}>Game Setup</Typography>
        <Loader resource={props.game} render={renderGameSetup} />
      </CardContent>
    </Card>
  )
}