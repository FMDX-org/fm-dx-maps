"use strict";

const tiles =
{
	get: function()
	{
		const OpenStreetMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		});

		const OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
			maxZoom: 17,
			attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
		});

		const GoogleMapsStandard = L.tileLayer('https://{s}.google.com/vt/lyrs=r&hl=en&x={x}&y={y}&z={z}',
		{
			maxZoom: 20,
			subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
			attribution: '&copy; Google Maps'
		});

		const GoogleMapsTerrain = L.tileLayer('https://{s}.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}',
		{
			maxZoom: 20,
			subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
			attribution: '&copy; Google Maps'
		});

		const GoogleMapsSatellite = L.tileLayer('https://{s}.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
		{
			maxZoom: 20,
			subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
			attribution: '&copy; Google Maps'
		});
		
		const ESRIStreet = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
		{
			maxZoom: 20,
			attribution: '&copy; Esri, DeLorme, HERE, USGS, Intermap, increment P Corp., NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom'
		});

		const output = {
			"OpenStreetMap": OpenStreetMap,
			"OpenTopoMap": OpenTopoMap,
			"Google Maps Standard": GoogleMapsStandard,
			"Google Maps Terrain": GoogleMapsTerrain,
			"Google Maps Satellite": GoogleMapsSatellite,
			"ESRI Street": ESRIStreet
		};

		return output;
	}
};
