import * as React from "react";
import { useIES } from "@modules/home-page/contexts/ies.context";
import Tile from "ol/layer/Tile";
import View from "ol/View";
import OSM from "ol/source/OSM";
import Map from "ol/Map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Geometry from "ol/geom/Geometry";
import LayerGroup from "ol/layer/Group";
import { Feature } from "ol";
import { fromLonLat } from "ol/proj";
import Point from "ol/geom/Point";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import useLatest from "@react-hook/latest";

export function useOlMap() {
  const [{ IESs }, { setIES }] = useIES();

  const map = React.useRef<Map>();
  const markers = React.useRef<VectorLayer<VectorSource<Geometry>>>();

  const setIESRef = React.useRef(setIES);
  const IESsRef = useLatest(IESs);

  const setupOSM = React.useRef(() => {
    map.current = new Map({
      target: "ol-map",
      view: new View({ center: [0, 0], zoom: 2 })
    });

    const osmStandard = new Tile({ source: new OSM() });

    markers.current = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        image: new Icon({
          src: "/images/marker-on.png"
        })
      })
    });

    const layerGroups = new LayerGroup({
      layers: [osmStandard, markers.current]
    });

    map.current.addLayer(layerGroups);
  });

  React.useEffect(() => {
    setupOSM.current();

    map.current.on("click", (evt) => {
      const feature = map.current.getFeaturesAtPixel(evt.pixel)[0];

      if (!feature) return;

      setIESRef.current(
        IESsRef.current.find(({ id }) => id === feature.get("ies_id"))
      );
    });

    map.current.on("pointermove", (evt) => {
      if (map.current.hasFeatureAtPixel(evt.pixel)) {
        document.querySelector("#ol-map").classList.add("cursor-pointer");
      } else {
        document.querySelector("#ol-map").classList.remove("cursor-pointer");
      }
    });
  }, [IESsRef]);

  React.useEffect(() => {
    markers.current?.getSource().clear();
    if (IESs.length < 1) return;

    const features = IESs.map(
      (ies) =>
        new Feature({
          geometry: new Point(fromLonLat([+ies.longitude, +ies.latitude])),
          ies_id: ies.id
        })
    );

    markers.current?.getSource().addFeatures(features);
  }, [IESs]);

  return {};
}
