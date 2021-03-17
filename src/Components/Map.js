import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import { red } from "@material-ui/core/colors";

mapboxgl.accessToken = process.env.REACT_APP_MAP_SECRET;

const Map = (props) => {
	const mapContainerRef = useRef(null);
	let { features, handleUserChange } = props;
	const lngLat = useRef(features[0].geometry.coordinates);
	console.log(lngLat.current);
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
			center: [lngLat.current[0], lngLat.current[1]],
			color: red,
			zoom: zoom,
			doubleClickZoom: false,
			interactive: true,
		});

		map.addControl(new mapboxgl.NavigationControl(), "top-right");
		map.on("load", () => {
			populateMarkers();
		});

		map.on("dblclick", async (event) => {
			lngLat.current = [event.lngLat.lng, event.lngLat.lat];
			await handleUserChange(event.lngLat.lng, event.lngLat.lat);
		});

		return () => map.remove();
	}, [geojson]);

	return (
		<div>
			<div className="map-container" ref={mapContainerRef} />
		</div>
	);
};

export default Map;
