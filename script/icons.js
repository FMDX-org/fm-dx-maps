"use strict";

const icons =
{
    getIcon: function(erp, selected, inactive)
    {
        if (!this._initialized)
        {
            this._cache.push([
                L.icon({ iconSize: [27, 27], iconAnchor: [13, 25], iconUrl: './img/tx-hi.png' }),
                L.icon({ iconSize: [23, 23], iconAnchor: [11, 21], iconUrl: './img/tx-med.png' }),
                L.icon({ iconSize: [19, 19], iconAnchor: [9, 17], iconUrl: './img/tx-lo.png' })
            ]);

            this._cache.push([
                L.icon({ iconSize: [27, 27], iconAnchor: [13, 25], iconUrl: './img/tx-hi-sel.png' }),
                L.icon({ iconSize: [23, 23], iconAnchor: [11, 21], iconUrl: './img/tx-med-sel.png' }),
                L.icon({ iconSize: [19, 19], iconAnchor: [9, 17], iconUrl: './img/tx-lo-sel.png' })
            ]);

            this._cache.push([
                L.icon({ iconSize: [27, 27], iconAnchor: [13, 25], iconUrl: './img/tx-hi-inactive.png' }),
                L.icon({ iconSize: [23, 23], iconAnchor: [11, 21], iconUrl: './img/tx-med-inactive.png' }),
                L.icon({ iconSize: [19, 19], iconAnchor: [9, 17], iconUrl: './img/tx-lo-inactive.png' })
            ]);

            this._initialized = true;
        }

        const type = (selected ? 1 : (inactive ? 2 : 0));

        if (erp >= 5)
            return this._cache[type][0];
        else if (erp >= 0.5)
            return this._cache[type][1];
        else
            return this._cache[type][2];
    },

    getQthIcon: function()
    {
        return L.icon({
            iconUrl: './img/qth.png',
            iconSize: [34, 26],
            iconAnchor: [16, 25]
        });
    },

    _initialized: false,
    _cache: []
};
