import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Slider, TextField, Button } from "@material-ui/core";
import "./MainPage.css";
import Map from "../Components/Map";
import Loader from "react-loader-spinner";

export default function MainPage() {
	const user = React.useRef({
		type: "user",
		properties: {
			message: "This is where you are",
			iconSize: [40, 40],
		},
		geometry: {
			type: "Point",
			coordinates: [-0.0964509, 51.5049375],
		},
	});
	const [numOfDrivers, setNumOfDrivers] = useState(2);
	const [positions, setPositions] = useState([]);
	const [savedPositions, setSavedPositions] = useState([]);
	const [loading, setloading] = useState(true);
	const [axiosSuccess, setSuccess] = useState(false);
	const nameToSave = React.useRef();

	const handleChangeNumOfDrivers = (event, newValue) => {
		setNumOfDrivers(newValue);
	};

	const handleUserChange = (lng, lat) => {
		user.current.geometry.coordinates = [lng, lat];
		loadPositions();
	};

	const handleNametoSaveChange = (event) => {
		nameToSave.current = event.target.value;
	};

	const deleteSavedLocation = async (name) => {
		try {
			await Axios.delete(process.env.REACT_APP_BASE_BACKEND_URL + `/locations/${name}`);
			setSuccess(true);
		} catch (err) {
			throw new Error(err);
		}
	};

	const saveUserPosition = async () => {
		try {
			if (nameToSave.current.length === 0) {
				throw new Error("Please fill in name of current location");
			}
			let payload = {
				name: nameToSave.current,
				coordinates: {
					lat: user.current.geometry.coordinates[1],
					lng: user.current.geometry.coordinates[0],
				},
			};
			await Axios.post(process.env.REACT_APP_BASE_BACKEND_URL + "/locations/create", payload);
			setSuccess(true);
		} catch (err) {
			throw new Error(err);
		}
	};

	const loadSavePositions = async () => {
		const res = await Axios.get(process.env.REACT_APP_BASE_BACKEND_URL + "/locations");
		setSavedPositions(res.data);
	};

	const loadPositions = async () => {
		let positionArr = [];

		const res = await Axios.get(
			process.env.REACT_APP_BASE_MAP_URL +
				`/drivers?latitude=${user.current.geometry.coordinates[0]}&longitude=${user.current.geometry.coordinates[1]}&count=${numOfDrivers}`,
		);
		user.current.properties.message = `You are here! The estimated pickup time by the other drivers will be ${res.data.pickup_eta} min/s`;

		positionArr.push(user.current);

		for (let i = 0; i < res.data.drivers.length; i++) {
			let driver = res.data.drivers[i];
			let newDriver = {
				type: "driver",
				properties: {
					message: "I am one of the drivers near you!",
					iconSize: [40, 40],
				},
				geometry: {
					type: "Point",
					coordinates: [driver.location.latitude, driver.location.longitude],
				},
			};
			positionArr.push(newDriver);
		}
		setPositions(positionArr);
	};

	useEffect(async () => {
		await loadPositions();
		setloading(false);
	}, [numOfDrivers]);

	useEffect(async () => {
		await loadSavePositions();
		setSuccess(false);
	}, [axiosSuccess]);

	return (
		<div className="main-page">
			<h2>FIND MY DRIVERS</h2>
			{axiosSuccess === true && <h5> Successful! </h5>}
			{!!loading && <Loader className="loader" type="TailSpin" color="#00BFFF" height={40} width={40} />}
			<div className="main-page-container ">
				{!!loading ? (
					<Loader type="TailSpin" color="#00BFFF" height={40} width={40} />
				) : (
					<div>
						<Map features={positions} handleUserChange={handleUserChange} />
					</div>
				)}
				<div className="slider-container">
					<h4>Double click on the map to change user location!</h4>
					<TextField
						id="outlined-basic"
						label="Name and save your current location"
						variant="outlined"
						fullWidth
						onChange={(event) => handleNametoSaveChange(event)}
					/>
					<Button variant="contained" color="secondary" onClick={() => saveUserPosition()}>
						Save
					</Button>
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
						{savedPositions.map((eachPosition) => {
							return (
								<div className="card-container" key={eachPosition.name}>
									<button onClick={() => handleUserChange(eachPosition.coordinates.lng, eachPosition.coordinates.lat)}>
										Set
									</button>
									<h4>{eachPosition.name}</h4>
									<button className="delete" onClick={() => deleteSavedLocation(eachPosition.name)}>
										Delete Saved Location
									</button>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
