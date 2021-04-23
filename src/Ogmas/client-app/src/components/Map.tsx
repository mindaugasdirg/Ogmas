import 'ol/ol.css';
import React, { Fragment } from "react";
import Point from 'ol/geom/Point';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { useFeature, useGeolocation, useMap, useSelect, useVectorLayer } from "../hooks";
import Circle from 'ol/geom/Circle';
import { Feature } from 'ol';
import Fab from '@material-ui/core/Fab';
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';
import { FabHolder } from './FabHolder';
import { Question } from '../types/types';

interface Props {
  questions: Question[];
  onQuestionSelected: (question?: Question) => void;
}

export const Map = (props: Props) => {
  const map = useMap("map");
  const accuracyFeature = useFeature();
  const positionFeature = useFeature(new Style({
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({
        color: '#3399CC',
      }),
      stroke: new Stroke({
        color: '#fff',
        width: 2,
      }),
    }),
  }));
  const geolocation = useGeolocation();
  const vectorLayerSource = useVectorLayer(map, [accuracyFeature, positionFeature]);
  useSelect(map, e => {
    if (!e.selected.length) {
      props.onQuestionSelected(undefined);
      return;
    }

    e.selected.forEach(feature => {
      const question: Question | undefined = feature.get("question");
      console.log("selected question: ", question?.id);
      props.onQuestionSelected(question);
      // console.log("selected feature which has question: ", feature.get("questionId"));
    });
  });

  React.useEffect(() => {
    geolocation.on("change:accuracyGeometry", () => {
      accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
    });

    geolocation.on("error", () => { console.log("Couln't determine position"); });

    geolocation.on("change:tracking", () => {
      const position = geolocation.getPosition();
      map.getView().setCenter(position);
    });

    geolocation.on("change:position", () => {
      const position = geolocation.getPosition();
      positionFeature.setGeometry(position && new Point(position));
    });
  }, [geolocation, accuracyFeature, positionFeature, map]);

  React.useEffect(() => {
    // const points = [[23.96, 54.905], [23.95, 54.91]];
    props.questions.forEach(question => {
      console.log("adding question to the map: ", question.id);
      console.log("location: ", question.x, question.y);
      const feature = new Feature(new Circle([question.x, question.y], question.radius));
      feature.set("question", question);
      feature.setStyle(new Style({
        fill: new Fill({
          color: '#fc554940',
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 2,
        }),
      }));
      vectorLayerSource.addFeature(feature);
    });
  }, [vectorLayerSource, props.questions]);

  const centerToLocation = () => {
    const position = geolocation.getPosition();
    position && map.getView().setCenter(position);
  };

  return (
    <Fragment>
      <FabHolder side="right">
        <Fab color="primary" onClick={centerToLocation}><CenterFocusStrongIcon /></Fab>
      </FabHolder>
      <div id="map" style={{ height: "640px" }}>
      </div>
    </Fragment>
  );
};