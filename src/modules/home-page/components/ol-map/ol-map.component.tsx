import * as React from "react";
import { useOlMap } from "./ol-map.hook";

const OlMap: React.VFC = () => {
  useOlMap();
  return <span className="w-full h-full block" id="ol-map" />;
};

export default OlMap;
