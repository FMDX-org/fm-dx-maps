"use strict";

const fetch =
{
    process: function(address, query)
    {
        app.setError(null);
        app.setProgress(true);

        this._request.onreadystatechange = function()
        {
            if (this.readyState == XMLHttpRequest.DONE)
            {
                if (this.status == 200)
                {
                    fetch._successCallback(query, this.responseText);
                }
                else
                {
                    fetch._errorCallback(this.statusText);
                }
            }
        };

        const url = address + '?' + query;
        this._request.open("GET", url, true);
        this._request.send(null);
    },

    _successCallback: function(query, response)
    {
        app.setProgress(false);

        response = JSON.parse(response);
        if (!response ||
            !response.locations)
        {
            app.setError('Error: Invalid response');
            return;
        }

        if (Object.keys(response.locations).length == 0)
        {
            app.setError('Error: Empty dataset');
            return;
        }

        app.setError(null);
        app.setDataset(response);
    },

    _errorCallback: function(message)
    {
        app.setProgress(false);
        app.setStatus(null);
        app.setError('Error: ' + message);
    },

    _request: new XMLHttpRequest()
};
