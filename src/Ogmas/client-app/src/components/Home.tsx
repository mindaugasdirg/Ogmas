import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from '@material-ui/core/styles';
import React from "react";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(4)
  }
}));

export const Home = () => {
  const classes = useStyles();
  
  return (
    <Grid container spacing={3} className={classes.root}>
      <Grid item xs={12}>
        <Typography variant="h2">Ready for some exploration?</Typography>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="secondary" component={Link} to="/create-game">Create Game</Button>
      </Grid>
    </Grid>
  );
};