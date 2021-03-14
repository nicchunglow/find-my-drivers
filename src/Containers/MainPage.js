import React, { useState, useEffect } from "react";
import Axios from "axios";
import GoogleMap from "../Components/GoogleMap";

export default function MainPage() {
	const user = {
		lat: 51.5049375,
		lng: -0.0964509,
		type: "user",
	};
	const drivers = 10;
	const [positions, setPositions] = useState([user]);
	const [loadMap, setLoadMap] = useState(false);

	const loadGoogleMapScript = (callback) => {
		const googleMapScript = document.createElement("script");
		googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_SECRET}`;
		document.body.appendChild(googleMapScript);
		googleMapScript.addEventListener("load", callback);
	};

	const initMap = () => {
		useEffect(() => {
			loadGoogleMapScript(() => {
				setLoadMap(true);
			});
		}, []);
	};

	const loadDriversPositions = () => {
		useEffect(async () => {
			const res = await Axios.get(
				process.env.REACT_APP_BASE_MAP_URL + `/drivers?latitude=${user.lat}&longitude=${user.lng}&count=${drivers}`,
			);
			for (let i = 0; i < res.data.drivers.length; i++) {
				let driver = res.data.drivers[i];
				driver["type"] = "driver";
				setPositions((positions) => [...positions, driver]);
			}
		}, []);
	};

	const initPage = () => {
		loadDriversPositions();
		initMap();
	};

	initPage();
	return (
		<div className="mainPage">
			<h1>{drivers}</h1>
			{!loadMap ? <div>Loading...</div> : <GoogleMap positions={positions} />}
			{/* <div>
				{positions?.drivers
					? positions.drivers.map((event) => (
							<p key={event.driver_id}>{`${event.location.latitude}, ${event.location.longitude}`}</p>
					  ))
					: "loading..."}{" "}
			</div> */}
		</div>
	);
}
