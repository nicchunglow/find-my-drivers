import React, { useEffect, useRef } from "react";

const GoogleMap = (positions) => {
	const allPositions = positions.positions;
	console.log(allPositions);
	const googleMapRef = useRef(null);
	let googleMap;
	let marker;

	const iconBase = "https://www.flaticon.com/svg/vstatic/svg";

	const icons = {
		driver: {
			url: iconBase + "/1048/1048314.svg?token=exp=1615717226~hmac=fd1df196550f266c4f3be3ef3ac3bbcc",
			scaledSize: new google.maps.Size(30, 30),
		},
		user: {
			url: iconBase + "/3180/3180209.svg?token=exp=1615716990~hmac=4771b645c972ae50d2dcf93468eb5055",
			scaledSize: new google.maps.Size(30, 30),
		},
	};

	const markerTemplate = (type, lat, lng) => {
		marker = new google.maps.Marker({
			animation: google.maps.Animation.DROP,
			position: { lat: lat, lng: lng },
			icon: icons[type],
			map: googleMap,
		});
	};

	const createMarker = () => {
		allPositions.forEach((position) => {
			if (position.type === "user") {
				markerTemplate(position.type, position.lat, position.lng);
			} else if (position.type === "driver") {
				markerTemplate(position.type, position.location.latitude, position.location.longitude);
			}
		});
	};

	const initGoogleMap = () => {
		return new google.maps.Map(googleMapRef.current, {
			center: { lat: allPositions[0].lat, lng: allPositions[0].lng },
			zoom: 14,
		});
	};
	useEffect(() => {
		googleMap = initGoogleMap();
		marker = createMarker();
	}, []);

	return <div ref={googleMapRef} style={{ width: "90vw", height: "80vh" }} />;
};

export default GoogleMap;
