import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import { red } from "@material-ui/core/colors";
import MainPage from "../Containers/MainPage";

mapboxgl.accessToken = process.env.REACT_APP_MAP_SECRET;

const Map = (props) => {
	const mapContainerRef = useRef(null);
	let { features, handleUserChange } = props;

	const [lng, setLng] = useState(features[0].geometry.coordinates[0]);
	const [lat, setLat] = useState(features[0].geometry.coordinates[1]);
	const [zoom, setZoom] = useState(14);

	let map;
	let geojson = {
		type: "FeatureCollection",
		features,
	};

	const makeMarker = (coordinates, popup, color) => {
		new mapboxgl.Marker({ color: color }).setLngLat(coordinates).setPopup(popup).addTo(map);
	};

	const populateMarkers = () => {
		geojson.features.forEach(function (marker) {
			let popup = new mapboxgl.Popup({ offset: 25 }).setText(marker.properties.message);
			if (marker.type === "user") {
				makeMarker(marker.geometry.coordinates, popup, "#FF2400");
			} else {
				makeMarker(marker.geometry.coordinates, popup);
			}
		});
	};

	useEffect(() => {
		map = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: "mapbox://styles/mapbox/streets-v11",
			center: [lng, lat],
			color: red,
			zoom: zoom,
			doubleClickZoom: false,
		});

		map.addControl(new mapboxgl.NavigationControl(), "top-right");
		map.on("load", () => {
			populateMarkers();
		});
		map.on("dblclick", async (event) => {
			setLng(event.lngLat.lng.toFixed(4));
			setLat(event.lngLat.lat.toFixed(4));
			await handleUserChange(lng, lat);
			console.log("map triggered", lng, lat);
		});

		return () => map.remove();
	}, []);

	return (
		<div>
			<div className="map-container" ref={mapContainerRef} />
		</div>
	);
};

export default Map;
