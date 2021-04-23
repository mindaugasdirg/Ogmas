import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccordionDetails from "@material-ui/core/AccordionDetails";
import { QrTile } from "./QrTile";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Answer, Question } from "../types/types";
import { array } from "fp-ts";

interface Props {
  questions: Question[];
}

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    minWidth: 275
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  paperTitle: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginBottom: 12
  },
}));

export const QuestionsList = (props: Props) => {
  const classes = useStyles();

  return (
    <Paper className={classes.card}>
      <Typography variant="h5" component="h2" className={classes.paperTitle}>Answers</Typography>
      <Typography variant="body2" className={classes.paperTitle}>Print each QR code and place them at the correct locations</Typography>
      {array.map((question: Question) =>
        <Accordion key={question.id}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>{question.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {question.answers && array.map((answer: Answer) =>
                <Grid key={answer.id} item xs={3}>
                  <QrTile title={answer.answer} subtitle={answer.location} value={answer.id} correct={answer.isCorrect} />
                </Grid>
              )(question.answers)}
            </Grid>
          </AccordionDetails>
        </Accordion>
      )(props.questions)}
    </Paper>
  );
};