import Snackbar from "@material-ui/core/Snackbar";
import React from "react";
import MuiAlert from '@material-ui/lab/Alert';
import { SeverityTypes } from "../types/types";

interface Props {
  setter: (func: (message: string, severity: SeverityTypes) => void) => void;
}

interface Alert {
  message: string;
  severity: SeverityTypes;
}

export const AlertsContainer = (props: Props) => {
  const [messages, setMessages] = React.useState<Alert[]>([]);
  const [alert, setAlert] = React.useState<Alert>();
  const [open, setOpen] = React.useState(false);

  const closeHandler = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    props.setter(() => (message: string, severity: SeverityTypes) => {
      console.log("adding notification");
      setMessages(prev => [...prev, { message, severity }]);
      setOpen(true);
    });
  }, []);

  React.useEffect(() => {
    if (messages.length && !alert) {
      setAlert({ ...messages[0] });
      setMessages(messages.slice(1));
      setOpen(true);
    } else if(messages.length && alert && open) {
      setOpen(false);
      setAlert(undefined);
    }
  }, [messages, alert, open]);

  return (
    <Snackbar open={open} autoHideDuration={5000} onExited={closeHandler}>
      <MuiAlert elevation={6} variant="filled" onClose={closeHandler} severity={alert?.severity}>{alert?.message}</MuiAlert>
    </Snackbar>
  );
}