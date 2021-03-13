import React, { useEffect, useRef } from "react";

const GoogleMap = (userPosition) => {
	const googleMapRef = useRef(null);
	let googleMap = null;

	useEffect(() => {
		googleMap = initGoogleMap();
		createMarker();
	}, []);

	const initGoogleMap = () => {
		console.log(userPosition);
		return new window.google.maps.Map(googleMapRef.current, {
			center: { lat: userPosition.userPosition.lat, lng: userPosition.userPosition.lng },
			zoom: 12,
		});
	};

	const createMarker = () =>
		new window.google.maps.Marker({
			position: { lat: userPosition.userPosition.lat, lng: userPosition.userPosition.lng },
			map: googleMap,
		});

	return <div ref={googleMapRef} style={{ width: 1000, height: 1000 }} />;
};

export default GoogleMap;
