## Find My Drivers - Finding nearby drivers through using mapbox.

#### Table of contents

- [Introduction](#Introduction)

- [Implementation Decisions](#Implementation-Decisions)

- [Design Pattern Consideration](#Design-Pattern-Consideration)

- [Technologies](#Technologies)

- [Setup](#Setup)

- [Environment Variables](#Environment-Variables)

- [Availble Scripts](#Available-Scripts)

- [Package Issues](#Package-issues)

### Introduction

As a user, I want to be able to find out where are my drivers in my current location. The application is able to change the location of the user, render new drivers as well as change the number of drivers on the road available.

As a user, you can double click on the map and change the position of the user. The user is able to change the number of drivers available regardless of position.

As a user, you can save your locations that you like to remember and set the location of your saved locations into the map.

As a user, you can delete away your saved location now that you do not need to save anymore.

As a user, you can click on the main user marker to get how long the nearest driver will get to you.

The link to the backend is available below.

Link to backend: https://github.com/nicchunglow/find-my-drivers-backend

#### Implementation Decisions

For this application, the technologies used are mainly focused on React, using hooks, as well as choosing mapbox over Google Map and made responsive for smaller viewing ports.

As for code, it has a husky package running to do pre-commit and pre-push hooks.

For react, I decided to go with hooks instead of going with redux is due to the amount of states to be managed. The current application do not have much states to maintain at the moment. Hence, hooks are sufficient. In terms of application development in the future, integrating redux will not be an issue. The middle ground of redux and react hooks will be to use useReducer in hooks to maintain states.

For the decision to choose mapbox over Google map, through research, mapbox has a more concise documentation as well as having a higher ability for customisations.
MapBox also uses geojson, which means there is a standardisation implemented.
OpenStreetMap API is not considered during this process as it was shared as having Incomplete documentation and may not integrate well with other tools.

This article is what I use to reference: https://uptech.team/blog/mapbox-vs-google-maps-vs-openstreetmap

#### Design Pattern Consideration

When the data was taken from the api, I choose a decorator method to fit into the structure of the geojson required by MapBox. Wrapping the data into a structure that MapBox is accustom to helps to control what data is necessary.

For each Marker, the builder pattern has been considered to differentiate the driver and user data. With the builder method, we can customize the marker to appear and reflect the data according to what we want. In the future, the marker will still be flexible to take in other possible marker types, such as building locations and different types of drivers.

## Features Demo

Working live demo can be accessed at https://find-my-drivers.netlify.app
This live demo is hosted on netlify.

The backend is hosted with heroku. Hence, the backend will take some time to spin up as it is on a free tier. 

#### Technologies

    	"@mapbox/mapbox-gl-geocoder": "^4.7.0",
    	"@material-ui": "^4.11.3",
    	"axios": "^0.21.1",
    	"mapbox-gl": "1.13.0",
    	"react": "^17.0.1",
    	"react-loader-spinner": "^4.0.0",
    	"react-scripts": "4.0.3",
    	"web-vitals": "^1.1.0",
    	"worker-loader": "^3.0.8"

##### DevDependencies:

    "eslint": "^7.21.0",
    	"husky": "4.3.8",
    	"prettier": "^2.2.1",
    	"pretty-quick": "^3.1.0"

#### Setup

To run this project, git clone and install it locally using npm:

```

$ cd ../

$ git clone git@github.com:nicchunglow/find-my-drivers.git

$ npm install

$ npm start

```

## Available Scripts

In the project directory, you can run:

```

npm start // runs the app in development mode

npm test // run test runner in interactive watch mode

npm run build // Builds the app for production

npm run lint // check code for linting issues.

npm run lint:fix // fix your code with lint issues.


```

## Environment Variables

- REACT_APP_MAP_SECRET // secret key to use mapbox.
- REACT_APP_BASE_BACKEND_URL : https://find-my-drivers-backend.herokuapp.com // For backend mongodb atlas\
*note : proxy for get drivers endpoint in backend as well under `/drivers`.

## Package issues

Mapbox have a issue in production that

```
Uncaught ReferenceError: y is not defined
```

This has been resolved by addinge `worker-loader` has part of your package and

```
import ReactMapGL from "react-map-gl";
import mapboxgl from "mapbox-gl"; // This is a dependency of react-map-gl even if you didn't explicitly install it

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;
```

as part of your map.

https://github.com/visgl/react-map-gl/issues/1266

This project was bootstrapped with Create React App.
