"use strict";

const utils =
{
    getCookie: function(name)
    {
        const match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return match ? match.pop() : '';
    },

    setCookie: function(name, value)
    {
        const expires = 180; /* days */
        const date = new Date();
        date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));

        document.cookie = name + "=" + value + ";" + "expires="+ date.toUTCString() + ";path=/";
    },

    setClass: function(widgetName, className, state)
    {
        const widget = document.getElementById(widgetName);
        state ? widget.classList.add(className) : widget.classList.remove(className);
    },

    getParams: function()
    {
        var params = {};

        const query = window.location.hash.substr(1);
        if (query.length)
        {
            const pairs = query.split('&');
            for (var i = 0; i < pairs.length; i++)
            {
				const pair = pairs[i].split('=');
				const key = decodeURIComponent(pair[0]);
				const value = decodeURIComponent(pair[1] || '');

                params[key] = value;
            }
        }

        return params;
    },

    setParams: function(params)
    {
        var data = [];

        for (let id in params)
        {
            const key = encodeURIComponent(id);
            const value = encodeURIComponent(params[id]);

            data.push(key + '=' + value);
        }

        window.location.hash = '#' + data.join('&');
    },

    calculateCenter: function(locations)
    {
        var x = 0;
        var y = 0;
        var z = 0;
        var count = 0;

        for (let i = 0; i < locations.length; i++)
        {
            const lat = locations[i][0] * Math.PI / 180.0;
            const lon = locations[i][1] * Math.PI / 180.0;

            x += Math.cos(lat) * Math.cos(lon);
            y += Math.cos(lat) * Math.sin(lon);
            z += Math.sin(lat);
        }

        x /= locations.length;
        y /= locations.length;
        z /= locations.length;

        const lon = Math.atan2(y, x);
        const lat = Math.atan2(z, Math.sqrt(x * x + y * y));

        return [lat * 180.0 / Math.PI, lon * 180.0 / Math.PI];
    },

    calculateDistance: function(startLat, startLon, destLat, destLon)
    {
        const start = new L.LatLng(startLat, startLon);
        const dest = new L.LatLng(destLat, destLon);
        return Math.round(start.distanceTo(dest) / 1000);
    },

    calculateAzimuth: function(startLat, startLon, destLat, destLon)
    {
        startLat = startLat * Math.PI / 180;
        startLon = startLon * Math.PI / 180;
        destLat = destLat * Math.PI / 180;
        destLon = destLon * Math.PI / 180;

        const y = Math.sin(destLon - startLon) * Math.cos(destLat);
        const x = Math.cos(startLat) * Math.sin(destLat) - Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLon - startLon);
        const brng = Math.atan2(y, x) * 180 / Math.PI;
        return Math.round(brng + 360) % 360;
    }
};
