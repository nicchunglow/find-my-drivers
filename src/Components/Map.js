import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";

mapboxgl.accessToken = process.env.REACT_APP_MAP_SECRET;

const Map = (userProps) => {
	const mapContainerRef = useRef(null);
	const { user } = userProps;
	const [lng, setLng] = useState(user.location.longitude);
	const [lat, setLat] = useState(user.location.latitude);
	const [zoom, setZoom] = useState(10);
	let marker;
	// Initialize map when component mounts
	var geojson = {
		type: "FeatureCollection",
		features: [
			{
				type: "user",
				properties: {
					message: "This is where you are",
					iconSize: [40, 40],
				},
				geometry: {
					type: "Point",
					coordinates: [lng, lat],
				},
			},
		],
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

		let el = document.createElement("div");
		el.className = "marker";

		// add markers to map
		geojson.features.forEach(function (marker) {
			// create a DOM element for the marker
			var el = document.createElement("div");
			el.className = "marker";
			el.style.backgroundImage = "url(https://placekitten.com/g/" + marker.properties.iconSize.join("/") + "/)";
			el.style.width = marker.properties.iconSize[0] + "px";
			el.style.height = marker.properties.iconSize[1] + "px";
			el.style.backgroundSize = "100%";

			// el.addEventListener("click", function () {
			// 	window.alert(marker.properties.message);
			// });
			var popup = new mapboxgl.Popup({ offset: 25 }).setText(marker.properties.message);
			// add marker to map
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

		// Change it back to a pointer when it leaves.
		map.on("mouseleave", "user", function () {
			map.getCanvas().style.cursor = "";
		});
		// Clean up on unmount
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
