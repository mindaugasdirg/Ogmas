import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import DateFnsUtils from '@date-io/date-fns';
import MuiPickersUtilsProvider from "@material-ui/pickers/MuiPickersUtilsProvider";
import React from "react";
import { DateTimePicker } from "@material-ui/pickers/DateTimePicker";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { TimePicker } from "@material-ui/pickers/TimePicker";
import { makeStyles } from '@material-ui/core/styles';
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { GameType } from "../types/types";
import { array, task, taskEither } from "fp-ts";
import { pipe } from "fp-ts/lib/function";
import { createGame, getGameTypes } from "../clients/ApiClient";
import { useHistory } from "react-router";
import { AlertsContainer } from "./AlertsContainer";
import { useErrorHelper } from "../hooks";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const CreateGame = () => {
  const [gameTypes, setGameTypes] = React.useState<GameType[]>([]);
  const [gameType, setGameType] = React.useState<string>("");
  const [startDate, setSelectedDate] = React.useState<MaterialUiPickersDate>(new Date());
  const [timeInterval, setTimeInterval] = React.useState<MaterialUiPickersDate>(new Date("2021-01-01T00:05:00.000"));
  const [addAlert, setAddAlert] = useErrorHelper();
  const history = useHistory();
  const classes = useStyles();

  React.useEffect(() => {
    const updateGameTypes = pipe(
      getGameTypes(),
      taskEither.fold(
        left => task.fromIO(() => {
          console.log("Error getting games: ", left);
          addAlert(left.message, "error");
        }),
        right => task.fromIO(() => setGameTypes(right))
      )
    );

    updateGameTypes();
  }, []);

  const create = async () => {
    if(!gameType || !startDate || !timeInterval) {
      addAlert("All fields must be filled", "error");
      return;
    }

    const result = pipe(
      createGame(gameType, startDate, timeInterval),
      taskEither.fold(
        left => task.fromIO(() => {
          console.log("Game creation failed: ", left);
          addAlert(left.message, "error");
        }),
        right => task.fromIO(() => {
          console.log("Game created: ", right.id);
          console.log("Game: ", right);
          history.push(`/game-host/${right.id}`);
        })
      )
    );

    await result();
  };
  const onGameTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => setGameType(event.target.value as string);
  const mapGameTypes = array.map((type: GameType) => <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>);

  return (
    <Container maxWidth="xs">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div className={classes.paper}>
          <Typography component="h1" variant="h4">Create Game</Typography>
          <form className={classes.form}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Game type</InputLabel>
                <Select
                  value={gameType}
                  onChange={onGameTypeChange}
                >
                  {mapGameTypes(gameTypes)}
                </Select>
              </FormControl>
              </Grid>
              <Grid item xs={12}>
                <DateTimePicker fullWidth ampm={false} variant="inline" label="Start time" value={startDate} onChange={setSelectedDate} />
              </Grid>
              <Grid item xs={12}>
                <TimePicker
                  fullWidth
                  ampm={false}
                  views={["hours", "minutes", "seconds"]}
                  format="HH:mm:ss"
                  variant="inline"
                  label="Time between starts"
                  value={timeInterval}
                  onChange={setTimeInterval}
                />
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth color="primary" variant="contained" disableElevation onClick={create} className={classes.button}>Create</Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </MuiPickersUtilsProvider>
      <AlertsContainer setter={setAddAlert} />
    </Container>
  );
};