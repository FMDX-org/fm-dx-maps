"use strict";

const geoloc =
{
    toggle: function(state)
    {
        if (state)
        {
            if (navigator.geolocation)
            {
                const interval = 1000;
                this._timer = setInterval(this._feed, interval, this);
            }
            else
            {
                app.setError('Geolocation unsupported');
                app.setGeolocation(null);
            }
        }
        else if (this._timer != null)
        {
            clearTimeout(this._timer);
            this._timer = null;
        }
    },

    _feed: function(context)
    {
        navigator.geolocation.getCurrentPosition((result) =>
        {
            if (context._timer != null)
            {
                app.setGeolocation([result.coords.latitude, result.coords.longitude]);
            }
        }, function()
        {
            app.setError('Geolocation failed');
            app.setGeolocationn(null);
        });
    },

    _timer: null
};
