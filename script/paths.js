"use strict";

const paths =
{
	contains: function(id)
	{
		return (id in this._list);
	},

	empty: function(id)
	{
		for (let id in this._list)
		{
			return false;
		}

		return true;
	},

	add: function(id, path)
	{
		if (id in this._list)
		{
			return null;
		}

		this._list[id] = new L.Geodesic(path,
		{
			color: '#ff0000',
			weight: 3,
			opacity: 0.5
		});

		return this._list[id];
	},

	remove: function(id)
	{
		if (id in this._list)
		{
			this._list[id].remove();
			delete this._list[id];
			return true;
		}

		return false;
	},

	clear: function(id)
	{
		for (let id in this._list)
		{
			this.remove(id);
		}
	},

	get: function()
	{
		return Object.keys(this._list);
	},

	foreach: function(callback)
	{
		for (let id in this._list)
		{
			callback(id, this._list[id]);
		}
	},

	_list: {}
};
