import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Slider } from "@material-ui/core";
import "./MainPage.css";
import Map from "../Components/Map";

export default function MainPage() {
	let user = {
		type: "user",
		properties: {
			message: "This is where you are",
			iconSize: [40, 40],
		},
		geometry: {
			type: "Point",
			coordinates: [-0.0964509, 51.5049375],
		},
	};

	const [numOfDrivers, setNumOfDrivers] = useState(2);
	const [positions, setPositions] = useState([user]);
	const [loadMap, setLoadMap] = useState(false);

	const handleChangeNumOfDrivers = (event, newValue) => {
		setNumOfDrivers(newValue);
	};

	useEffect(async () => {
		const res = await Axios.get(
			process.env.REACT_APP_BASE_MAP_URL +
				`/drivers?latitude=${user.geometry.coordinates[0]}&longitude=${user.geometry.coordinates[1]}&count=${numOfDrivers}`,
		);
		user.properties.message = `The estimated pickup time is ${res.data.pickup_eta} min/s`;
		setPositions([user]);
		for (let i = 0; i < res.data.drivers.length; i++) {
			let driver = res.data.drivers[i];
			let newDriver = {
				type: "driver",
				properties: {
					message: `The estimated pickup time is ${res.data.pickup_eta} min/s.`,
					iconSize: [40, 40],
				},
				geometry: {
					type: "Point",
					coordinates: [driver.location.latitude, driver.location.longitude],
				},
			};
			setPositions((positions) => [...positions, newDriver]);
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
						<Map features={positions} />
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
