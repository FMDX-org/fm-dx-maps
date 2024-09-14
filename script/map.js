"use strict";

const map =
{
    create: function(container)
    {
        this._map = L.map(container, {
            wheelPxPerZoomLevel: 200,
            wheelDebounceTime: 100,
            zoomControl: false
        });

        this._groupMarkers = L.featureGroup().addTo(this._map);
        this._groupPaths = L.featureGroup().addTo(this._map);

        this._map.on('contextmenu', function(e)
        {
            if (!map._qth)
            {
                app.setLocation([e.latlng.lat, e.latlng.lng], false);
            }
        });

        const mapTiles = tiles.get();
        mapTiles['Google Maps Terrain'].addTo(this._map);
        L.control.share({position: 'topright'}).addTo(this._map);
        L.control.layers(mapTiles, {}, {position: 'topright'}).addTo(this._map);
        L.control.zoom({position: 'topright'}).addTo(this._map);
    },

    update: function()
    {
        const ds = dataset.get();
        this._data = ds.locations;

        this._clear();
        for (let id in this._data)
        {
            const entry = this._data[id];
            if (!entry.hide &&
                entry.lat && entry.lon)
            {
                const marker = L.marker([entry.lat, entry.lon]);
                marker.setIcon(icons.getIcon(entry['maxerp'], selection.contains(id), entry['inactive']));
                marker.bindTooltip(this.tooltip);
                marker.on('mousedown', function (e)
                {
                    switch (e.originalEvent.button)
                    {
                        case 0:
                            map.selectNear(e.target.getLatLng());
                            break;

                        case 1:
                            map.selectNear(e.target.getLatLng(), true);
                            break;

                        case 2:
                            const id = e.target.myId;
                            paths.contains(id) ? paths.remove(id) : map.addPath(id);
                            break;
                    }
                });

                marker.addTo(this._groupMarkers);
                marker.myId = id;
                entry.myMarker = marker;
            }
        }

        if (ds.lat &&
            ds.lon &&
            ds.radius)
        {
             this._circle = L.circle([ds.lat, ds.lon], {
                radius: ds.radius * 1000,
                color: '#FF0000',
                opacity: 0.5,
                weight: 1,
                fillColor: '#FF0000',
                fillOpacity: 0.03,
                interactive: false
             }).addTo(this._map);
        }
    },

    setQth: function(value, lock)
    {
        const location = new L.LatLng(value[0], value[1]);

        if (!map._qth)
        {
            const config =
            {
                icon: icons.getQthIcon(),
                draggable: !lock
            };

            map._qth = L.marker(location, config).addTo(map._map);
            map._qth.on('dragend', function(e)
            {
                const location = e.target.getLatLng();
                app.setLocation([location.lat, location.lng], false);
            });
        }
        else
        {
            map._qth.setLatLng(location);
        }

        /* Update existing paths */
        paths.foreach(function(id, path)
        {
            path.setLatLngs([location, path.points[0][1]]);
        });
    },

    tooltip: function(marker)
    {
        const id = marker.myId;
        const entry = map._data[id];

        var html = '<div style="text-align: center"><b>' + entry['name'] + '</b><br />';

        if (map._qth)
        {
            const qth = map._qth.getLatLng();
            const tx = marker.getLatLng();
            const distance = utils.calculateDistance(qth.lat, qth.lng, tx.lat, tx.lng);
            const azimuth = utils.calculateAzimuth(qth.lat, qth.lng, tx.lat, tx.lng);
            html += '<b>' + distance + '</b> km, ';
            html += ' <b>' + azimuth + '</b>°';
        }

        html += '</div>';
        return html;
    },

    getPoint: function(location)
    {
        const point = this._map.project(location, this._map.getZoom());
        return point.subtract(this._map.getPixelOrigin());
    },

    addPath: function(id)
    {
        if (map._qth)
        {
            const location = new L.LatLng(map._data[id].lat, map._data[id].lon);
            const path = [map._qth.getLatLng(), location];
            paths.add(id, path).addTo(map._groupPaths);
        }
    },

    select: function(id)
    {
        if (selection.add(id))
        {
            const entry = map._data[id];
            const marker = map._data[id].myMarker;
            marker.setIcon(icons.getIcon(entry['maxerp'], true, entry['inactive']));
            marker.setZIndexOffset(entry['maxerp']);
        }
    },

    selectNear: function(location, merge = false)
    {
        const mergeRadius = 20;
        const point = map.getPoint(location);
        var temp = {};

        for (let id in map._data)
        {
            const entry = map._data[id];
            const marker = map._data[id].myMarker;

            if (!marker)
                continue;

            const markerPoint = map.getPoint(marker.getLatLng());
            const diffX = Math.abs(point.x - markerPoint.x);
            const diffY = Math.abs(point.y - markerPoint.y);

            if (diffX > mergeRadius ||
                diffY > mergeRadius)
            {
                continue;
            }

            if (Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2)) > mergeRadius)
                continue;

            temp[id] = 1;
        }

        if (!merge)
        {
            if (selection.equals(temp))
            {
                map.clearSelection();
                list.update();
                return;
            }

            map.clearSelection();
        }

        for (let id in temp)
        {
            map.select(id);
        }

        if (Object.keys(temp).length)
        {
            app.showMenu(true);
        }

        list.update();
    },

    clearSelection: function()
    {
        selection.foreach(function(id)
        {
            const data = map._data[id];
            const marker = data.myMarker;
            if (marker)
            {
                marker.setIcon(icons.getIcon(data['maxerp'], false, data['inactive']));
                marker.setZIndexOffset(data['maxerp']);
            }

            selection.remove(id);
        });
    },

    fitDefault: function(maxZoom)
    {
        const bounds = map._groupMarkers.getBounds().extend(map._groupPaths.getBounds());
        this._fit(bounds, maxZoom);
    },

    fitPaths: function(maxZoom)
    {
        const bounds = map._groupPaths.getBounds();
        this._fit(bounds, maxZoom);
    },

    fitQth: function(maxZoom)
    {
        if (map._qth)
        {
            const bounds = new L.latLngBounds([map._qth.getLatLng()]);
            this._fit(bounds, maxZoom);
        }
    },

    setCoverage: function(url, north, south, east, west)
    {
        const bounds = L.latLngBounds([[north, west], [south, east]]);

        if (this._coverage)
        {
            this._coverage.remove();
        }

        this._coverage = L.imageOverlay(url, bounds, {
            opacity: 0.6
        }).addTo(this._map);
    },

    _clear: function()
    {
        this._groupMarkers.remove();
        this._groupMarkers = L.featureGroup().addTo(this._map);

        if (this._circle)
        {
            this._circle.remove();
            this._circle = null;
        }

        if (this._coverage)
        {
            this._coverage.remove();
            this._coverage = null;
        }
    },

    _fit: function(bounds, maxZoom = 10)
    {
        const defaultPadding = 5;

        var leftPadding = defaultPadding;
        const expandable = document.getElementById('expandable');
        if (expandable.style.display != 'none')
        {
            leftPadding += expandable.offsetWidth;
        }

        const opts = {
            paddingTopLeft: [leftPadding, defaultPadding],
            paddingBottomRight: [defaultPadding, defaultPadding],
            maxZoom: maxZoom
        };

        if (bounds.isValid())
        {
            map._map.fitBounds(bounds, opts);
        }
        else
        {
            map._map.fitWorld(bounds, opts);
        }
    },

    _map: null,
    _groupMarkers: null,
    _groupPaths: null,
    _qth: null,
    _circle: null,
    _coverage: null,
    _data: null
};
