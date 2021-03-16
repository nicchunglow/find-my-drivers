import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import { red } from "@material-ui/core/colors";

mapboxgl.accessToken = process.env.REACT_APP_MAP_SECRET;

const Map = (props) => {
	const mapContainerRef = useRef(null);
	const { features } = props;

	const [lng, setLng] = useState(features[0].geometry.coordinates[0]);
	const [lat, setLat] = useState(features[0].geometry.coordinates[1]);
	const [zoom, setZoom] = useState(14);

	let map;
	let geojson = {
		type: "FeatureCollection",
		features,
	};

	useEffect(() => {
		map = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: "mapbox://styles/mapbox/streets-v11",
			center: [lng, lat],
			color: red,
			zoom: zoom,
		});

		const makeMarker = (coordinates, popup, color, drag) => {
			let marker = new mapboxgl.Marker({ color: color, draggable: drag })
				.setLngLat(coordinates)
				.setPopup(popup)
				.addTo(map);
		};

		geojson.features.forEach(function (marker) {
			let popup = new mapboxgl.Popup({ offset: 25 }).setText(marker.properties.message);
			if (marker.type === "user") {
				makeMarker(marker.geometry.coordinates, popup, "#FF2400", true);
			} else {
				makeMarker(marker.geometry.coordinates, popup, false);
			}
		});

		map.addControl(new mapboxgl.NavigationControl(), "top-right");

		return () => map.remove();
	}, [geojson]);

	return (
		<div>
			<div className="map-container" ref={mapContainerRef} />
		</div>
	);
};

export default Map;
