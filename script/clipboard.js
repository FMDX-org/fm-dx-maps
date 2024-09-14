"use strict";

const clipboard =
{
    copy: function(string)
    {
        navigator.clipboard.writeText(string);
        this._show(string);
    },

    _show: function(string)
    {
        const info = document.getElementById('info');
        info.style.display = 'block';
        info.innerHTML = '<b>Copied to clipboard:</b><br />' + string;

        if (this._timeout)
        {
            clearTimeout(this._timeout);
        }

        this._timeout = setTimeout(function() {
            this._hide();
        }.bind(this), 4000);
    },

    _hide: function()
    {
        const info = document.getElementById('info');
        info.style.display = 'none';

        this._timeout = null;
    },

    _timeout: null
};
