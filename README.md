# telcosense-meteo

Simple web app for weather visualization.

## Overview

This repository contains a lightweight web application for visualizing current meteorological conditions and short-term time series. It provides a compact dashboard-style UI with live values and interactive charts (e.g., temperature, rainfall intensity, wind, humidity), intended for continuous display on desktop or mobile devices.

The application fetches data from backend API endpoints and renders charts in the browser.

## Contents

- Frontend web UI for weather visualization
- Periodic fetching of current conditions and time-series data
- Chart rendering for key variables (temperature, rain, wind, humidity)
- Responsive layout handling for desktop and mobile displays

## Usage

Run the application using a static web server and configure the backend API base URL as needed.  
The UI periodically refreshes current conditions and graphs on a fixed interval.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgements

This output was financed through the projects “Precipitation Detection and Quantification System Based on Networks of Microwave Links” (SS06020416) and “Spatial Air Temperature Monitoring Using Microwave Links Data” (SS07020434), which are co-funded with state support from the Technology Agency of the Czech Republic under the Environment for Life Programme and further funded within the National Recovery Plan from the European Recovery and Resilience Facility.

<p align="center">
  <img src="assets/tacr.png" alt="Technology Agency of the Czech Republic" height="64" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="assets/eu.png" alt="European Union" height="64" />
</p>
