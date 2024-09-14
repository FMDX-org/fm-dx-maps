"use strict";

const frequency =
{
    format: function(value)
    {
        const text = value.toString();
        return text.includes('.') ? value : value + '.0';
    },

    modify: function(value, count)
    {
        value = Math.round(parseFloat(value) * 1000);

        if (value >= 65750 &&
            value <= 74000)
        {
            return this._modifyInternal(value, 65750, 30, count) / 1000;
        }

        return this._modifyInternal(value, 0, 100, count) / 1000;
    },

    _modifyInternal: function(current, baseFreq, step, count)
    {
        const remainder = (current - baseFreq) % step;
        if (remainder == 0)
        {
            return current + (step * count);
        }

        const truncated = baseFreq + (Math.floor((current - baseFreq) / step) * step);
        return truncated + (count > 0 ? (step * count) : (step * (count + 1)));
    }
};
