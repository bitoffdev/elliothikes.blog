import KML from "ol/format/KML";
import Map from "ol/Map";
import VectorSource from "ol/source/Vector";
import View from "ol/View";
import GeoJSON from "ol/format/GeoJSON";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";

const backgroundVector = new VectorLayer({
  source: new VectorSource({
    url: "data/nh.geo.json",
    format: new GeoJSON(),
  }),
});

const vector = new VectorLayer({
  source: new VectorSource({
    url: "data/my-map.kml",
    format: new KML(),
  }),
});

const map = new Map({
  layers: [backgroundVector, vector],
  target: document.getElementById("map"),
  view: new View({
    center: [/*x=*/ -7950000, 5500000],
    projection: "EPSG:3857",
    zoom: 9,
  }),
});

const displayFeatureInfo = function (pixel) {
  const features = [];
  map.forEachFeatureAtPixel(pixel, function (feature) {
    features.push(feature);
  });
  if (features.length > 0) {
    const info = [];
    let i, ii;
    for (i = 0, ii = features.length; i < ii; ++i) {
      info.push(features[i].get("name"));
    }
    document.getElementById("info").innerHTML = info.join(", ") || "(unknown)";
    map.getTarget().style.cursor = "pointer";
  } else {
    document.getElementById("info").innerHTML = "&nbsp;";
    map.getTarget().style.cursor = "";
  }
};

map.on("pointermove", function (evt) {
  if (evt.dragging) {
    return;
  }
  const pixel = map.getEventPixel(evt.originalEvent);
  displayFeatureInfo(pixel);
});

map.on("click", function (evt) {
  displayFeatureInfo(evt.pixel);
});
