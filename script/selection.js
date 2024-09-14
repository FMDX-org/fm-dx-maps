"use strict";

const selection =
{
	contains: function(id)
	{
		return (id in this._list);
	},

	count: function()
	{
		return Object.keys(this._list).length;
	},

	add: function(id)
	{
		if (id in this._list)
		{
			return false;
		}

		this._list[id] = 1;
		return true;
	},

	remove: function(id)
	{
		if (id in this._list)
		{
			delete this._list[id];
			return true;
		}

		return false;
	},

	equals: function(second)
	{
		const lengthA = Object.keys(this._list).length;
		const lengthB = Object.keys(second).length;

		if (lengthA != lengthB)
		{
			return false;
		}

		for (let id in this._list)
		{
			if (!(id in second))
			{
				return false;
			}
		}

		return true;
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
			callback(id);
		}
	},

	_list: {}
};
