import 'ol/ol.css';
import React from "react";
import Point from 'ol/geom/Point';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { useFeature, useGeolocation, useMap, useSelect, useVectorLayer } from "../hooks";
import Circle from 'ol/geom/Circle';
import { Feature } from 'ol';

export const Map = () => {
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
    console.log("selected count: ", e.selected.length);
    e.selected.forEach(feature => {
      console.log("selected feature which has question: ", feature.get("questionId"));
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
    const points = [[23.96, 54.905], [23.95, 54.91]];
    points.forEach((point, index) => {
      const feature = new Feature(new Circle(point, 0.003));
      feature.set("questionId", index);
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
  }, [vectorLayerSource]);

  const centerToLocation = () => {
    const position = geolocation.getPosition();
    position && map.getView().setCenter(position);
  };

  return (
    <div id="map" style={{ height: "640px" }}>
      <button className="ol-control" onClick={centerToLocation}>center</button>
    </div>
  );
};