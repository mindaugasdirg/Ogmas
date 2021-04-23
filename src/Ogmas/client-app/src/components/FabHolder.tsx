import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const useStyles = makeStyles(theme =>
  createStyles({
    container: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    }
  })
);

export const FabHolder = (props: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {props.children}
    </div>
  );
};