"use strict";

const list =
{
    update: function()
    {
        const content = document.getElementById('content');

        if (this._defaultContent == null)
        {
            this._defaultContent = content.innerHTML;
        }

        if (selection.count() == 0)
        {
            content.innerHTML = this._defaultContent;
            return;
        }

        const filters = app.getFilters();
        const location = app.getLocation();
        var html = '<table class="list"><thead><tr><th>Freq</th><th>Station</th><th>PI</th><th>ERP</th></tr></thead>';
        var locations = [];

        for (var id in selection._list)
        {
            const entry = dataset.get().locations[id];

            var text = '<tr><td class="location" colspan="4">';
            text += '<label onclick="clipboard.copy(this.textContent + \' \' + this.title);" title="' + entry.lat + ', ' + entry.lon + '">';
            text += '<b>' + entry['name'] + '</b>';

            if (location)
            {
                const distance = utils.calculateDistance(location[0], location[1], entry.lat, entry.lon);
                const azimuth = utils.calculateAzimuth(location[0], location[1], entry.lat, entry.lon);
                text += ' [<span class="' + 0 + '">' + distance + '</span> km, ' + azimuth + '°]</label>';
            }

            text += '</td></tr>';

            for (let i = 0; i < +entry['stations'].length; i++)
            {
                if (entry['stations'][i]['extra'] != null ||
                    entry['stations'][i]['inactive'] && filters['active'] ||
                    entry['stations'][i]['erp'] < filters['erp'] ||
                    (filters['pi'] && entry['stations'][i]['pi'] != filters['pi']) ||
                    ((entry['stations'][i]['pol'] == 'v' && filters['pol'] == 'h') ||
                     (entry['stations'][i]['pol'] == 'h' && filters['pol'] == 'v')))
                {
                    text += "<tr class=\"invisible\">";
                }
                else
                {
                    text += "<tr>";
                }

                if (entry['stations'][i]['inactive'])
                {
                    text += '<td class="inactive">';
                }
                else
                {
                    text += '<td>';
                }

                text += "<a class=\"fetch\" href=\"#freq=" + entry['stations'][i]['freq'] + "\">" + frequency.format(entry['stations'][i]['freq']) + "</a>" + entry['stations'][i]['pol'] + "</td>";
                text += "<td><a class=\"fetch\" href=\"#station="+encodeURIComponent(entry['stations'][i]['station'])+"&itu="+entry['itu']+"\">"+entry['stations'][i]['station']+"</a>";

                if (entry['stations'][i]['regname'] != null)
                    text += " <i>"+entry['stations'][i]['regname']+"</i>";

                if (entry['stations'][i]['id'] >= 0)
                    text += " <a href=\"//fmscan.org/program.php?i="+entry['stations'][i]['id']+"\" target=\"_blank\"><strong>&rArr;</strong></a>";
                else if (entry['stations'][i]['id'] > -100000)
                    text += " <a href=\"//radiopolska.pl/wykaz/fm/"+(-entry['stations'][i]['id'])+"\" target=\"_blank\"><strong>&rArr;</strong></a>";

                text += "</td>";

                if (entry['stations'][i]['pi'] != null)
                    text += "<td class=\"pi\">"+entry['stations'][i]['pi']+"</td>";
                else
                    text += "<td></td>";

                text += "<td class=\"erp\">";

                if (entry['stations'][i]['coverage'])
                {
                    text += "<a href=\"#\" onclick=\"coverage.process('"+entry['stations'][i]['coverage']+"'); event.preventDefault();\">";
                }

                text += (entry['stations'][i]['erp'] > 0 ? entry['stations'][i]['erp'].toFixed(3) : '');

                if (entry['stations'][i]['coverage'])
                {
                    text += "</a>";
                }

                text += "</td>";

                text += "</tr>";
            }

            html += text;

            locations.push([entry.lat, entry.lon]);
        }

        html += "</table>";
        html += '<div class="txradius">show TXs around:&nbsp;&nbsp;<b>';

        const center = utils.calculateCenter(locations);
        for (let step of this._steps)
        {
            html += '<a class="fetch" href="#lat=' + center[0].toFixed(6) + '&lon=' + center[1].toFixed(6) + "&r=" + step + '">' + step + '</a>&nbsp;&nbsp;&nbsp;';
        }

        html += 'km</b></div>';

        content.innerHTML = html;
    },

    _steps: [50, 100, 250, 400],
    _defaultContent: null
};
