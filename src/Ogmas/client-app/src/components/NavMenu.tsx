import React from 'react';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { LoginMenu } from './authorization/LoginMenu';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

export const NavMenu = () => {
  const classes = useStyles();
  
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Ogmas
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <LoginMenu/>
      </Toolbar>
    </AppBar>
  );
}
