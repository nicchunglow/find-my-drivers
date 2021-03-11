import React, { useState, useEffect } from "react";
import Axios from "axios";

export default function MainPage() {
	const [driverLocation, setDriverLocation] = useState([]);
	const userLocation = {
		latitude: 51.5049375,
		longitude: -0.0964509,
	};
	const drivers = 1;

	useEffect(async () => {
		const res = await Axios.get(
			process.env.REACT_APP_BASE_MAP_URL +
				`/drivers?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}&count=${drivers}`,
		);
		setDriverLocation(res.data.drivers);
		console.log(driverLocation[0]);
	}, []);
	return (
		<div>
			<h1>{drivers}</h1>
			<h1>{driverLocation[0]?.driver_id}</h1>
		</div>
	);
}
