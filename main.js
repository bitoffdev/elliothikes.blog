import GPX from 'ol/format/GPX';
import KML from "ol/format/KML";
import Map from "ol/Map";
import VectorSource from "ol/source/Vector";
import View from "ol/View";
import GeoJSON from "ol/format/GeoJSON";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import {Stroke, Style} from 'ol/style.js';

const routeStyle = new Style({
  stroke: new Stroke({
    color: '#eb7d34',
    width: 2,
  }),
});

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

const hikeGpxUrls = [
  "data/hikes/2022-06-04_moosilauke.gpx",
  "data/hikes/2022-06-19_whiteface_passaconaway.gpx",
  "data/hikes/2022-06-25_moriah_north_middle_south_carter.gpx",
  "data/hikes/2022-07-24_tecumseh.gpx",
  "data/hikes/2022-07-30_flume_liberty.gpx",
  "data/hikes/2022-08-23_cannon.gpx",
  "data/hikes/2022-09-03_madison.gpx",
  "data/hikes/2022-09-11_tom_field_willey_avalon.gpx",
  "data/hikes/2022-10-02_osceola.gpx",
  "data/hikes/2022-10-10_haystack_lincoln_lafayette.gpx",
  "data/hikes/2022-10-15_starr_king_waumbek.gpx",
  "data/hikes/2022-10-22_hight_carter_dome_wildcat.gpx",
  "data/hikes/2023-02-12_north_and_south_kinsman.gpx",
  "data/hikes/2023-03-05_mount_pierce.gpx",
];

const hikeVectors = hikeGpxUrls.map(
  url => new VectorLayer({
    source: new VectorSource({
      url: url,
      format: new GPX(),
    }),
    style: routeStyle,
  })
);

const map = new Map({
  layers: [backgroundVector, ...hikeVectors, vector],
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
