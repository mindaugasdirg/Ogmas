import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from '@material-ui/core/styles';
import React from "react";
import { Link, useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(4)
  },
  joinLinkField: {
    marginRight: theme.spacing(1),
    marginTop: 0
  },
  joinButton: {
    marginTop: theme.spacing(1)
  }
}));

export const Home = () => {
  const classes = useStyles();
  const history = useHistory();
  const [joinLink, setJoinLink] = React.useState("");

  const handleJoinLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => setJoinLink(event.target.value);
  const onJoinGame = () => {
    if(!joinLink && !(joinLink.trim())) return;

    const re = new RegExp(`https://${window.location.hostname}${window.location.port ? ":" + window.location.port : ""}/join-game/`);
    if(!re.test(joinLink)) {
      console.log("regext didn't match", joinLink);
      console.log(`https://${window.location.hostname}${window.location.port ? ":" + window.location.port : ""}/join-game/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}`);
      return;
    }

    history.push(new URL(joinLink).pathname);
  };
  
  return (
    <Grid container spacing={3} className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h2">Ready for some exploration?</Typography>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="secondary" component={Link} to="/create-game">Create Game</Button>
      </Grid>
      <Grid item xs={12}>
        <TextField className={classes.joinLinkField} label="Enter join link" value={joinLink} onChange={handleJoinLinkChange} />
        <Button className={classes.joinButton} variant="contained" color="secondary" onClick={onJoinGame}>Join Game</Button>
      </Grid>
    </Grid>
  );
};