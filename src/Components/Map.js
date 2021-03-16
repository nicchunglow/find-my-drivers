import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";

mapboxgl.accessToken = process.env.REACT_APP_MAP_SECRET;

const Map = (userProps) => {
	const mapContainerRef = useRef(null);
	const { user } = userProps;
	const [lng, setLng] = useState(user.location.longitude);
	const [lat, setLat] = useState(user.location.latitude);
	const [zoom, setZoom] = useState(12);

	// Initialize map when component mounts
	useEffect(() => {
		const map = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: "mapbox://styles/mapbox/streets-v11",
			center: [lng, lat],
			zoom: zoom,
		});
		var marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
		// Add navigation control (the +/- zoom buttons)
		map.addControl(new mapboxgl.NavigationControl(), "top-right");

		map.on("move", () => {
			setLng(map.getCenter().lng.toFixed(4));
			setLat(map.getCenter().lat.toFixed(4));
			setZoom(map.getZoom().toFixed(2));
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
