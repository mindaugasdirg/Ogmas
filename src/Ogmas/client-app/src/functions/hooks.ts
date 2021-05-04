import React from "react";
import Map from "ol/Map";
import OlView from "ol/View";
import OlLayerTile from "ol/layer/Tile";
import OlSourceOSM from "ol/source/OSM";
import Geolocation from "ol/Geolocation";
import { StyleLike } from "ol/style/Style";
import Feature from 'ol/Feature';
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { useGeographic as useGeoCoords } from 'ol/proj';
import Select, { SelectEvent } from 'ol/interaction/Select';
import { click } from 'ol/events/condition';
import { safeCall } from "./utils";
import { SeverityTypes } from "../types/types";

// eslint-disable-next-line react-hooks/rules-of-hooks
useGeoCoords();

export const useMap = (target: string, zoom: number = 14, center: [number, number] = [0, 0]) => {
  const [map] = React.useState(new Map({
    // controls: defaultControls().extend([]),
    layers: [
      new OlLayerTile({
        source: new OlSourceOSM()
      })
    ],
    view: new OlView({
      center,
      zoom
    })
  }));

  React.useEffect(() => map.setTarget(target), [map, target]);

  return map;
};

export const useGeolocation = () => {
  const [geolocation] = React.useState(new Geolocation({
    trackingOptions: {
      enableHighAccuracy: true,
    },
  }));

  React.useEffect(() => geolocation.setTracking(true), [geolocation]);

  return geolocation;
};

export const useFeature = (style?: StyleLike) => {
  const [feature] = React.useState(new Feature());

  React.useEffect(() => {
    style && feature.setStyle(style);
  }, [feature, style]);

  return feature;
};

export const useVectorLayer = (map: Map, features: Feature[]) => {
  const [vectorLayer] = React.useState(new VectorLayer({ map, source: new VectorSource({ features }) }));
  return vectorLayer.getSource();
}

export const useSelect = (map: Map, func: (e: SelectEvent) => void) => {
  const [select] = React.useState(new Select({ condition: click, filter: (feature) => feature.get("question") !== undefined }));

  React.useEffect(() => {
    select.on("select", func);
    map.addInteraction(select);
  }, [select, func, map]);
};

export const useErrorHelper =
  (): [(message: string, severity: SeverityTypes) => void, React.Dispatch<React.SetStateAction<((message: string, severity: SeverityTypes) => void) | undefined>>] => {
  const [addAlert, setAddAlert] = React.useState<(message: string, severity: SeverityTypes) => void>();
  return [safeCall(addAlert), setAddAlert];
};