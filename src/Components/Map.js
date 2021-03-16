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

	useEffect(() => {
		const map = new mapboxgl.Map({
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
			var el = document.createElement("div");
			el.className = "marker";
			if (marker.type === "user") {
				el.style.backgroundImage = "url(https://placekitten.com/g/" + marker.properties.iconSize.join("/") + "/)";
			}
			el.style.width = marker.properties.iconSize[0] + "px";
			el.style.height = marker.properties.iconSize[1] + "px";
			el.style.backgroundSize = "100%";

			var popup = new mapboxgl.Popup({ offset: 25 }).setText(marker.properties.message);
			new mapboxgl.Marker(el)
				.setLngLat(marker.geometry.coordinates)
				.setPopup(popup) // sets a popup on this marker
				.addTo(map);
		});
		map.addControl(new mapboxgl.NavigationControl(), "top-right");

		map.on("move", () => {
			setLng(map.getCenter().lng.toFixed(4));
			setLat(map.getCenter().lat.toFixed(4));
			setZoom(map.getZoom().toFixed(2));
		});
		map.on("mouseenter", "user", function () {
			map.getCanvas().style.cursor = "pointer";
		});

		map.on("mouseleave", "user", function () {
			map.getCanvas().style.cursor = "";
		});
		return () => map.remove();
	}, []);

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
