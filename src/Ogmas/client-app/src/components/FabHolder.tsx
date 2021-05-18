import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";

interface Props {
  children: React.ReactNode;
  side: "left" | "right" | "topLeft" | "topRight";
}

const useStyles = makeStyles(theme =>
  createStyles({
    containerRight: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      zIndex: 1
    },
    containerLeft: {
      position: 'absolute',
      bottom: theme.spacing(2),
      left: theme.spacing(2),
      zIndex: 1
    },
    containerTopRight: {
      position: 'absolute',
      top: theme.spacing(2),
      right: theme.spacing(2),
      zIndex: 1
    },
    containerTopLeft: {
      position: 'absolute',
      top: theme.spacing(2),
      left: theme.spacing(2),
      zIndex: 1
    },
  })
);

const getClass = (classes: ReturnType<typeof useStyles>, name: Props["side"]) => {
  switch(name) {
    case "left":
      return classes.containerLeft;
      case "right":
      return classes.containerRight;
      case "topLeft":
      return classes.containerTopLeft;
      case "topRight":
      return classes.containerTopRight;
  }
}

export const FabHolder = (props: Props) => {
  const classes = useStyles();

  return (
    <div className={getClass(classes, props.side)}>
      {props.children}
    </div>
  );
};