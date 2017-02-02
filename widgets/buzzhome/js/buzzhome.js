/*
    ioBroker.vis buzzhome-wandthermostat Widget-Set

    version: "0.0.1"

    Copyright 10.2015-2016 ThomasBayer<thomas_bayer@gmx.net>

*/
"use strict";

// add translations for edit mode
if (vis.editMode) {
    $.extend(true, systemDictionary, {
        "myColor": { "en": "myColor", "de": "mainColor", "ru": "Мой цвет" },
        "myColor_tooltip": {
            "en": "Description of\x0AmyColor",
            "de": "Beschreibung von\x0AmyColor",
            "ru": "Описание\x0AmyColor"
        },
        "htmlText": { "en": "htmlText", "de": "htmlText", "ru": "htmlText" },
        "group_extraMyset": { "en": "extraMyset", "de": "extraMyset", "ru": "extraMyset" },
        "extraAttr": { "en": "extraAttr", "de": "extraAttr", "ru": "extraAttr" }
    });
}

// add translations for non-edit mode
$.extend(true, systemDictionary, {
    "Instance": { "en": "Instance", "de": "Instanz", "ru": "Инстанция" }
});

// this code can be placed directly in buzzhome-wandthermostat.html



vis.binds.buzzhome = {

    colorFunctions: {

        ColorLuminance: function (hex, lum) {

            // validate hex string
            hex = String(hex).replace(/[^0-9a-f]/gi, '');
            if (hex.length < 6) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            lum = lum || 0;

            // convert to decimal and change luminosity
            var rgb = "#", c, i;
            for (i = 0; i < 3; i++) {
                c = parseInt(hex.substr(i * 2, 2), 16);
                c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
                rgb += ("00" + c).substr(c.length);
            }

            return rgb;
        },

        setForegroundColor: function (backgroundcolor) {

            var bghex = backgroundcolor.replace(/[#]/g, '');

            var bigint = parseInt(bghex, 16);
            var r = (bigint >> 16) & 255;
            var g = (bigint >> 8) & 255;
            var b = bigint & 255;

            console.log(backgroundcolor);
            console.log("r" + r + " g" + g + " b" + b);

            var o = Math.round(((parseInt(r) * 299) + (parseInt(g) * 587) + (parseInt(b) * 114)) / 1000);

            console.log("o" + o);

            if (o > 135) {
                return '#000000';
            }
            else {
                return '#FFFFFF';
            }

        },



    }
}