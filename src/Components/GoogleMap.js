import React, { useEffect, useRef } from "react";

const GoogleMap = (userPosition) => {
	const googleMapRef = useRef(null);
	let googleMap = null;
	let marker = null;
	useEffect(() => {
		googleMap = initGoogleMap();
		marker = createMarker();
	}, []);

	const initGoogleMap = () => {
		return new google.maps.Map(googleMapRef.current, {
			center: { lat: -33.91721, lng: 151.2263 },
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
		for (let i = 0; i < features.length; i++) {
			marker = new google.maps.Marker({
				animation: google.maps.Animation.DROP,
				position: features[i].position,
				icon: icons[features[i].type],
				map: googleMap,
			});
		}
	};

	const features = [
		{
			position: new google.maps.LatLng(-33.91721, 151.2263),
			type: "parking",
		},
		{
			position: new google.maps.LatLng(-33.91727341958453, 151.23348314155578),
			type: "userLocation",
		},
	];

	return <div ref={googleMapRef} style={{ width: 600, height: 800 }} />;
};

export default GoogleMap;
