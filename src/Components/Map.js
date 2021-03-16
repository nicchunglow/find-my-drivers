import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken = process.env.REACT_APP_MAP_SECRET;

const Map = (props) => {
	const mapContainerRef = useRef(null);
	const { features } = props;
	const [lng, setLng] = useState(features[0].geometry.coordinates[0]);
	const [lat, setLat] = useState(features[0].geometry.coordinates[1]);
	const [zoom, setZoom] = useState(12);
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

		const makeMarker = (coordinates, popup, drag) => {
			marker = new mapboxgl.Marker({ draggable: drag })
				.setLngLat(coordinates)
				.setPopup(popup) // sets a popup on this marker
				.addTo(map);
			console.log(marker);
		};

		geojson.features.forEach(function (marker) {
			let popup = new mapboxgl.Popup({ offset: 25 }).setText(marker.properties.message);
			if (marker.type === "user") {
				makeMarker(marker.geometry.coordinates, popup, true);
			} else {
				makeMarker(marker.geometry.coordinates, popup, false);
			}
		});

		let geocoder = new MapboxGeocoder({
			accessToken: mapboxgl.accessToken,
			mapboxgl: mapboxgl,
		});

		map.addControl(geocoder);

		map.addControl(new mapboxgl.NavigationControl(), "top-right");
		function onDragEnd() {
			var lngLat = marker.getLngLat();
			coordinates.style.display = "block";
			coordinates.innerHTML = "Longitude: " + lngLat.lng + "<br />Latitude: " + lngLat.lat;
			console.log(lnglat);
		}

		marker.on("dragend", onDragEnd);

		return () => map.remove();
	}, []);

	return (
		<div>
			<div>
				Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
			</div>
			<div id="geocoder"></div>
			<div className="map-container" ref={mapContainerRef} />
		</div>
	);
};

export default Map;
