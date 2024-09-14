"use strict";

const coverage =
{
    process: function(id)
    {
        this._request.onreadystatechange = function()
        {
            if (this.readyState == XMLHttpRequest.DONE)
            {
                if (this.status == 200)
                {
                    coverage._successCallback(id, this.responseText);
                }
                else
                {
                    coverage._errorCallback(this.statusText);
                }
            }
        };

        const url = '/api/coverage-info/?id=' + id;
        this._request.open("GET", url, true);
        this._request.send(null);
    },

    _successCallback: function(id, response)
    {
        response = JSON.parse(response);
        if (!response ||
            !response.north ||
            !response.south ||
            !response.east ||
            !response.west)
        {
            app.setError('Error: Invalid response');
            return;
        }

        app.setError(null);
        app.setCoverage(id, response);
    },

    _errorCallback: function(message)
    {
        app.setError('Error: ' + message);
    },

    _request: new XMLHttpRequest()
};
