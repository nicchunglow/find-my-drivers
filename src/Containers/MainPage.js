import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Slider } from "@material-ui/core";
import "./MainPage.css";
import Map from "../Components/Map";

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
		return callback;
	};

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
		setLoadMap(true);
	}, [numOfDrivers]);

	return (
		<div className="main-page">
			<h2>FIND MY DRIVERS</h2>
			<div className="main-page-container ">
				{!loadMap ? (
					<div>Loading...</div>
				) : (
					<div>
						<Map id="map" />
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
