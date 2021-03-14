import React, { useEffect, useRef } from "react";

const GoogleMap = (userPosition) => {
	const googleMapRef = useRef(null);
	let googleMap;
	let marker;
	useEffect(() => {
		googleMap = initGoogleMap();
		marker = createMarker();
	}, []);

	const initGoogleMap = () => {
		console.log(userPosition);
		return new google.maps.Map(googleMapRef.current, {
			center: { lat: userPosition.userPosition.lat, lng: userPosition.userPosition.lng },
			zoom: 16,
		});
	};

	const iconBase = "https://www.flaticon.com/svg/vstatic/svg";

	const icons = {
		parking: {
			url: iconBase + "/1048/1048314.svg?token=exp=1615717226~hmac=fd1df196550f266c4f3be3ef3ac3bbcc",
			scaledSize: new google.maps.Size(50, 50),
		},
		userLocation: {
			url: iconBase + "/3180/3180209.svg?token=exp=1615716990~hmac=4771b645c972ae50d2dcf93468eb5055",
			scaledSize: new google.maps.Size(40, 40),
		},
	};
	const createMarker = () => {
		marker = new google.maps.Marker({
			animation: google.maps.Animation.DROP,
			position: new google.maps.LatLng(userPosition.userPosition),
			icon: icons.userLocation,
			map: googleMap,
		});
	};

	// const features = [
	// 	{
	// 		position: new google.maps.LatLng(userPosition.userPosition.lat, userPosition.userPosition.lng),
	// 		type: "parking",
	// 	},
	// 	{
	// 		position: new google.maps.LatLng(userPosition.userPosition.lat, userPosition.userPosition.lng),
	// 		type: "userLocation",
	// 	},
	// ];

	return <div ref={googleMapRef} style={{ width: 600, height: 600 }} />;
};

export default GoogleMap;
