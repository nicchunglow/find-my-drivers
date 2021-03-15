import React, { useEffect, useRef } from "react";
import "./GoogleMap.css";

const GoogleMap = (positions) => {
	const allPositions = positions.positions;
	const googleMapRef = useRef(null);
	let googleMap;
	let marker;
	const user = allPositions.find((position) => position.hasOwnProperty("user_id"));
	const iconBase = "https://image.flaticon.com/icons/png";

	const icons = {
		driver: {
			url: iconBase + "/128/1048/1048314.png",
			scaledSize: new google.maps.Size(30, 30),
		},
		user: {
			url: iconBase + "/128/777/777548.png",
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
			if (position.hasOwnProperty("user_id")) {
				markerTemplate("user", position.location.latitude, position.location.longitude);
			} else {
				markerTemplate("driver", position.location.latitude, position.location.longitude);
			}
		});
	};

	const initGoogleMap = () => {
		return new google.maps.Map(googleMapRef.current, {
			center: { lat: user.location.latitude, lng: user.location.longitude },
			zoom: 12,
		});
	};

	useEffect(() => {
		googleMap = initGoogleMap();
		marker = createMarker();
	}, []);

	return <div ref={googleMapRef} className="map" />;
};

export default GoogleMap;
