import React, { useState, useEffect } from "react";
import Axios from "axios";
import GoogleMap from "../Components/GoogleMap";
import { Card, Slider } from "@material-ui/core";
import "./MainPage.css";

export default function MainPage() {
	const user = {
		user_id: "something",
		location: {
			latitude: 51.5049375,
			longitude: -0.0964509,
		},
	};
	const [numOfDrivers, setNumOfDrivers] = useState(1);
	const [positions, setPositions] = useState([user]);
	const [loadMap, setLoadMap] = useState(false);

	const handleChangeNumOfDrivers = (event, newValue) => {
		setNumOfDrivers(newValue);
	};

	const loadGoogleMapScript = (callback) => {
		const googleMapScript = document.createElement("script");
		googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_SECRET}`;
		document.body.appendChild(googleMapScript);
		googleMapScript.addEventListener("load", callback);
	};

	useEffect(() => {
		loadGoogleMapScript(() => {
			setLoadMap(true);
		});
	}, []);

	useEffect(async () => {
		setPositions([user]);
		const res = await Axios.get(
			process.env.REACT_APP_BASE_MAP_URL +
				`/drivers?latitude=${user.location.latitude}&longitude=${user.location.longitude}&count=${numOfDrivers}`,
		);
		for (let i = 0; i < res.data.drivers.length; i++) {
			let driver = res.data.drivers[i];
			setPositions((positions) => [...positions, driver]);
		}
	}, [numOfDrivers]);

	console.log(positions);
	return (
		<div className="main-page">
			<h2>FIND MY DRIVERS</h2>
			<div className="main-page-container ">
				{!loadMap ? (
					<div>Loading...</div>
				) : (
					<div>
						<GoogleMap positions={positions} />
					</div>
				)}
				<div className="slider-container">
					<h4>Current number of drivers: {numOfDrivers}</h4>
					<div className="slider">
						<Slider
							valueLabelDisplay="auto"
							color="secondary"
							step={1}
							defaultValue={numOfDrivers}
							min={1}
							max={50}
							onChange={handleChangeNumOfDrivers}
							value={numOfDrivers}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
