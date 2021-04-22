import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import QrCode from "qrcode.react";
import React, { Fragment } from "react";
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import Grid from "@material-ui/core/Grid";

interface Props {
  title: string;
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
    marginBottom: 12
  }
}));

export const QrTile = (props: Props) => {
  const classes = useStyles();

  return (
    <Fragment>
      <QrCode value={props.value} size={128} includeMargin={false} style={{ marginLeft: "48px"}} />
      <Grid container>
        <Grid item xs={1}>
          {props.correct ? <CheckIcon color="action" /> : <ClearIcon color="error" />}
        </Grid>
        <Grid item xs={11}>
          <Typography variant="body1" className={classes.title}>{props.title}</Typography>
        </Grid>
      </Grid>
    </Fragment>
  );
};