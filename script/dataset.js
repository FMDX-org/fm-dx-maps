"use strict";

const dataset =
{
    set: function(data)
    {
        this._count = 0;

        /* Sort stations by frequency */
        for (let id in data.locations)
        {
            data.locations[id]['stations'].sort(function(a, b)
            {
                return a['freq'] < b['freq'] ? -1 : (a['freq'] > b['freq'] ? 1 : 0);
            });

            this._count++;
        }

        this._filteredCount = this._count;
        this._dataset = data;
    },

    get: function()
    {
        return this._dataset;
    },

    getCount: function()
    {
        return this._count;
    },

    getFilteredCount: function()
    {
        return this._filteredCount;
    },

    filter: function()
    {
        const filters = app.getFilters();
        this._filteredCount = 0;
        this._count = 0;

        for (let id in this._dataset.locations)
        {
            const entry = this._dataset.locations[id];
            entry['maxerp'] = -1;
            entry['inactive'] = true;
            entry['hide'] = true;

            for (let j in entry['stations'])
            {
                if (entry['stations'][j]['extra'] != null)
                    continue;

                if (entry['stations'][j]['inactive'] && filters['active'])
                    continue;

                if (filters['pi'] && entry['stations'][j]['pi'] != filters['pi'])
                    continue;

                if (entry['stations'][j]['erp'] >= filters['erp'])
                {
                    if (!filters['pol'] ||
                        (entry['stations'][j]['pol'] != 'h' && filters['pol'] == 'v') ||
                        (entry['stations'][j]['pol'] != 'v' && filters['pol'] == 'h'))
                    {
                        if (entry['maxerp'] < entry['stations'][j]['erp'])
                            entry['maxerp'] = entry['stations'][j]['erp'];

                        if (!entry['stations'][j]['inactive'] && entry['inactive'])
                            entry['inactive'] = false;

                        entry['hide'] = false;
                    }
                }
            }

            if (filters['marked'] &&
                !paths.contains(id))
            {
                entry['hide'] = true;
            }

            this._filteredCount += entry['hide'] ? 0 : 1;
            this._count++;
        }
    },

    findPi: function(pi)
    {
        var output = [];

        for (let id in this._dataset.locations)
        {
            const entry = this._dataset.locations[id];

            for (let j in entry['stations'])
            {
                if (entry['stations'][j]['extra'] != null)
                    continue;

                /* Ignore special case: tunnels */
                if (entry['stations'][j]['pol'] == 't')
                    continue;

                if (entry['stations'][j]['pi'] == pi)
                {
                    output.push(id);
                    break;
                }
            }
        }

        return output.length ? output : null;
    },

    findId: function(stationIds)
    {
        var output = [];

        for (let id in this._dataset.locations)
        {
            const entry = this._dataset.locations[id];

            for (let j in entry['stations'])
            {
                if (entry['stations'][j]['extra'] != null)
                    continue;

                if (stationIds.includes(entry['stations'][j]['id']))
                {
                    output.push(id);
                    break;
                }
            }
        }
        return output.length ? output : null;
    },

    findAll: function()
    {
        return this._dataset ? Object.keys(this._dataset.locations) : [];
    },

    _dataset: null,
    _count: 0,
    _filteredCount: 0
};
