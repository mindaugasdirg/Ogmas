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
import { Game, SeverityTypes } from "../types/types";
import { useHistory } from "react-router-dom";
import { getUser, isAuthenticated } from "../clients/AuthorizationClient";
import { useMediaQuery, useTheme } from "@material-ui/core";

// eslint-disable-next-line react-hooks/rules-of-hooks
useGeoCoords();

export const useMap = (target: string, zoom: number = 1, center: [number, number] = [0, 0]) => {
  const screenHeight = useScreenHeight();
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

  React.useEffect(() => {
    if(!screenHeight) return;
    map.setTarget(target);
  }, [map, target, screenHeight]);

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

export const useAuthorizeComponent = () => {
  const history = useHistory();
  
  React.useEffect(() => {
    const redirectIfUnauthorized = async () => {
      const authenticatedResult = await isAuthenticated();
      if(!authenticatedResult) {
        history.push("/");
      }
    };

    redirectIfUnauthorized();
  }, [history]);
};

export const useCheckIfHost = (game?: Game) => {
  const [isHost, setIsHost] = React.useState(false);
  const history = useHistory();

  React.useEffect(() => {
    if (!game) return;

    const checkIfHost = async () => {
      const user = await getUser();
      if(!user || user.sub !== game.organizerId) {
        history.push("/");
      } else {
        setIsHost(true);
      }
    };
    checkIfHost();
  }, [game, history]);

  return isHost;
}

export const useScreenHeight = () => {
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    const update = () => setHeight(window.innerHeight);

    window.addEventListener("resize", update);
    update();
    return () => window.removeEventListener("resize", update);
  })

  return height;
};

export const useMapStyles = () => {
  const theme = useTheme();
  const wideScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const screenHeight = useScreenHeight();
  return { height: `${screenHeight - (wideScreen ? 64 : 54)}px` };
}