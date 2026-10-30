"use strict";

L.CanvasIconMarker = L.CircleMarker.extend({
    options: {
        renderer: L.canvas({ pane: 'markerPane' })
    },

    setIcon: function(icon)
    {
        this.options.icon = icon;
        return this.redraw();
    },

    _updateBounds: function()
    {
        const o = this.options.icon.options;
        const topLeft = this._point.subtract(o.iconAnchor);
        this._pxBounds = L.bounds(topLeft, topLeft.add(o.iconSize));
    },

    _containsPoint: function(p)
    {
        return this._pxBounds.contains(p);
    },

    _updatePath: function()
    {
        if (!this._renderer._drawing || this._empty())
            return;

        const o = this.options.icon.options;
        const img = o.img || (o.img = Object.assign(new Image(), { src: o.iconUrl }));

        if (!img.complete)
        {
            img.addEventListener('load', () => this.redraw(), { once: true });
            return;
        }

        if (img.naturalWidth)
        {
            const p = this._pxBounds.min;
            this._renderer._ctx.drawImage(img, p.x, p.y, o.iconSize[0], o.iconSize[1]);
        }
    }
});

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
