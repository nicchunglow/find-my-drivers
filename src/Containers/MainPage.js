import React, { useState, useEffect } from "react";
import Axios from "axios";
import GoogleMap from "../Components/GoogleMap";

export default function MainPage() {
	const [positions, setPositions] = useState({});
	const [loadMap, setLoadMap] = useState(false);
	const userPosition = {
		lat: 51.5049375,
		lng: -0.0964509,
	};
	const drivers = 1;

	const loadGoogleMapScript = (callback) => {
		const googleMapScript = document.createElement("script");
		googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_SECRET}`;
		document.body.appendChild(googleMapScript);
		googleMapScript.addEventListener("load", callback);
	};

	const loadDriversPositions = () => {
		useEffect(async () => {
			const res = await Axios.get(
				process.env.REACT_APP_BASE_MAP_URL +
					`/drivers?latitude=${userPosition.lat}&longitude=${userPosition.lng}&count=${drivers}`,
			);
			setPositions((positions) => ({ ...positions, drivers: res.data.drivers }));
		}, []);
	};
	const initMap = () => {
		useEffect(() => {
			loadGoogleMapScript(() => {
				setLoadMap(true);
			});
		}, []);
	};

	const loadUserPosition = () => {
		useEffect(() => {
			setPositions((positions) => ({ ...positions, user: userPosition }));
		}, []);
	};

	const initPage = () => {
		loadDriversPositions();
		loadUserPosition();
		initMap();
	};

	initPage();
	return (
		<div className="mainPage">
			<h1>{drivers}</h1>
			<div>{positions?.drivers ? <h2>{positions.drivers[0].driver_id}</h2> : "loading..."} </div>
			{!loadMap ? <div>Loading...</div> : <GoogleMap userPosition={positions.user} />}
		</div>
	);
}
