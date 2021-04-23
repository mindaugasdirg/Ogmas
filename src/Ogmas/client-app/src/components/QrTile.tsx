import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import QrCode from "qrcode.react";
import React, { Fragment } from "react";
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import Grid from "@material-ui/core/Grid";

interface Props {
  title: string;
  subtitle: string;
  value: string;
  correct?: boolean;
}

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    minWidth: 275
  },
  title: {
    marginLeft: 12
  }
}));

export const QrTile = (props: Props) => {
  const classes = useStyles();

  return (
    <Fragment>
      <QrCode value={props.value} size={128} includeMargin={false} />
      <Grid container className={classes.title} alignItems="center">
        <Grid item xs={12}>
          <Typography variant="body1">Is correct:
          {props.correct ? <CheckIcon color="action" /> : <ClearIcon color="error" />}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">{props.title}</Typography>
          <Typography variant="body2">{props.subtitle}</Typography>
        </Grid>
      </Grid>
    </Fragment>
  );
};