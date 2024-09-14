"use strict";

const app =
{
    init: function(url)
    {
        this._registerTitle();
        this._registerItu();
        this._registerFreqForm();
        this._registerKeepMap();
        this._registerGeolocation();
        this._registerDark();
        this._registerErp();
        this._registerPol();
        this._registerPi();
        this._registerActive();
        this._registerMarked();

        this._checkSidebar();

        map.create('map');
        this._restoreQth();

        window.onhashchange = function()
        {
            fetch.process(url, window.location.hash.substr(1));
        };

        window.onhashchange();
    },

    showMenu: function(active)
    {
        const expandable = document.getElementById('expandable');
        expandable.style.display = (active ? 'block' : 'none');
    },

    setDataset: function(data)
    {
        this._params = utils.getParams();

        dataset.set(data);

        this._setTitle(data.filter, data.title);
        this._setSource(data.source, data.update);

        this._restoreFilter();

        /* Ignore marked TXs filter */
        const marked = document.getElementById('marked');
        marked.checked = false;

        this._filterInternal();

        /* Remove invalid selections */
        selection.foreach(function(id)
        {
            if (!(id in data.locations))
            {
                selection.remove(id);
            }
        });

        /* Remove invalid paths */
        paths.foreach(function(id, path)
        {
            if (!(id in data.locations))
            {
                paths.remove(id);
            }
        });

        map.update();
        //this._restoreMap();
        const keepMap = document.getElementById('keep_map');

        if ('findId' in this._params)
        {
            if (this._findId(this._params['findId']))
            {
                if (!this._initialized ||
                    !keepMap.checked)
                {
                    map.fitPaths();
                    this._initialized = true;
                }

                list.update();
                return;
            }
        }

        if ('findPi' in this._params)
        {
            const pi = this._params['findPi'].toUpperCase().slice(0, 4);
            if (this._findPi(pi))
            {
                if (!this._initialized ||
                    !keepMap.checked)
                {
                    map.fitPaths();
                    this._initialized = true;
                }

                list.update();
                return;
            }
        }

        if (!this._initialized ||
            !keepMap.checked)
        {
            map.fitDefault();
            this._initialized = true;
        }

        list.update();
    },

    setLocation: function(location, temporary = false)
    {
        this._location = location;

        if (!temporary && location)
        {
            utils.setCookie('lat', location[0]);
            utils.setCookie('lon', location[1]);
        }

        map.setQth(location, temporary);
        list.update();
    },

    setGeolocation: function(location)
    {
        if (!location)
        {
            const geolocation = document.getElementById('geolocation');
            geolocation.checked = false;
            return;
        }

        this.setLocation(location, false);

        const keepMap = document.getElementById('keep_map');
        if (!keepMap.checked)
        {
            const maxZoom = 13;
            map.fitQth(maxZoom);
        }
    },

    setStatus: function(text)
    {
        const status = document.getElementById('status');
        status.innerHTML = text;
    },

    setError: function(text)
    {
        const error = document.getElementById('error');
        error.textContent = text;
    },

    setProgress: function(state)
    {
        const progress = document.getElementById('progress');
        progress.style.display = (state ? 'block' : 'none');
    },

    setCoverage: function(id, info)
    {
        const path = '/api/coverage/?id=' + id;
        map.setCoverage(path, info.north, info.south, info.east, info.west);
    },

    getLocation: function()
    {
        return this._location;
    },

    getFilters: function()
    {
        var filters = {};

        filters['erp'] = parseFloat(document.getElementById('erp').value) || 0;
        filters['pol'] = document.getElementById('pol').value.toLowerCase() || null;
        filters['pi'] = document.getElementById('pi').value.toUpperCase();
        filters['active'] = document.getElementById('active').checked;
        filters['marked'] = document.getElementById('marked').checked;

        if (filters['erp'] < 0)
            filters['erp'] = 0;

        if (!filters['pi'].match(/^[0-9A-Fa-f]{4}$/))
            filters['pi'] = null;

        return filters;
    },

    _checkSidebar: function()
    {
        const widthThreshold = 1000;
        if (window.innerWidth >= widthThreshold)
        {
            app.showMenu(true);
        }
    },

    _restoreQth: function()
    {
        if ('qth' in this._params)
        {
            const [lat, lon] = this._params['qth'].split(",");
            if (lat && lon)
            {
                this.setLocation([lat, lon], true);

                const geolocationBox = document.getElementById('geolocation_box');
                geolocationBox.style.display = "none";

                const foreignQth = document.getElementById('foreign_qth');
                foreignQth.style.display = "inline";
            }
        }
        else
        {
            const lat = utils.getCookie('lat');
            const lon = utils.getCookie('lon');
            if (lat && lon)
            {
                this.setLocation([lat, lon], false);
            }
        }
    },

    _restoreFilter: function()
    {
        if ('erp' in this._params)
        {
            const erp = document.getElementById('erp');
            erp.value = this._params.erp;
        }

        if ('pol' in this._params)
        {
            const pol = document.getElementById('pol');
            pol.value = this._params.pol;
        }

        if ('pi' in this._params)
        {
            const pi = document.getElementById('pi');
            pi.value = this._params.pi;
        }

        if ('active' in this._params)
        {
            const active = document.getElementById('active');
            active.checked = this._params.active;
        }

        if ('marked' in this._params)
        {
            const marked = document.getElementById('marked');
            marked.checked = this._params.marked;
        }
    },

    /*
    _restoreMap: function()
    {
        if ('selection' in this._params)
        {
            const ids = this._params['selection'].split(',');
            for (let id of ids)
            {
                map.select(id);
            }
        }

        if ('paths' in this._params)
        {
            const ids = this._params['paths'].split(',');
            for (let id of ids)
            {
                map.addPath(id);
            }
        }
    },
    */

    _registerTitle: function(state)
    {
        const title = document.getElementById('title');
        title.onclick = function()
        {
            const expandable = document.getElementById('expandable');
            const active = expandable.style.display == 'block';
            app.showMenu(!active);
        }
    },

    _registerItu: function()
    {
        const itu = document.getElementById('itu');
        itu.onchange = function(event)
        {
            if (itu.value)
            {
                window.location.hash = "itu=" + itu.value;
            }
        };
    },

    _registerFreqForm: function()
    {
        const freqForm = document.getElementById('freq_form');
        freqForm.onsubmit = function(event)
        {
            if (event)
                event.preventDefault();

            const itu = document.getElementById('itu');
            const freq = document.getElementById('freq');

            if (freq.value)
            {
                const data = freq.value.split(' ');
                if (data.length > 1 &&
                    data[1].length >= 4)
                {
                    const pi = document.getElementById('pi');
                    pi.value = data[1].substr(0,4);
                    pi.classList.add('filtered');

                    window.location.hash = "freq=" + data[0];
                }
                else
                {
                    window.location.hash = "freq=" + freq.value;
                }

                itu.value = '';
                freq.value = '';
            }
        };
    },

    _registerKeepMap: function()
    {
        const keepMap = document.getElementById('keep_map');
        keepMap.checked = utils.getCookie('keep_map') == 1;
        keepMap.onchange = function(e)
        {
            utils.setCookie('keep_map', e.target.checked ? 1 : 0);
        };
    },

    _registerGeolocation: function()
    {
        const geolocation = document.getElementById('geolocation');
        geolocation.onchange = function(e)
        {
            geoloc.toggle(e.target.checked);
        };
    },

    _registerDark: function()
    {
        const dark = document.getElementById('dark');
        dark.checked = utils.getCookie('dark') == 1;
        dark.onchange = function(e)
        {
            utils.setCookie('dark', dark.checked ? 1 : 0);

            const map = document.getElementById('map');
            dark.checked ? map.classList.add('dark') : map.classList.remove('dark');
        };
        dark.onchange();
    },

    _registerErp: function()
    {
        const erp = document.getElementById('erp');
        erp.onchange = function (e)
        {
            app._filter();
        };

        erp.onkeyup = function (e)
        {
            app._filter();
        };

        const erpOff = document.getElementById('erp_off');
        erpOff.onclick = function (e)
        {
            erp.value = null;
            app._filter();
        };
    },

    _registerPol: function()
    {
        const pol = document.getElementById('pol');
        pol.onchange = function (e)
        {
            app._filter();
        };

        const polOff = document.getElementById('pol_off');
        polOff.onclick = function (e)
        {
            pol.value = null;
            app._filter();
        };
    },

    _registerPi: function()
    {
        const pi = document.getElementById('pi');
        pi.oninput = function (e)
        {
            app._filter();
        };

        const piOff = document.getElementById('pi_off');
        piOff.onclick = function (e)
        {
            pi.value = null;
            app._filter();
        };
    },

    _registerActive: function()
    {
        const active = document.getElementById('active');
        active.onchange = function(e) {
            app._filter();
        };
    },

    _registerMarked: function()
    {
        const marked = document.getElementById('marked');
        marked.onchange = function(e)
        {
            app._filter();
        };
    },

    _setTitle: function(type, value)
    {
        const title = document.getElementById('title');
        const text = type.charAt(0).toUpperCase() + type.slice(1) + ': ';
        var windowTitle = null;

        if (type == 'frequency')
        {
            const prev = frequency.modify(value, -1);
            const next = frequency.modify(value, 1);
            const minus = '<button onclick="event.stopPropagation(); window.location.hash = \'freq=\' + ' + prev + ';">-</button>';
            const plus = '<button onclick="event.stopPropagation(); window.location.hash = \'freq=\' + ' + next + ';">+</button>';
            const formatted = frequency.format(value);
            title.innerHTML = text + minus + ' <b>' + formatted + '</b> MHz ' + plus;
            windowTitle = formatted + ' MHz';
        }
        else
        {
            if (type == 'country' ||
                type == 'network')
            {
                windowTitle = value;
            }
            title.innerHTML = text + "<b>" + value + "</b>";
        }

        windowTitle = windowTitle ? (windowTitle + ' - ') : '';
        document.title = windowTitle + 'FM-DX Maps';
    },

    _setSource: function(sources, update)
    {
        var html = '';
        for (let name in sources)
        {
            html += (html.length ? ', ' : '');
            html += '<a href="' + sources[name] +'" target="_blank">' + name + '</a>';
        }

        const source = document.getElementById('source');
        source.innerHTML = ', data from ' + html;
        source.title = (update ? 'Last update: ' + update : 'unknown');
    },

    _filterInternal: function()
    {
        const filters = this.getFilters();
        dataset.filter(filters);

        const widgets = Object.assign({}, filters);
        widgets['label_active'] = widgets.active;
        widgets['label_marked'] = widgets.marked;

        for (let id in widgets)
        {
            utils.setClass(id, 'filtered', widgets[id]);
        }

        const filtered = dataset.getFilteredCount();
        const count = dataset.getCount();
        const status = document.getElementById('status');
        if (filtered != count)
        {
            status.innerHTML = "Filtered <b>" + filtered + "</b> out of <b>" + count + "</b> locations";
            status.classList.add('filtered');
        }
        else
        {
            status.innerHTML = "All <b>" + count + "</b> locations are currently visible";
            status.classList.remove('filtered');
        }
    },

    _filter: function()
    {
        this._filterInternal();
        list.update();
        map.update();
    },

    _findPi: function(pi)
    {
        const found = dataset.findPi(pi);
        if (found)
        {
            paths.clear();

            for (let id of found)
            {
                map.select(id);
                map.addPath(id);
            }

            return true;
        }

        return false;
    },

    _findId: function(findId)
    {
        var found = [];

        if (findId == '*')
        {
            found = dataset.findAll();
        }
        else
        {
            const stationIds = findId.split(',').map(function (x) { return parseInt(x, 10); });
            found = dataset.findId(stationIds);
        }

        if (found)
        {
            paths.clear();

            for (let id of found)
            {
                map.select(id);
                map.addPath(id);
            }

            return true;
        }

        return false;
    },

    _params: utils.getParams(),
    _initialized: false,
    _location: null
};

window.onload = function()
{
    app.init('/api/');
}
