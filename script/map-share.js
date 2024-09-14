"use strict";

L.Control.Share = L.Control.extend({
    share: function(map) {
        var link = window.location.protocol + '//';
        link += window.location.hostname + window.location.pathname;

        const params = utils.getParams();
        const filters = app.getFilters();
        for (let key in filters)
        {
            if (filters[key])
            {
                params[key] = filters[key];
            }
        }

        /*
        if (selection.count())
        {
            params['selection'] = selection.get().join(',');
        }

        if (!paths.empty())
        {
            params['paths'] = paths.get().join(',');
        }
        */

        const location = app.getLocation();
        if (location)
        {
            const lat = parseFloat(location[0]).toFixed(6);
            const lon = parseFloat(location[1]).toFixed(6);
            params['qth'] = lat + ',' + lon;
        }

        link += '#';
        for (let key in params)
        {
            if (link.slice(-1) != '#')
            {
                link += '&';
            }

            link += encodeURIComponent(key);
            link += '=';
            link += encodeURIComponent(params[key]).replace(/%2C/g, ',');
        }

        clipboard.copy(link);
    },

    onAdd: function(map) {
        this.map = map;

        this._container = L.DomUtil.create('div', 'leaflet-control');
        var div = L.DomUtil.create('div', 'leaflet-control-layers', this._container);
        var link = L.DomUtil.create('a', 'leaflet-control-share', div);

        link.href = '#';
        link.innerHTML = '&#x1F517;'
        link.title = 'Share';
        link.role = 'button';

        L.DomEvent.addListener(link, 'click', L.DomEvent.stopPropagation)
                  .addListener(link, 'click', L.DomEvent.preventDefault)
                  .addListener(link, 'click', this.share, this);

        return this._container;
    }
});

L.control.share = function(opts) {
  return new L.Control.Share(opts);
};
