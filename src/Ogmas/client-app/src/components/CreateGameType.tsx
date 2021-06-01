import {
  Button,
  Checkbox,
  Collapse,
  Divider,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { Fragment } from "react";
import { useErrorHelper, useMap, useMapStyles, useVectorLayer } from "../functions/hooks";
import { CreateTask } from "../types/types";
import DeleteIcon from "@material-ui/icons/Delete";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Draw, { DrawEvent } from "ol/interaction/Draw";
import GeometryType from "ol/geom/GeometryType";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import Geometry from "ol/geom/Geometry";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import { AlertsContainer } from "./AlertsContainer";
import { createGameConfiguration } from "../clients/ApiClient";
import { pipe } from "fp-ts/lib/function";
import { foldError, modifyListItem } from "../functions/utils";
import { task } from "fp-ts";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  controls: {
    padding: theme.spacing(2),
  },
  formControl: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  questions: {
    marginTop: theme.spacing(2),
  },
  sublist: {
    marginLeft: theme.spacing(6),
    marginRight: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  deleteIcon: {
    marginBottom: theme.spacing(2),
  },
}));

export const CreateGameType = () => {
  const classes = useStyles();
  const mapStyles = useMapStyles();
  const map = useMap("map");
  const vectorLayerSource = useVectorLayer(map, []);
  const answerVectorLayerSource = useVectorLayer(map, []);
  const [questions, setQuestions] = React.useState<CreateTask[]>([]);
  const [newQuestion, setNewQuestion] = React.useState("");
  const [newHint, setNewHint] = React.useState("");
  const [expanded, setExpanded] = React.useState(-1);
  const [newAnswer, setNewAnswer] = React.useState("");
  const [newX, setNewX] = React.useState<number>();
  const [newY, setNewY] = React.useState<number>();
  const [draw, setDraw] = React.useState<Draw>();
  const [name, setName] = React.useState("");
  const feature = React.useRef<Feature<Geometry>>();
  const [addAlert, setAddAlert] = useErrorHelper();
  const history = useHistory();

  const clearAnswerDetails = () => {
    setNewAnswer("");
    setNewX(undefined);
    setNewY(undefined);
    if (feature.current) {
      vectorLayerSource.removeFeature(feature.current);
      feature.current = undefined;
    }
  };

  React.useEffect(() => {
    setDraw(
      new Draw({
        type: GeometryType.POINT,
        source: vectorLayerSource,
      })
    );
  }, [vectorLayerSource]);

  React.useEffect(() => {
    draw?.on("drawstart", (event: DrawEvent) => {
      if (feature.current) {
        vectorLayerSource.removeFeature(feature.current);
      }

      const geometry = event.feature.getGeometry();
      if (!geometry) return;
      const [x, y] = (geometry as Point).getCoordinates();
      setNewX(x);
      setNewY(y);
      feature.current = event.feature;
    });
    draw && map.addInteraction(draw);
  }, [map, draw, vectorLayerSource]);

  React.useEffect(() => {
    if (!feature.current) return;

    feature.current.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({
            color: "#fce803",
          }),
          stroke: new Stroke({
            color: "#fff",
            width: 2,
          }),
        }),
      })
    );
  });

  React.useEffect(() => {
    answerVectorLayerSource.clear(true);
    if (expanded === -1 || expanded >= questions.length) return;

    const answers = questions[expanded].answers;
    answers.forEach((answer) => {
      if (!answer.x || !answer.y) return;

      const mapFeature = new Feature(new Point([answer.x, answer.y]));
      mapFeature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 6,
            fill: new Fill({
              color: "#08f200",
            }),
            stroke: new Stroke({
              color: "#fff",
              width: 2,
            }),
          }),
        })
      );
      console.log("adding: ", mapFeature);
      answerVectorLayerSource.addFeature(mapFeature);
    });
  }, [expanded, questions, answerVectorLayerSource]);

  const handleChange = (setter: (value: string) => void) => (event: React.ChangeEvent<HTMLInputElement>) => setter(event.target.value);
  const handleCheckboxChange = (questionI: number, question: CreateTask, checked: number) => () => {
    const newAnswers = question.answers.map((answer, index) => ({ ...answer, isCorrect: checked === index }));

    setQuestions(modifyListItem(questionI, (question) => ({ ...question, answers: newAnswers })));
  };

  const addQuestion = () => {
    if (!newQuestion && !newQuestion.trim()) {
      addAlert("Question cannot be empty", "error");
      return;
    }
    if (!newHint && !newHint.trim()) {
      addAlert("Question must have a hint", "error");
      return;
    }

    setQuestions((prev) => [
      {
        question: newQuestion,
        hint: newHint,
        answers: [],
        radius: 0,
        x: 0,
        y: 0,
      },
      ...prev,
    ]);
    setNewQuestion("");
    setNewHint("");
    feature.current = undefined;
  };

  const addAnswer = () => {
    if (!newAnswer) {
      addAlert("Answer cannot be empty", "error");
      return;
    }
    if (!newX || !newY || !feature.current) {
      addAlert("Answer must have location", "error");
      return;
    }

    const roundedX = Math.round(newX * 10000) / 10000;
    const roundedY = Math.round(newY * 10000) / 10000;

    const newAnswers = [
      ...questions[expanded].answers,
      { answer: newAnswer, location: `${roundedX}; ${roundedY}`, isCorrect: false, x: roundedX, y: roundedY },
    ];
    const [sumX, sumY] = newAnswers.reduce(([sumX, sumY], current) => [sumX + (current.x || 0), sumY + (current.y || 0)], [0, 0]);

    const centerX = sumX / newAnswers.length;
    const centerY = sumY / newAnswers.length;

    const radius =
      newAnswers.length >= 2
        ? newAnswers.reduce(
            (maxRadius, answer) =>
              Math.ceil(10000 * Math.max(maxRadius, Math.sqrt(Math.pow((answer.x || 0) - centerX, 2) + Math.pow((answer.y || 0) - centerY, 2)))) / 10000,
            0
          ) + 0.001
        : 0;
    setQuestions(
      modifyListItem(expanded, (question) => ({
        ...question,
        answers: newAnswers,
        radius,
        x: centerX,
        y: centerY,
      }))
    );

    clearAnswerDetails();
  };

  const expand = (index: number) => () => {
    const newIndex = expanded === index ? -1 : index;
    setExpanded(newIndex);
    clearAnswerDetails();
  };
  const removeQuestion = (index: number) => () => setQuestions((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)]);
  const removeAnswer = (questionIndex: number, answerIndex: number) => () => setQuestions(modifyListItem(questionIndex, question => ({
    ...question,
    answers: [
      ...question.answers.slice(0, answerIndex),
      ...question.answers.slice(answerIndex + 1)
    ]
  })))

  const createGame = () => {
    if (!name) {
      addAlert("Game configuration must have name", "error");
      return;
    } else if (!questions.length) {
      addAlert("Game configuration must have questions", "error");
      return;
    } else if (questions.some((question) => question.answers.length <= 1)) {
      addAlert("All questions must have at least two answers", "error");
      return;
    } else if (questions.some((questions) => questions.answers.filter((answer) => answer.isCorrect).length !== 1)) {
      addAlert("All questions must have one correct answer", "error");
      return;
    }

    const createGameRequest = pipe(
      createGameConfiguration({
        name,
        tasks: questions,
      }),
      foldError(
        addAlert,
        task.fromIO(() => history.push("/create-game"))
      )
    );

    createGameRequest();
  };

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={12} md={8}>
          <div id="map" style={mapStyles}></div>
        </Grid>
        <Grid item xs={12} md={4} className={classes.controls}>
          <Typography component="h1" variant="h4">
            Game Configuration
          </Typography>
          <Grid container>
            <Grid item lg={6} xs={12}>
              <FormControl fullWidth className={classes.formControl}>
                <TextField label="Game Name" value={name} onChange={handleChange(setName)} />
              </FormControl>
            </Grid>
            <Grid item lg={6} xs={12}>
              <FormControl fullWidth className={classes.formControl}>
                <Button variant="contained" color="primary" onClick={createGame}>
                  Save Game Configuration
                </Button>
              </FormControl>
            </Grid>
          </Grid>
          <Divider className={classes.divider} />
          <Typography component="h1" variant="h4">
            Questions
          </Typography>
          <FormControl fullWidth className={classes.formControl}>
            <TextField label="Question" value={newQuestion} onChange={handleChange(setNewQuestion)} />
          </FormControl>
          <FormControl fullWidth className={classes.formControl}>
            <TextField label="Hint" value={newHint} onChange={handleChange(setNewHint)} />
          </FormControl>
          <FormControl fullWidth className={classes.formControl}>
            <Button variant="contained" color="primary" onClick={addQuestion}>
              Add Question
            </Button>
          </FormControl>
          <Paper className={classes.questions}>
            <List subheader={<ListSubheader component="div">Questions</ListSubheader>}>
              {questions.map((question, index) => (
                <Fragment key={index}>
                  <ListItem button onClick={expand(index)}>
                    <ListItemText primary={question.question} secondary={question.hint} />
                    <ListItemSecondaryAction>
                      <IconButton aria-label="delete" onClick={removeQuestion(index)} className={classes.deleteIcon}>
                        <DeleteIcon />
                      </IconButton>
                      {expanded === index ? <ExpandLess /> : <ExpandMore />}
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <Collapse in={expanded === index} unmountOnExit className={classes.sublist}>
                    <List>
                      {question.answers.map((answer, answerIndex) => (
                        <ListItem key={answerIndex}>
                          <ListItemText primary={answer.answer} secondary={answer.location} />
                          <ListItemSecondaryAction>
                            <IconButton aria-label="delete" onClick={removeAnswer(index, answerIndex)}>
                              <DeleteIcon />
                            </IconButton>
                            <Checkbox edge="end" onChange={handleCheckboxChange(index, question, answerIndex)} checked={answer.isCorrect} />
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                    <Divider />
                    <FormControl fullWidth className={classes.formControl}>
                      <TextField label="Answer" value={newAnswer} onChange={handleChange(setNewAnswer)} />
                    </FormControl>
                    <FormControl fullWidth className={classes.formControl}>
                      <Button variant="contained" color="primary" onClick={addAnswer}>
                        Add Answer
                      </Button>
                    </FormControl>
                  </Collapse>
                </Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
      <AlertsContainer setter={setAddAlert} />
    </Fragment>
  );
};
