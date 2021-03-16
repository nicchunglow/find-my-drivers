import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";

mapboxgl.accessToken = process.env.REACT_APP_MAP_SECRET;

const Map = (props) => {
	const mapContainerRef = useRef(null);
	const { features } = props;
	const [lng, setLng] = useState(features[0].geometry.coordinates[0]);
	const [lat, setLat] = useState(features[0].geometry.coordinates[1]);
	const [zoom, setZoom] = useState(10);
	let marker;

	let geojson = {
		type: "FeatureCollection",
		features,
	};

	let map;
	useEffect(() => {
		map = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: "mapbox://styles/mapbox/streets-v11",
			center: [lng, lat],
			zoom: zoom,
		});

		map.on("load", function () {
			map.addSource("user", { type: "geojson", data: geojson });
			map.addLayer({
				id: "user",
				type: "symbol",
				source: "user",
			});
		});
		geojson.features.forEach(function (marker) {
			var popup = new mapboxgl.Popup({ offset: 25 }).setText(marker.properties.message);
			new mapboxgl.Marker()
				.setLngLat(marker.geometry.coordinates)
				.setPopup(popup) // sets a popup on this marker
				.addTo(map);
		});
		map.addControl(new mapboxgl.NavigationControl(), "top-right");

		map.on("mouseenter", "user", function () {
			map.getCanvas().style.cursor = "pointer";
		});

		map.on("mouseleave", "user", function () {
			map.getCanvas().style.cursor = "";
		});

		map.on("dragend", () => {
			setLng(map.getCenter().lng.toFixed(4));
			setLat(map.getCenter().lat.toFixed(4));
			setZoom(map.getZoom().toFixed(2));
		});
		return () => map.remove();
	}, [geojson]);
	return (
		<div>
			<div>
				Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
			</div>
			<div className="map-container" ref={mapContainerRef} />
		</div>
	);
};

export default Map;
