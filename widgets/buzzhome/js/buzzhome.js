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


    wandthermostat: {
        init: function (wid, view, data, style, wType) {

            var $div = $('#' + wid).addClass('buzzhome-Root');
            if (!$div.length) {
                setTimeout(function () {
                    vis.binds.buzzhome.wandthermostat.init(wid, view, data, style, wType);
                }, 100);
                return;
            }



            //DataHandling
            var _data = { wid: wid, view: view, wType: wType };

            for (var a in data) {
                if (!data.hasOwnProperty(a) || typeof data[a] == 'function') continue;
                if (a[0] != '_') {
                    _data[a] = data[a];
                }
            }
            data = _data;

            if (data.oid) {
                data.value = vis.states.attr(data.oid + '.val');
                data.ack = vis.states.attr(data.oid + '.ack');
                data.lc = vis.states.attr(data.oid + '.lc');
                console.log(data.value + ',' + data.ack + ',' + data.lc);

                vis.states.bind(data.oid + '.val', function (e, newVal, oldVal) {
                    //console.log("value SetTemperature changed - old: " + oldVal + " newValue: "+ newVal);
                    data.value = newVal
                    $('#buzzhome-SetTemperature').html(data.value + '&ordm;C');
                    $("#buzzhome-slider").slider('value', data.value)

                });
            }

            if (data['oid-humidity']) {
                vis.states.bind(data['oid-humidity'] + '.val', function (e, newVal, oldVal) {
                    data.humidity = newVal;
                    $('#humidity-value').html(data.humidity);
                    //console.log("value oid-humidity changed - old: " + oldVal + " newValue: "+ newVal);
                });
            }

            if (data['oid-actual']) {
                vis.states.bind(data['oid-actual'] + '.val', function (e, newVal, oldVal) {
                    data.actual = newVal;
                    $('#buzzhome-TemperatureValue').html(Math.round(data.actual));
                    //console.log("value oid-actual changed - old: " + oldVal + " newValue: "+ newVal);
                });
            }

            if (data['oid-windowstate']) {
                vis.states.bind(data['oid-windowstate'] + '.val', function (e, newVal, oldVal) {
                    data.windowstate = newVal;
                    vis.binds.buzzhome.wandthermostat.updateWindowStatus(data.windowstate);
                    //console.log("value oid-windowstate changed - old: " + oldVal + " newValue: "+ newVal);
                });
            }

            if (data['oid-mode']) {
                vis.states.bind(data['oid-mode'] + '.val', function (e, newVal, oldVal) {
                    data.mode = newVal;
                    vis.binds.buzzhome.wandthermostat.updateModeStatus(data.mode);
                    //console.log("value oid-mode changed - old: " + oldVal + " newValue: "+ newVal);
                });
            }

            if (data['oid-battery']) {
                vis.states.bind(data['oid-battery'] + '.val', function (e, newVal, oldVal) {
                    data.battery = newVal;
                    vis.binds.buzzhome.wandthermostat.updateBatteryStatus(data.battery);
                    //console.log("value oid-battery changed - old: " + oldVal + " newValue: "+ newVal);
                });
            }


            if (data['oid-humidity']) data.humidity = vis.states.attr(data['oid-humidity'] + '.val');
            if (data['oid-actual']) data.actual = vis.states.attr(data['oid-actual'] + '.val');
            if (data['oid-battery']) data.battery = vis.states.attr(data['oid-battery'] + '.val');
            if (data['oid-windowstate']) data.windowstate = vis.states.attr(data['oid-windowstate'] + '.val');
            if (data['oid-mode']) data.mode = vis.states.attr(data['oid-mode'] + '.val');




            data.Title = data.Title || 0;
            data.actual = data.actual || 0;
            data.value = data.value || 0;
            data.humidity = data.humidity || 0;

            console.log("Title: " + data.Title + ", Humidity: " + data.humidity + ", Actual:" + data.actual + ", Battery:" + data.battery + ", Window:" + data.windowstate + ", Mode:" + data.mode);



            var $Title = (data.Title).toString();
            var $Actual = Math.round(data.actual);
            var $Value = (data.value).toString().replace('.', ',');
            var $Humidity = (data.humidity).toString().replace('.', ',');
            var $PrimaryColor = data.maincolor;
            var $invertColors = data.invertColors;





            //HTML Zeichnen
            vis.binds.buzzhome.wandthermostat.draw($div, $Title, $Actual, $Value, $Humidity);

            //Farben zuweisen
            vis.binds.buzzhome.wandthermostat.setHighlightColor($PrimaryColor, $invertColors);
            //console.log($invertColors);

            // create slider
            vis.binds.buzzhome.wandthermostat.createSlider($Value, data.oid);

            // update BatteryIndicator
            vis.binds.buzzhome.wandthermostat.updateBatteryStatus(data.battery);

            // update WindowState
            vis.binds.buzzhome.wandthermostat.updateWindowStatus(data.windowstate);

            // update Mode
            vis.binds.buzzhome.wandthermostat.updateModeStatus(data.mode);


        },

        createSlider: function (slideAmount, dataoid) {

            var chosenPosition = $('#buzzhome-chosen');
            var display = $('#buzzhome-chosenValue');



            $("#buzzhome-slider").slider({
                min: 12,
                max: 30,
                animate: "slow",
                range: "min",
                value: slideAmount,

                slide: function (event, ui) {
                    chosenPosition.css("opacity", "1");

                    $('.ui-slider-handle').html(chosenPosition); //attach chosenPosition to sliderhandle

                    display.html(ui.value);
                },
                stop: function (event, ui) {
                    chosenPosition.css("opacity", "0");
                    vis.setValue(dataoid, ui.value);
                }
            });

        },

        setHighlightColor: function (PrimaryColor, invertColors) {

            var Color1 = PrimaryColor;
            var Color2 = vis.binds.buzzhome.wandthermostat.ColorLuminance(PrimaryColor, -0.3);

            var Root = $(".buzzhome-Root");
            var Title = $("#buzzhome-Title");
            var TemperatureValue = $("#buzzhome-TemperatureValue");
            var SetTemperature = $("#buzzhome-SetTemperature");
            var smallValues = $(".buzzhome-ValueSmall");
            var len = smallValues.length;


            if (invertColors == true) {

                Root.css("backgroundColor", PrimaryColor);

                Root.css("boxShadow", "0px 0px 20px transparent");

                Title.css("color", "#FFFFFF");

                TemperatureValue.css("color", "#FFFFFF");

                SetTemperature.css("color", "#FFFFFF");

                $("#buzzhome-chosenValue").css("color", vis.binds.buzzhome.wandthermostat.setForegroundColor(PrimaryColor));

                for (var i = 0; i < len; i++) {
                    smallValues.eq(i).css("color", "#FFFFFF");

                }

            }

            else {

                Title.css("color", PrimaryColor);

                $("#buzzhome-chosenBorder").css("backgroundColor", PrimaryColor);

                Root.css("backgroundColor", "#FFFFFF");

                Root.css("boxShadow", "0px 0px 15px" + PrimaryColor);

                $("#buzzhome-ChosenSVG").attr("fill", Color2);

                $("#buzzhome-chosenValue").css("color", vis.binds.buzzhome.wandthermostat.setForegroundColor(PrimaryColor));

                $("#buzzhome-slider .ui-slider-range").css("backgroundImage", "linear-gradient(" + Color2 + " 0%," + PrimaryColor + " 15%)");

                TemperatureValue.css("color", PrimaryColor);

                SetTemperature.css("color", PrimaryColor);

                for (var i = 0; i < len; i++) {
                    smallValues.eq(i).css("color", PrimaryColor);
                }

            }

        },

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

        updateBatteryStatus: function (batteryStatus) {
            if (batteryStatus == 1) {

                $('#buzzhome-BatteryIndicator').css('opacyty', '0');
            }
            else {

                $('#buzzhome-BatteryIndicator').css('opacyty', '1');
            }
        },

        updateWindowStatus: function (windowStatus) {

            var text;

            switch (windowStatus) {
                case 0:
                    text = "closed";
                    break;
                case 1:
                    text = "open";
                    break;
                default:
                    text = "undefined";
            }

            $('#windowstate-value').html(text);

        },

        updateModeStatus: function (modeStatus) {

            var text;

            switch (modeStatus) {
                case 0:
                    text = "auto";
                    break;
                case 1:
                    text = "manual";
                    break;
                case 2:
                    text = "boost";
                    break;
                case 3:
                    text = "holiday";
                    break;
                default:
                    text = "undefined";
            }


            $('#mode-value').html(text);

        },

        draw: function (container, title, actual, value, humidity) {
            //Hier wird das HTML zusammengebaut und an den Container übergeben
            var $SetTemperatureValueHtml = '<div id="buzzhome-SetTemperatureContainer">' +
                '<span id="buzzhome-SetLabel" class="buzzhome-SetLabel">SET:</span>' +
                '<span id="buzzhome-SetTemperature" class="buzzhome-SetTemperature">' + value + '&ordm;C</span>' +
                '</div>';

            var $TitleHtml = '<span id="buzzhome-Title" class="buzzhome-Title">' + title + '</span>';

            var $TableHtml = '<table class="buzzhome-table" width="100%" height="100%">' +
                '<tr>' +
                '<td width="50%" height="100%" style="text-align:center;">' +
                '<span id="buzzhome-TemperatureValue" class="buzzhome-Value" data-oid="">' + actual + '</span><span class="buzzhome-ValueSmall">&ordm;C</span>' +
                '</td>' +
                '<td width="50%" height="100%">' +
                '<span class="buzzhome-Label">Humidity: </span><span class="buzzhome-ValueSmall" id="humidity-value">' + humidity + '</span><span class="buzzhome-Label"> %</span><br>' +
                '<span class="buzzhome-Label">Window: </span><span class="buzzhome-ValueSmall" id="windowstate-value">undefined</span><br>' +
                '<span class="buzzhome-Label">Mode: </span><span class="buzzhome-ValueSmall" id="mode-value">undefined</span><br>' +
                '</td>' +
                ' </tr>' +
                ' </table>'


            var $SliderHtml = '<div id="buzzhome-SliderContainer">' +
                '<div id="buzzhome-slider">' +
                '</div>' +

                '<div id="buzzhome-SliderBackground"> </div>' +


                '<div id="buzzhome-chosen">' +
                '<svg id="buzzhome-ChosenSVG" class="buzzhome-ChosenSVG" viewBox="0 0 36.154 44.077">' +
                '<path d="M0,27.891V0l36.154,44.077L0,27.891z" />' +
                '</svg>' +

                '<div id="buzzhome-chosenBorder"></div>' +

                '<span id="buzzhome-chosenValue"></span>' +
                ' </div>' +
                ' </div>'

            var $BatteryIndicatorHtml = '<svg id="buzzhome-BatteryIndicator" viewBox="0 0 28 28">' +
                '<path d="M27,8v12H4v-3H1v-6h3V8h17.8L21,10H6v8h14l3-8l0.8-2H27z" />' +
                '</svg>'




            container.append($TitleHtml + $SetTemperatureValueHtml + $TableHtml + $SliderHtml + $BatteryIndicatorHtml);



        }

    },

    wetter: {

        init: function (wid, view, data, style, wType) {

            var $div = $('#' + wid).addClass('buzzhome-Root');
            if (!$div.length) {
                setTimeout(function () {
                    vis.binds.buzzhome.wetter.init(wid, view, data, style, wType);
                }, 100);
                return;
            }



            //DataHandling
            var _data = { wid: wid, view: view, wType: wType };

            for (var a in data) {
                if (!data.hasOwnProperty(a) || typeof data[a] == 'function') continue;
                if (a[0] != '_') {
                    _data[a] = data[a];
                }
            }
            data = _data;

            // if (data.oid) {
            //     data.value = vis.states.attr(data.oid + '.val');
            //     data.ack = vis.states.attr(data.oid + '.ack');
            //     data.lc = vis.states.attr(data.oid + '.lc');

            // vis.states.bind(data.oid + '.val', function (e, newVal, oldVal) {
            //     //console.log("value SetTemperature changed - old: " + oldVal + " newValue: "+ newVal);
            //     data.value = newVal
            //     $('#buzzhome-SetTemperature').html(data.value + '&ordm;C');
            //     $("#buzzhome-slider").slider('value', data.value)

            // });
            // }

            // if (data['oid-humidity']) {
            //     vis.states.bind(data['oid-humidity'] + '.val', function (e, newVal, oldVal) {
            //         data.humidity = newVal;
            //         $('#humidity-wetter-value').html(data.humidity);
            //         //console.log("value oid-humidity changed - old: " + oldVal + " newValue: "+ newVal);
            //     });
            // }

            // if (data['oid-actual']) {
            //     vis.states.bind(data['oid-actual'] + '.val', function (e, newVal, oldVal) {
            //         data.actual = newVal;
            //         $('#buzzhome-wetter-TemperatureValue').html(Math.round(data.actual));
            //         //console.log("value oid-actual changed - old: " + oldVal + " newValue: "+ newVal);
            //     });
            // }

            // if (data['oid-windowstate']) {
            //     vis.states.bind(data['oid-windowstate'] + '.val', function (e, newVal, oldVal) {
            //         data.windowstate = newVal;
            //         vis.binds.buzzhome.wandthermostat.updateWindowStatus(data.windowstate);
            //         //console.log("value oid-windowstate changed - old: " + oldVal + " newValue: "+ newVal);
            //     });
            // }

            // if (data['oid-mode']) {
            //     vis.states.bind(data['oid-mode'] + '.val', function (e, newVal, oldVal) {
            //         data.mode = newVal;
            //         vis.binds.buzzhome.wandthermostat.updateModeStatus(data.mode);
            //         //console.log("value oid-mode changed - old: " + oldVal + " newValue: "+ newVal);
            //     });
            // }

            // if (data['oid-battery']) {
            //     vis.states.bind(data['oid-battery'] + '.val', function (e, newVal, oldVal) {
            //         data.battery = newVal;
            //         vis.binds.buzzhome.wandthermostat.updateBatteryStatus(data.battery);
            //         //console.log("value oid-battery changed - old: " + oldVal + " newValue: "+ newVal);
            //     });
            // }


            if (data['oid-aktualisierung']) data.aktualisierung = vis.states.attr(data['oid-aktualisierung'] + '.val');
            if (data['oid-bedingung']) data.bedingung = vis.states.attr(data['oid-bedingung'] + '.val');
            if (data['oid-luftdruck']) data.luftdruck = vis.states.attr(data['oid-luftdruck'] + '.val');
            if (data['oid-luftdrucktrend']) data.luftdrucktrend = vis.states.attr(data['oid-luftdrucktrend'] + '.val');
            if (data['oid-luftfeuchte']) data.luftfeuchte = vis.states.attr(data['oid-luftfeuchte'] + '.val');
            if (data['oid-wetterstation']) data.wetterstation = vis.states.attr(data['oid-wetterstation'] + '.val');
            if (data['oid-taupunkt']) data.taupunkt = vis.states.attr(data['oid-taupunkt'] + '.val');
            if (data['oid-temperatur']) data.temperatur = vis.states.attr(data['oid-temperatur'] + '.val');
            if (data['oid-uv']) data.uv = vis.states.attr(data['oid-uv'] + '.val');
            if (data['oid-windbedingungen']) data.windbedingungen = vis.states.attr(data['oid-windbedingungen'] + '.val');
            if (data['oid-windboeen']) data.windboeen = vis.states.attr(data['oid-windboeen'] + '.val');
            if (data['oid-windgeschindigkeit']) data.windgeschindigkeit = vis.states.attr(data['oid-windgeschindigkeit'] + '.val');
            if (data['oid-windrichtg']) data.windrichtg = vis.states.attr(data['oid-windrichtg'] + '.val');
            if (data['oid-windrichtung']) data.windrichtung = vis.states.attr(data['oid-windrichtung'] + '.val');
            if (data['oid-icon']) data.icon = vis.states.attr(data['oid-icon'] + '.val');


            console.log(
                "aktualisierung: " + data.aktualisierung +
                ", bedingung: " + data.bedingung +
                ", luftdruck:" + data.luftdruck +
                ", luftdrucktrend:" + data.luftdrucktrend +
                ", luftfeuchte:" + data.luftfeuchte +
                ", wetterstation: " + data.wetterstation +
                ", taupunkt:" + data.taupunkt +
                ", temperatur:" + data.temperatur +
                ", uv:" + data.uv +
                ", windbedingungen: " + data.windbedingungen +
                ", windboeen:" + data.windboeen +
                ", windgeschindigkeit:" + data.windgeschindigkeit +
                ", windrichtg:" + data.windrichtg +
                ", icon:" + data.icon +
                ", windrichtung:" + data.windrichtung);



            var $Title = (data.Title).toString();
            var $Temperature = Math.round(data.temperatur);
            var $Taupunkt = Math.round(data.taupunkt);
            //var $Value = (data.value).toString().replace('.', ',');
            var $PrimaryColor = data.maincolor;
            var $invertColors = data.invertColors;
            var iconPath = vis.binds.buzzhome.wetter.setIconPath(data.icon);





            
            //HTML Zeichnen
            vis.binds.buzzhome.wetter.draw($div, $Title, $Temperature, data.luftfeuchte, data.luftdruck, data.windgeschindigkeit, $Taupunkt, iconPath);

//Windrose
            vis.binds.buzzhome.wetter.setWindDirection(data.windrichtg);

        },

        setWindDirection: function (windrichtung) {
            $("#buzzhome-windrotate-icon").css("transform", "rotate(" + windrichtung + "deg)");
            console.log("test");
        },

        draw: function (container, title, temperature, luftfeuchte, luftdruck, windgeschwindigkeit, taupunkt, iconPath) {
            //Hier wird das HTML zusammengebaut und an den Container übergeben

            var $TitleHtml = '<span id="buzzhome-wetter-Title" class="buzzhome-Title">' + title + '</span>';

            var $TableHtml = '<table class="buzzhome-table" width="100%" height="100%">' +
                '<tr>' +
                '<td width="50%" height="100%" style="text-align:center;">' +
                '<svg id="buzzhome-wetter-icon" class="buzzhome-wetter-icon" viewBox="0 0 26 26">' +
                '<path d="' + iconPath + '" />' +
                '</svg><br/>' +
                ' <span id="buzzhome-wetter-city" class="buzzhome-Label">Strassgang</span> <br /> <span id="buzzhome-wetter-TemperatureValue" class="buzzhome-ValueSmall">' + temperature + '</span><span class="buzzhome-ValueSmall">&ordm;C</span>' +
                '</td>' +
                '<td width="50%" height="100%">' +
                '<span class="buzzhome-Label">Humidity: </span><span class="buzzhome-ValueSmall" id="luftfeuchte-wetter-value">' + luftfeuchte + '</span><span class="buzzhome-Label"> %</span><br>' +
                '<span class="buzzhome-Label">Pressure: </span><span class="buzzhome-ValueSmall" id="luftdruck-wetter-value">' + luftdruck + '</span><span class="buzzhome-Label"> mbar</span><br>' +
                '<span class="buzzhome-Label">Wind: </span><span class="buzzhome-ValueSmall" id="wind-wetter-value">' + windgeschwindigkeit + '</span><span class="buzzhome-Label"> km/h</span>' +
                '   <span id="buzzhome-windrotate-container">' +
                ' <svg id="buzzhome-windrose" viewBox="0 0 26 26">' +
                ' <path d="M13,0C5.82,0,0,5.82,0,13s5.82,13,13,13s13-5.82,13-13S20.18,0,13,0zM13.984,23.953L13,21l-0.983,2.95c-5.281-0.471-9.496-4.686-9.967-9.967L5,13l-2.95-0.983c0.471-5.281,4.686-9.496,9.967-9.967L13,5l0.984-2.953c5.28,0.471,9.495,4.688,9.966,9.969L21,13l2.95,0.983C23.479,19.264,19.265,23.482,13.984,23.953z" /></svg>' +
                '<svg id="buzzhome-windrotate-icon" viewBox="0 0 6 24">' +
                '<path d="M6,12L3,24L0,12l1.5-6l0.75,3L1.5,12h3L4,10L3,6L2.25,3L3,0L6,12z" /> </svg>' +
                '</span>' +
                '<path d="M25.56,51.12L0,85.56L25.56,0l25.56,85.56L25.56,51.12z" />' +
                '</svg></br>' +
                '<span class="buzzhome-Label">Dewpoint: </span><span class="buzzhome-ValueSmall" id="wind-wetter-value">' + taupunkt + '</span><span class="buzzhome-Label"> °C</span><br>' +
                '</td>' +
                ' </tr>' +
                ' </table>';




            var $ForecastContainerHtml = '<div id="buzzhome-forecast-container" style="width:100%; height:32px;" >' +
                '<table style="text-align:center; border-collapse: separate; border-spacing: 0px; " width="100% " height="32px">' +
                '<tr>' +
                '<td style="background-color:rgba(165, 124, 52, 0.40);">' +
                '<span class="buzzhome-forecast-Label">Mon</span>' +
                '<svg id="buzzhome-forecast-icon1" viewBox="0 0 26 26">' +
                '<path d="M24,20.538C24,22.45,22.45,24,20.538,24H14H7.462C5.55,24,4,22.45,4,20.538c0-1.215,0.629-2.28,1.576-2.898c-0.023-0.185-0.038-0.373-0.038-0.564c0-1.07,0.379-2.042,0.989-2.824C6.343,14.04,6.167,13.82,6.019,13.58l-4.676,2.885c-0.505-0.82-0.901-1.7-1.176-2.617l5.269-1.578c-0.269-0.895-0.317-1.868-0.087-2.842L0,8.162C0.217,7.248,0.554,6.346,1.021,5.48l4.842,2.61C6.327,7.228,7.002,6.518,7.81,6.019L4.925,1.343c0.82-0.505,1.7-0.901,2.617-1.176L9.12,5.435c0.895-0.269,1.868-0.317,2.842-0.087L13.229,0c0.914,0.217,1.815,0.554,2.682,1.021L13.3,5.863c0.862,0.464,1.573,1.139,2.071,1.948l4.676-2.885c0.505,0.82,0.901,1.7,1.176,2.617L15.955,9.12c0.181,0.602,0.246,1.241,0.209,1.891c0.004-0.001,0.007-0.002,0.011-0.003c-0.002,0.028-0.008,0.055-0.01,0.084c-0.002,0.023,0.003,0.044,0.001,0.067c-0.003,0.031-0.002,0.064-0.006,0.095c-0.01,0.094-0.032,0.188-0.047,0.282c-0.008,0.051-0.016,0.103-0.026,0.153c-0.012,0.061-0.017,0.123-0.031,0.184c-0.011,0.048-0.018,0.096-0.03,0.143l-0.016,0.003c-0.116,0.458-0.283,0.895-0.507,1.298c-0.468,0.247-0.88,0.602-1.193,1.048l-1.112,1.58l-1.617-1.057c-0.426-0.279-0.919-0.426-1.426-0.426c-1.442,0-2.615,1.173-2.615,2.615c0,0.089,0.008,0.194,0.023,0.321l0.151,1.237l-1.044,0.681C6.25,19.589,6,20.046,6,20.538C6,21.344,6.656,22,7.462,22H14h6.538C21.344,22,22,21.344,22,20.538c0-0.51-0.27-0.975-0.721-1.245l-1.264-0.756l0.346-1.432c0.068-0.279,0.1-0.54,0.1-0.798c0-1.613-1.136-2.962-2.649-3.299c0.209-0.624,0.33-1.286,0.364-1.972c2.446,0.508,4.285,2.674,4.285,5.271c0,0.438-0.058,0.861-0.157,1.269C23.316,18.181,24,19.275,24,20.538z" />' +
                '</svg>' +
                '<span class="buzzhome-forecast-Label">27°C</span>' +
                '<span class="buzzhome-forecast-Label">12°C</span>' +
                '</td>' +

                '<td style="background-color:rgba(165, 124, 52, 0.35);">' +
                ' <span class="buzzhome-forecast-Label">Thue</span>' +
                '<svg id="buzzhome-forecast-icon2" viewBox="0 0 26 26">' +
                '<path d="M24,20.538C24,22.45,22.45,24,20.538,24H14H7.462C5.55,24,4,22.45,4,20.538c0-1.215,0.629-2.28,1.576-2.898c-0.023-0.185-0.038-0.373-0.038-0.564c0-1.07,0.379-2.042,0.989-2.824C6.343,14.04,6.167,13.82,6.019,13.58l-4.676,2.885c-0.505-0.82-0.901-1.7-1.176-2.617l5.269-1.578c-0.269-0.895-0.317-1.868-0.087-2.842L0,8.162C0.217,7.248,0.554,6.346,1.021,5.48l4.842,2.61C6.327,7.228,7.002,6.518,7.81,6.019L4.925,1.343c0.82-0.505,1.7-0.901,2.617-1.176L9.12,5.435c0.895-0.269,1.868-0.317,2.842-0.087L13.229,0c0.914,0.217,1.815,0.554,2.682,1.021L13.3,5.863c0.862,0.464,1.573,1.139,2.071,1.948l4.676-2.885c0.505,0.82,0.901,1.7,1.176,2.617L15.955,9.12c0.181,0.602,0.246,1.241,0.209,1.891c0.004-0.001,0.007-0.002,0.011-0.003c-0.002,0.028-0.008,0.055-0.01,0.084c-0.002,0.023,0.003,0.044,0.001,0.067c-0.003,0.031-0.002,0.064-0.006,0.095c-0.01,0.094-0.032,0.188-0.047,0.282c-0.008,0.051-0.016,0.103-0.026,0.153c-0.012,0.061-0.017,0.123-0.031,0.184c-0.011,0.048-0.018,0.096-0.03,0.143l-0.016,0.003c-0.116,0.458-0.283,0.895-0.507,1.298c-0.468,0.247-0.88,0.602-1.193,1.048l-1.112,1.58l-1.617-1.057c-0.426-0.279-0.919-0.426-1.426-0.426c-1.442,0-2.615,1.173-2.615,2.615c0,0.089,0.008,0.194,0.023,0.321l0.151,1.237l-1.044,0.681C6.25,19.589,6,20.046,6,20.538C6,21.344,6.656,22,7.462,22H14h6.538C21.344,22,22,21.344,22,20.538c0-0.51-0.27-0.975-0.721-1.245l-1.264-0.756l0.346-1.432c0.068-0.279,0.1-0.54,0.1-0.798c0-1.613-1.136-2.962-2.649-3.299c0.209-0.624,0.33-1.286,0.364-1.972c2.446,0.508,4.285,2.674,4.285,5.271c0,0.438-0.058,0.861-0.157,1.269C23.316,18.181,24,19.275,24,20.538z" />' +
                '  </svg>' +
                '  <span class="buzzhome-forecast-Label">27°C</span>' +
                '  <span class="buzzhome-forecast-Label">12°C</span>' +
                '  </td>' +

                '  <td style="background-color:rgba(165, 124, 52, 0.25);">' +
                '  <span class="buzzhome-forecast-Label">Wed</span>' +
                '  <svg id="buzzhome-forecast-icon3" viewBox="0 0 26 26">' +
                '     <path d="M24,20.538C24,22.45,22.45,24,20.538,24H14H7.462C5.55,24,4,22.45,4,20.538c0-1.215,0.629-2.28,1.576-2.898c-0.023-0.185-0.038-0.373-0.038-0.564c0-1.07,0.379-2.042,0.989-2.824C6.343,14.04,6.167,13.82,6.019,13.58l-4.676,2.885c-0.505-0.82-0.901-1.7-1.176-2.617l5.269-1.578c-0.269-0.895-0.317-1.868-0.087-2.842L0,8.162C0.217,7.248,0.554,6.346,1.021,5.48l4.842,2.61C6.327,7.228,7.002,6.518,7.81,6.019L4.925,1.343c0.82-0.505,1.7-0.901,2.617-1.176L9.12,5.435c0.895-0.269,1.868-0.317,2.842-0.087L13.229,0c0.914,0.217,1.815,0.554,2.682,1.021L13.3,5.863c0.862,0.464,1.573,1.139,2.071,1.948l4.676-2.885c0.505,0.82,0.901,1.7,1.176,2.617L15.955,9.12c0.181,0.602,0.246,1.241,0.209,1.891c0.004-0.001,0.007-0.002,0.011-0.003c-0.002,0.028-0.008,0.055-0.01,0.084c-0.002,0.023,0.003,0.044,0.001,0.067c-0.003,0.031-0.002,0.064-0.006,0.095c-0.01,0.094-0.032,0.188-0.047,0.282c-0.008,0.051-0.016,0.103-0.026,0.153c-0.012,0.061-0.017,0.123-0.031,0.184c-0.011,0.048-0.018,0.096-0.03,0.143l-0.016,0.003c-0.116,0.458-0.283,0.895-0.507,1.298c-0.468,0.247-0.88,0.602-1.193,1.048l-1.112,1.58l-1.617-1.057c-0.426-0.279-0.919-0.426-1.426-0.426c-1.442,0-2.615,1.173-2.615,2.615c0,0.089,0.008,0.194,0.023,0.321l0.151,1.237l-1.044,0.681C6.25,19.589,6,20.046,6,20.538C6,21.344,6.656,22,7.462,22H14h6.538C21.344,22,22,21.344,22,20.538c0-0.51-0.27-0.975-0.721-1.245l-1.264-0.756l0.346-1.432c0.068-0.279,0.1-0.54,0.1-0.798c0-1.613-1.136-2.962-2.649-3.299c0.209-0.624,0.33-1.286,0.364-1.972c2.446,0.508,4.285,2.674,4.285,5.271c0,0.438-0.058,0.861-0.157,1.269C23.316,18.181,24,19.275,24,20.538z" />' +
                '  </svg>' +
                '  <span class="buzzhome-forecast-Label">27°C</span>' +
                '  <span class="buzzhome-forecast-Label">12°C</span>' +
                '  </td>' +
                '  <td style="background-color:rgba(165, 124, 52, 0.15);">' +
                '  <span class="buzzhome-forecast-Label">Thur</span>' +
                '  <svg id="buzzhome-forecast-icon4" viewBox="0 0 26 26">' +
                '<path d="M24,20.538C24,22.45,22.45,24,20.538,24H14H7.462C5.55,24,4,22.45,4,20.538c0-1.215,0.629-2.28,1.576-2.898c-0.023-0.185-0.038-0.373-0.038-0.564c0-1.07,0.379-2.042,0.989-2.824C6.343,14.04,6.167,13.82,6.019,13.58l-4.676,2.885c-0.505-0.82-0.901-1.7-1.176-2.617l5.269-1.578c-0.269-0.895-0.317-1.868-0.087-2.842L0,8.162C0.217,7.248,0.554,6.346,1.021,5.48l4.842,2.61C6.327,7.228,7.002,6.518,7.81,6.019L4.925,1.343c0.82-0.505,1.7-0.901,2.617-1.176L9.12,5.435c0.895-0.269,1.868-0.317,2.842-0.087L13.229,0c0.914,0.217,1.815,0.554,2.682,1.021L13.3,5.863c0.862,0.464,1.573,1.139,2.071,1.948l4.676-2.885c0.505,0.82,0.901,1.7,1.176,2.617L15.955,9.12c0.181,0.602,0.246,1.241,0.209,1.891c0.004-0.001,0.007-0.002,0.011-0.003c-0.002,0.028-0.008,0.055-0.01,0.084c-0.002,0.023,0.003,0.044,0.001,0.067c-0.003,0.031-0.002,0.064-0.006,0.095c-0.01,0.094-0.032,0.188-0.047,0.282c-0.008,0.051-0.016,0.103-0.026,0.153c-0.012,0.061-0.017,0.123-0.031,0.184c-0.011,0.048-0.018,0.096-0.03,0.143l-0.016,0.003c-0.116,0.458-0.283,0.895-0.507,1.298c-0.468,0.247-0.88,0.602-1.193,1.048l-1.112,1.58l-1.617-1.057c-0.426-0.279-0.919-0.426-1.426-0.426c-1.442,0-2.615,1.173-2.615,2.615c0,0.089,0.008,0.194,0.023,0.321l0.151,1.237l-1.044,0.681C6.25,19.589,6,20.046,6,20.538C6,21.344,6.656,22,7.462,22H14h6.538C21.344,22,22,21.344,22,20.538c0-0.51-0.27-0.975-0.721-1.245l-1.264-0.756l0.346-1.432c0.068-0.279,0.1-0.54,0.1-0.798c0-1.613-1.136-2.962-2.649-3.299c0.209-0.624,0.33-1.286,0.364-1.972c2.446,0.508,4.285,2.674,4.285,5.271c0,0.438-0.058,0.861-0.157,1.269C23.316,18.181,24,19.275,24,20.538z" />' +
                '   </svg>' +
                '   <span class="buzzhome-forecast-Label">27°C</span>' +
                '   <span class="buzzhome-forecast-Label">12°C</span>' +
                '  </td>' +
                ' </tr >' +
                ' </table >' +

                ' </div >';


            container.append($TitleHtml + $TableHtml + $ForecastContainerHtml);

        },

        setIconPath: function (iconKey) {



            var iconPath;

            switch (iconKey) {
                case "chanceflurries": //done
                    iconPath = "M15,16l-1.061-1.939L12,13l1.939-1.061L15,10l1.061,1.939L18,13l-1.939,1.061L15,16z M14,16l-1.061,1.939L11,19l1.939,1.061L14,22l1.061-1.939L17,19l-1.939-1.061L14,16z M23.796,8.649C23.925,8.12,24,7.569,24,7c0-3.866-3.134-7-7-7c-2.367,0-4.456,1.178-5.723,2.977C10.334,2.361,9.21,2,8,2C4.686,2,2,4.686,2,8c0,0.249,0.02,0.492,0.049,0.733C0.818,9.536,0,10.92,0,12.5C0,14.985,2.015,17,4.5,17h6.733l1.084-2H4.5C3.122,15,2,13.878,2,12.5c0-0.844,0.427-1.625,1.142-2.091l1.044-0.681L4.034,8.491C4.011,8.298,4,8.142,4,8c0-2.206,1.794-4,4-4c0.776,0,1.531,0.225,2.182,0.651L11.8,5.709l1.112-1.58C13.851,2.796,15.379,2,17,2c2.757,0,5,2.243,5,5c0,0.383-0.048,0.769-0.147,1.179L21.506,9.61l1.264,0.756C23.54,10.826,24,11.624,24,12.5c0,1.378-1.122,2.5-2.5,2.5h-0.446l-0.035-0.019l-1.061-1.939l-1.061,1.939l-1.939,1.061l1.939,1.061l1.061,1.939l1.061-1.939L21.206,17H21.5c2.485,0,4.5-2.015,4.5-4.5C26,10.857,25.111,9.435,23.796,8.649z";
                    break;
                case "chancerain": //done
                    iconPath = "M26,12.5c0,2.485-2.015,4.5-4.5,4.5h-2.086l-2.707,2.707l-1.414-1.414l7-7l1.414,1.414L21.414,15H21.5c1.378,0,2.5-1.122,2.5-2.5c0-0.876-0.46-1.674-1.23-2.134l-0.452-0.27l-2.611,2.611l-1.414-1.414l3.661-3.661C21.983,7.419,22,7.209,22,7c0-2.757-2.243-5-5-5c-1.621,0-3.149,0.796-4.088,2.129L11.8,5.709l-1.617-1.057C9.531,4.225,8.776,4,8,4C5.794,4,4,5.794,4,8c0,0.142,0.011,0.298,0.034,0.491l0.151,1.237l-1.044,0.681C2.427,10.875,2,11.656,2,12.5C2,13.878,3.122,15,4.5,15h8.086l3.707-3.707l1.414,1.414l-7,7l-1.414-1.414L10.586,17H4.5C2.015,17,0,14.985,0,12.5c0-1.58,0.818-2.964,2.049-3.767C2.02,8.492,2,8.249,2,8c0-3.314,2.686-6,6-6c1.21,0,2.334,0.361,3.277,0.977C12.544,1.178,14.633,0,17,0c3.866,0,7,3.134,7,7c0,0.569-0.075,1.12-0.204,1.649C25.111,9.435,26,10.857,26,12.5z";
                    break;
                case "chancesleet": //done
                    iconPath = "M26,12.5c0,2.485-2.015,4.5-4.5,4.5h-2.086L17,19.414V20h-2v-2h0.586l6.707-6.707l1.414,1.414L21.414,15H21.5c1.378,0,2.5-1.122,2.5-2.5c0-0.876-0.46-1.674-1.23-2.134l-0.452-0.27l-2.611,2.611l-1.414-1.414l3.661-3.661C21.983,7.419,22,7.209,22,7c0-2.757-2.243-5-5-5c-1.621,0-3.149,0.796-4.088,2.129L11.8,5.709l-1.617-1.057C9.531,4.225,8.776,4,8,4C5.794,4,4,5.794,4,8c0,0.142,0.011,0.298,0.034,0.491l0.151,1.237l-1.044,0.681C2.427,10.875,2,11.656,2,12.5C2,13.878,3.122,15,4.5,15h8.086l3.707-3.707l1.414,1.414L11,19.414V20H9v-2h0.586l1-1H4.5C2.015,17,0,14.985,0,12.5c0-1.58,0.818-2.964,2.049-3.767C2.02,8.492,2,8.249,2,8c0-3.314,2.686-6,6-6c1.21,0,2.334,0.361,3.277,0.977C12.544,1.178,14.633,0,17,0c3.866,0,7,3.134,7,7c0,0.569-0.075,1.12-0.204,1.649C25.111,9.435,26,10.857,26,12.5z M7,22h2v-2H7V22z M13,22h2v-2h-2V22z";
                    break;
                case "chancesnow": //done
                    iconPath = "M21.843,16.965L23,17.275l-0.518,1.932l-3.108-0.833l0.833,3.108L18.275,22l-0.833-3.108l-2.275,2.275l-1.414-1.414l2.275-2.275l-3.108-0.833l0.518-1.932l3.108,0.833l-0.833-3.108l1.932-0.518l0.833,3.108l2.275-2.275l1.414,1.414L21.334,15H21.5c1.378,0,2.5-1.122,2.5-2.5c0-0.876-0.46-1.674-1.23-2.134L21.506,9.61l0.346-1.431C21.952,7.769,22,7.383,22,7c0-2.757-2.243-5-5-5c-1.621,0-3.149,0.796-4.088,2.129L11.8,5.709l-1.617-1.057C9.531,4.225,8.776,4,8,4C5.794,4,4,5.794,4,8c0,0.142,0.011,0.298,0.034,0.491l0.151,1.237l-1.044,0.681C2.427,10.875,2,11.656,2,12.5C2,13.878,3.122,15,4.5,15h6.797l-0.536,2H4.5C2.015,17,0,14.985,0,12.5c0-1.58,0.818-2.964,2.049-3.767C2.02,8.492,2,8.249,2,8c0-3.314,2.686-6,6-6c1.21,0,2.334,0.361,3.277,0.977C12.544,1.178,14.633,0,17,0c3.866,0,7,3.134,7,7c0,0.569-0.075,1.12-0.204,1.649C25.111,9.435,26,10.857,26,12.5C26,14.868,24.165,16.787,21.843,16.965z";
                    break;
                case "chancetstorms": //done
                    iconPath = "M26,12.5c0,2.485-2.015,4.5-4.5,4.5h-3.385l-3,5l1.308-7.192h-3.269L19.038,5l-1.308,7.192H21L19.315,15H21.5c1.378,0,2.5-1.122,2.5-2.5c0-0.876-0.46-1.674-1.23-2.134L21.506,9.61l0.346-1.431C21.952,7.769,22,7.383,22,7c0-2.757-2.243-5-5-5c-1.621,0-3.149,0.796-4.088,2.129L11.8,5.709l-1.617-1.057C9.531,4.225,8.776,4,8,4C5.794,4,4,5.794,4,8c0,0.142,0.011,0.298,0.034,0.491l0.151,1.237l-1.044,0.681C2.427,10.875,2,11.656,2,12.5C2,13.878,3.122,15,4.5,15h6.298l-1.199,2H4.5C2.015,17,0,14.985,0,12.5c0-1.58,0.818-2.964,2.049-3.767C2.02,8.492,2,8.249,2,8c0-3.314,2.686-6,6-6c1.21,0,2.334,0.361,3.277,0.977C12.544,1.178,14.633,0,17,0c3.866,0,7,3.134,7,7c0,0.569-0.075,1.12-0.204,1.649C25.111,9.435,26,10.857,26,12.5z";
                    break;
                case "clear": //done
                    iconPath = "M17.795,13.537c-0.273,1.033-0.809,1.959-1.541,2.695l4.254,4.231c-0.742,0.745-1.576,1.39-2.479,1.915l-3.016-5.192c-0.881,0.513-1.902,0.813-2.995,0.815l0.016,6.002c-1.026,0.002-2.068-0.126-3.107-0.401l1.539-5.805c-1.033-0.273-1.959-0.809-2.695-1.541l-4.231,4.254c-0.745-0.742-1.39-1.576-1.915-2.479l5.192-3.016c-0.513-0.881-0.813-1.902-0.815-2.995L0,12.033c-0.002-1.026,0.126-2.068,0.401-3.107l5.805,1.539C6.48,9.432,7.016,8.505,7.747,7.77L3.494,3.539c0.742-0.745,1.576-1.39,2.479-1.915l3.016,5.192c0.881-0.513,1.902-0.813,2.995-0.815L11.968,0c1.026-0.002,2.068,0.126,3.107,0.401l-1.539,5.805c1.033,0.273,1.96,0.809,2.695,1.541l4.231-4.253c0.745,0.742,1.39,1.576,1.915,2.479l-5.192,3.016c0.513,0.881,0.813,1.903,0.815,2.995l6.002-0.016c0.002,1.026-0.126,2.068-0.401,3.107L17.795,13.537z";
                    break;
                case "cloudy": //done
                    iconPath = "M24.427,13.166c0.091-0.378,0.145-0.771,0.145-1.177c0-1.864-1.033-3.471-2.546-4.33c0.075-0.389,0.128-0.786,0.128-1.198C22.154,2.893,19.261,0,15.692,0c-2.185,0-4.114,1.088-5.283,2.748C9.539,2.18,8.502,1.846,7.385,1.846c-3.059,0-5.539,2.48-5.539,5.538c0,0.23,0.018,0.455,0.045,0.677C0.755,8.802,0,10.08,0,11.538c0,2.294,1.86,4.154,4.154,4.154h1.314c0.055-0.775,0.37-1.475,0.879-2H4.154C2.966,13.692,2,12.726,2,11.538c0-0.727,0.368-1.4,0.984-1.802l1.044-0.681L3.877,7.819C3.856,7.647,3.846,7.509,3.846,7.385c0-1.951,1.587-3.538,3.539-3.538c0.686,0,1.354,0.199,1.93,0.576l1.617,1.057l1.112-1.58C12.882,2.71,14.246,2,15.692,2c2.46,0,4.462,2.001,4.462,4.462c0,0.192-0.017,0.387-0.045,0.584c-0.178-0.019-0.351-0.054-0.533-0.054c-1.69,0-3.181,0.841-4.086,2.125c-0.673-0.44-1.475-0.698-2.339-0.698c-2.366,0-4.283,1.918-4.283,4.283c0,0.177,0.014,0.351,0.035,0.523c-0.879,0.573-1.463,1.561-1.463,2.689c0,1.774,1.438,3.212,3.212,3.212h6.068h6.068c1.774,0,3.212-1.438,3.212-3.212C26,14.743,25.365,13.727,24.427,13.166z";
                    break;
                case "flurries": //done
                    iconPath = "M10.939,15.061L9,14l1.939-1.061L12,11l1.061,1.939L15,14l-1.939,1.061L12,17L10.939,15.061z M9.061,17.939L8,16l-1.061,1.939L5,19l1.939,1.061L8,22l1.061-1.939L11,19L9.061,17.939z M14,18l-1.061,1.939L11,21l1.939,1.061L14,24l1.061-1.939L17,21l-1.939-1.061L14,18z M24,11.538c0-1.516-0.821-2.829-2.034-3.554c0.118-0.489,0.188-0.997,0.188-1.522C22.154,2.893,19.261,0,15.692,0c-2.185,0-4.114,1.088-5.283,2.748C9.539,2.18,8.502,1.846,7.385,1.846c-3.059,0-5.539,2.48-5.539,5.538c0,0.23,0.018,0.455,0.045,0.677C0.755,8.802,0,10.08,0,11.538c0,2.294,1.86,4.154,4.154,4.154h0.678L5,16l1.061-1.939L8,13l-1.939-1.061L5,10l-1.061,1.939l-1.539,0.842C2.15,12.429,2,12.002,2,11.538c0-0.727,0.368-1.4,0.984-1.802l1.044-0.681L3.877,7.819C3.856,7.647,3.846,7.509,3.846,7.385c0-1.951,1.587-3.538,3.539-3.538c0.686,0,1.354,0.199,1.93,0.576l1.617,1.057l1.112-1.58C12.882,2.71,14.246,2,15.692,2c2.46,0,4.462,2.001,4.462,4.462c0,0.342-0.043,0.686-0.132,1.052l-0.346,1.431l1.264,0.756c0.664,0.397,1.06,1.084,1.06,1.838c0,1.188-0.966,2.154-2.154,2.154h-1.468L18,13l-1.061,1.939L15,16l1.939,1.061L18,19l1.061-1.939L21,16l-0.655-0.358C22.401,15.393,24,13.662,24,11.538z";
                    break;
                case "fog": //done
                    iconPath = "M11.877,11l8-2h-3.754l-12,3H7h0.877H12h6h6v3l-5.667,2h-3.005l5.667-2h-2.491l-8.5,3H12h0.495H15.5H20h1v3H7v-3l8.5-3H0v-3l12-3H0V6l8.5-3H3V0h14v3l-5.667,2H8.329l5.667-2h-2.491l-8.5,3H5h0.495H8.5H13h11v3l-8,2H11.877z";
                    break;
                case "hazy": //done
                    iconPath = "M11.877,11l8-2h-3.754l-12,3H7h0.877H12h6h6v3l-5.667,2h-3.005l5.667-2h-2.491l-8.5,3H12h0.495H15.5H20h1v3H7v-3l8.5-3H0v-3l12-3H0V6l8.5-3H3V0h14v3l-5.667,2H8.329l5.667-2h-2.491l-8.5,3H5h0.495H8.5H13h11v3l-8,2H11.877z";
                    break;
                case "mostlycloudy": //done
                    iconPath = "M24,18.846C24,21.14,22.14,23,19.846,23H12H4.154C1.86,23,0,21.14,0,18.846c0-1.458,0.755-2.736,1.892-3.477c-0.027-0.222-0.045-0.447-0.045-0.677c0-2.044,1.11-3.824,2.757-4.784c-0.015-0.07-0.036-0.137-0.047-0.209l-4.446,0.699C-0.01,9.638-0.034,8.851,0.051,8.05L4.53,8.525C4.614,7.728,4.905,6.98,5.363,6.351L1.726,3.703C2.191,3.066,2.734,2.492,3.344,2l2.83,3.503c0.595-0.481,1.317-0.82,2.127-0.948l-0.7-4.446C8.058,0.037,8.525,0,8.998,0C9.313,0,9.63,0.016,9.95,0.05L9.475,4.529c0.797,0.084,1.545,0.375,2.174,0.833l2.648-3.637C14.934,2.19,15.507,2.734,16,3.343L12.564,6.12c-0.682,0.28-1.314,0.652-1.891,1.094C10.234,6.803,9.648,6.547,9,6.547C7.645,6.547,6.547,7.645,6.547,9c0,0.076,0.024,0.145,0.031,0.219C6.842,9.18,7.11,9.153,7.385,9.153c1.117,0,2.155,0.333,3.025,0.902c1.169-1.661,3.098-2.748,5.283-2.748c3.569,0,6.462,2.893,6.462,6.462c0,0.525-0.07,1.033-0.188,1.522C23.179,16.017,24,17.33,24,18.846z";
                    break;
                case "mostlysunny": //done
                    iconPath = "M24,20.538C24,22.45,22.45,24,20.538,24H14H7.462C5.55,24,4,22.45,4,20.538c0-1.215,0.629-2.28,1.576-2.898c-0.023-0.185-0.038-0.373-0.038-0.564c0-1.07,0.379-2.042,0.989-2.824C6.343,14.04,6.167,13.82,6.019,13.58l-4.676,2.885c-0.505-0.82-0.901-1.7-1.176-2.617l5.269-1.578c-0.269-0.895-0.317-1.868-0.087-2.842L0,8.162C0.217,7.248,0.554,6.346,1.021,5.48l4.842,2.61C6.327,7.228,7.002,6.518,7.81,6.019L4.925,1.343c0.82-0.505,1.7-0.901,2.617-1.176L9.12,5.435c0.895-0.269,1.868-0.317,2.842-0.087L13.229,0c0.914,0.217,1.815,0.554,2.682,1.021L13.3,5.863c0.862,0.464,1.573,1.139,2.071,1.948l4.676-2.885c0.505,0.82,0.901,1.7,1.176,2.617L15.955,9.12c0.181,0.602,0.246,1.241,0.209,1.891c0.004-0.001,0.007-0.002,0.011-0.003c-0.002,0.028-0.008,0.055-0.01,0.084c-0.002,0.023,0.003,0.044,0.001,0.067c-0.003,0.031-0.002,0.064-0.006,0.095c-0.01,0.094-0.032,0.188-0.047,0.282c-0.008,0.051-0.016,0.103-0.026,0.153c-0.012,0.061-0.017,0.123-0.031,0.184c-0.011,0.048-0.018,0.096-0.03,0.143l-0.016,0.003c-0.116,0.458-0.283,0.895-0.507,1.298c-0.468,0.247-0.88,0.602-1.193,1.048l-1.112,1.58l-1.617-1.057c-0.426-0.279-0.919-0.426-1.426-0.426c-1.442,0-2.615,1.173-2.615,2.615c0,0.089,0.008,0.194,0.023,0.321l0.151,1.237l-1.044,0.681C6.25,19.589,6,20.046,6,20.538C6,21.344,6.656,22,7.462,22H14h6.538C21.344,22,22,21.344,22,20.538c0-0.51-0.27-0.975-0.721-1.245l-1.264-0.756l0.346-1.432c0.068-0.279,0.1-0.54,0.1-0.798c0-1.613-1.136-2.962-2.649-3.299c0.209-0.624,0.33-1.286,0.364-1.972c2.446,0.508,4.285,2.674,4.285,5.271c0,0.438-0.058,0.861-0.157,1.269C23.316,18.181,24,19.275,24,20.538z";
                    break;
                case "partlycloudy": //done
                    iconPath = "M24,20.538C24,22.45,22.45,24,20.538,24H14H7.462C5.55,24,4,22.45,4,20.538c0-1.215,0.629-2.28,1.576-2.898c-0.023-0.185-0.038-0.373-0.038-0.564c0-1.07,0.379-2.042,0.989-2.824C6.343,14.04,6.167,13.82,6.019,13.58l-4.676,2.885c-0.505-0.82-0.901-1.7-1.176-2.617l5.269-1.578c-0.269-0.895-0.317-1.868-0.087-2.842L0,8.162C0.217,7.248,0.554,6.346,1.021,5.48l4.842,2.61C6.327,7.228,7.002,6.518,7.81,6.019L4.925,1.343c0.82-0.505,1.7-0.901,2.617-1.176L9.12,5.435c0.895-0.269,1.868-0.317,2.842-0.087L13.229,0c0.914,0.217,1.815,0.554,2.682,1.021L13.3,5.863c0.862,0.464,1.573,1.139,2.071,1.948l4.676-2.885c0.505,0.82,0.901,1.7,1.176,2.617L15.955,9.12c0.181,0.602,0.246,1.241,0.209,1.891c0.004-0.001,0.007-0.002,0.011-0.003c-0.002,0.028-0.008,0.055-0.01,0.084c-0.002,0.023,0.003,0.044,0.001,0.067c-0.003,0.031-0.002,0.064-0.006,0.095c-0.01,0.094-0.032,0.188-0.047,0.282c-0.008,0.051-0.016,0.103-0.026,0.153c-0.012,0.061-0.017,0.123-0.031,0.184c-0.011,0.048-0.018,0.096-0.03,0.143l-0.016,0.003c-0.116,0.458-0.283,0.895-0.507,1.298c-0.468,0.247-0.88,0.602-1.193,1.048l-1.112,1.58l-1.617-1.057c-0.426-0.279-0.919-0.426-1.426-0.426c-1.442,0-2.615,1.173-2.615,2.615c0,0.089,0.008,0.194,0.023,0.321l0.151,1.237l-1.044,0.681C6.25,19.589,6,20.046,6,20.538C6,21.344,6.656,22,7.462,22H14h6.538C21.344,22,22,21.344,22,20.538c0-0.51-0.27-0.975-0.721-1.245l-1.264-0.756l0.346-1.432c0.068-0.279,0.1-0.54,0.1-0.798c0-1.613-1.136-2.962-2.649-3.299c0.209-0.624,0.33-1.286,0.364-1.972c2.446,0.508,4.285,2.674,4.285,5.271c0,0.438-0.058,0.861-0.157,1.269C23.316,18.181,24,19.275,24,20.538z";
                    break;
                case "partlysunny": //done
                    iconPath = "M24,18.846C24,21.14,22.14,23,19.846,23H12H4.154C1.86,23,0,21.14,0,18.846c0-1.458,0.755-2.736,1.892-3.477c-0.027-0.222-0.045-0.447-0.045-0.677c0-2.044,1.11-3.824,2.757-4.784c-0.015-0.07-0.036-0.137-0.047-0.209l-4.446,0.699C-0.01,9.638-0.034,8.851,0.051,8.05L4.53,8.525C4.614,7.728,4.905,6.98,5.363,6.351L1.726,3.703C2.191,3.066,2.734,2.492,3.344,2l2.83,3.503c0.595-0.481,1.317-0.82,2.127-0.948l-0.7-4.446C8.058,0.037,8.525,0,8.998,0C9.313,0,9.63,0.016,9.95,0.05L9.475,4.529c0.797,0.084,1.545,0.375,2.174,0.833l2.648-3.637C14.934,2.19,15.507,2.734,16,3.343L12.564,6.12c-0.682,0.28-1.314,0.652-1.891,1.094C10.234,6.803,9.648,6.547,9,6.547C7.645,6.547,6.547,7.645,6.547,9c0,0.076,0.024,0.145,0.031,0.219C6.842,9.18,7.11,9.153,7.385,9.153c1.117,0,2.155,0.333,3.025,0.902c1.169-1.661,3.098-2.748,5.283-2.748c3.569,0,6.462,2.893,6.462,6.462c0,0.525-0.07,1.033-0.188,1.522C23.179,16.017,24,17.33,24,18.846z";
                    break;
                case "rain":
                    iconPath = "M26,15.915c0,1.774-1.438,3.212-3.212,3.212H16.72h-6.068c-1.774,0-3.212-1.438-3.212-3.212c0-1.128,0.584-2.116,1.463-2.689c-0.021-0.172-0.035-0.346-0.035-0.523c0-2.366,1.918-4.283,4.283-4.283c0.864,0,1.666,0.258,2.339,0.698c0.904-1.284,2.396-2.125,4.086-2.125c0.183,0,0.356,0.035,0.533,0.054c0.028-0.197,0.045-0.392,0.045-0.584c0-2.46-2.001-4.462-4.462-4.462c-1.446,0-2.81,0.71-3.648,1.9l-1.112,1.58L9.315,4.422c-0.577-0.377-1.244-0.576-1.93-0.576c-1.951,0-3.539,1.587-3.539,3.538c0,0.125,0.01,0.263,0.031,0.434l0.151,1.237L2.984,9.737C2.368,10.138,2,10.812,2,11.538c0,1.188,0.966,2.154,2.154,2.154h2.194c-0.509,0.525-0.824,1.225-0.879,2H4.154C1.86,15.692,0,13.833,0,11.538c0-1.458,0.755-2.736,1.892-3.477C1.864,7.839,1.846,7.614,1.846,7.385c0-3.059,2.48-5.538,5.539-5.538c1.117,0,2.155,0.333,3.025,0.902C11.579,1.088,13.507,0,15.692,0c3.569,0,6.462,2.893,6.462,6.462c0,0.411-0.052,0.808-0.128,1.198c1.513,0.859,2.546,2.466,2.546,4.33c0,0.406-0.054,0.799-0.145,1.177C25.365,13.727,26,14.743,26,15.915z";
                    break;
                case "sleet":
                    iconPath = "M26,15.915c0,1.774-1.438,3.212-3.212,3.212H16.72h-6.068c-1.774,0-3.212-1.438-3.212-3.212c0-1.128,0.584-2.116,1.463-2.689c-0.021-0.172-0.035-0.346-0.035-0.523c0-2.366,1.918-4.283,4.283-4.283c0.864,0,1.666,0.258,2.339,0.698c0.904-1.284,2.396-2.125,4.086-2.125c0.183,0,0.356,0.035,0.533,0.054c0.028-0.197,0.045-0.392,0.045-0.584c0-2.46-2.001-4.462-4.462-4.462c-1.446,0-2.81,0.71-3.648,1.9l-1.112,1.58L9.315,4.422c-0.577-0.377-1.244-0.576-1.93-0.576c-1.951,0-3.539,1.587-3.539,3.538c0,0.125,0.01,0.263,0.031,0.434l0.151,1.237L2.984,9.737C2.368,10.138,2,10.812,2,11.538c0,1.188,0.966,2.154,2.154,2.154h2.194c-0.509,0.525-0.824,1.225-0.879,2H4.154C1.86,15.692,0,13.833,0,11.538c0-1.458,0.755-2.736,1.892-3.477C1.864,7.839,1.846,7.614,1.846,7.385c0-3.059,2.48-5.538,5.539-5.538c1.117,0,2.155,0.333,3.025,0.902C11.579,1.088,13.507,0,15.692,0c3.569,0,6.462,2.893,6.462,6.462c0,0.411-0.052,0.808-0.128,1.198c1.513,0.859,2.546,2.466,2.546,4.33c0,0.406-0.054,0.799-0.145,1.177C25.365,13.727,26,14.743,26,15.915z";
                    break;
                case "snow":
                    iconPath = "M26,15.915c0,1.774-1.438,3.212-3.212,3.212H16.72h-6.068c-1.774,0-3.212-1.438-3.212-3.212c0-1.128,0.584-2.116,1.463-2.689c-0.021-0.172-0.035-0.346-0.035-0.523c0-2.366,1.918-4.283,4.283-4.283c0.864,0,1.666,0.258,2.339,0.698c0.904-1.284,2.396-2.125,4.086-2.125c0.183,0,0.356,0.035,0.533,0.054c0.028-0.197,0.045-0.392,0.045-0.584c0-2.46-2.001-4.462-4.462-4.462c-1.446,0-2.81,0.71-3.648,1.9l-1.112,1.58L9.315,4.422c-0.577-0.377-1.244-0.576-1.93-0.576c-1.951,0-3.539,1.587-3.539,3.538c0,0.125,0.01,0.263,0.031,0.434l0.151,1.237L2.984,9.737C2.368,10.138,2,10.812,2,11.538c0,1.188,0.966,2.154,2.154,2.154h2.194c-0.509,0.525-0.824,1.225-0.879,2H4.154C1.86,15.692,0,13.833,0,11.538c0-1.458,0.755-2.736,1.892-3.477C1.864,7.839,1.846,7.614,1.846,7.385c0-3.059,2.48-5.538,5.539-5.538c1.117,0,2.155,0.333,3.025,0.902C11.579,1.088,13.507,0,15.692,0c3.569,0,6.462,2.893,6.462,6.462c0,0.411-0.052,0.808-0.128,1.198c1.513,0.859,2.546,2.466,2.546,4.33c0,0.406-0.054,0.799-0.145,1.177C25.365,13.727,26,14.743,26,15.915z";
                    break;
                case "sunny": //done
                    iconPath = "M17.795,13.537c-0.273,1.033-0.809,1.959-1.541,2.695l4.254,4.231c-0.742,0.745-1.576,1.39-2.479,1.915l-3.016-5.192c-0.881,0.513-1.902,0.813-2.995,0.815l0.016,6.002c-1.026,0.002-2.068-0.126-3.107-0.401l1.539-5.805c-1.033-0.273-1.959-0.809-2.695-1.541l-4.231,4.254c-0.745-0.742-1.39-1.576-1.915-2.479l5.192-3.016c-0.513-0.881-0.813-1.902-0.815-2.995L0,12.033c-0.002-1.026,0.126-2.068,0.401-3.107l5.805,1.539C6.48,9.432,7.016,8.505,7.747,7.77L3.494,3.539c0.742-0.745,1.576-1.39,2.479-1.915l3.016,5.192c0.881-0.513,1.902-0.813,2.995-0.815L11.968,0c1.026-0.002,2.068,0.126,3.107,0.401l-1.539,5.805c1.033,0.273,1.96,0.809,2.695,1.541l4.231-4.253c0.745,0.742,1.39,1.576,1.915,2.479l-5.192,3.016c0.513,0.881,0.813,1.903,0.815,2.995l6.002-0.016c0.002,1.026-0.126,2.068-0.401,3.107L17.795,13.537z";
                    break;
                case "tstorms":
                    iconPath = "M26,15.915c0,1.774-1.438,3.212-3.212,3.212H16.72h-6.068c-1.774,0-3.212-1.438-3.212-3.212c0-1.128,0.584-2.116,1.463-2.689c-0.021-0.172-0.035-0.346-0.035-0.523c0-2.366,1.918-4.283,4.283-4.283c0.864,0,1.666,0.258,2.339,0.698c0.904-1.284,2.396-2.125,4.086-2.125c0.183,0,0.356,0.035,0.533,0.054c0.028-0.197,0.045-0.392,0.045-0.584c0-2.46-2.001-4.462-4.462-4.462c-1.446,0-2.81,0.71-3.648,1.9l-1.112,1.58L9.315,4.422c-0.577-0.377-1.244-0.576-1.93-0.576c-1.951,0-3.539,1.587-3.539,3.538c0,0.125,0.01,0.263,0.031,0.434l0.151,1.237L2.984,9.737C2.368,10.138,2,10.812,2,11.538c0,1.188,0.966,2.154,2.154,2.154h2.194c-0.509,0.525-0.824,1.225-0.879,2H4.154C1.86,15.692,0,13.833,0,11.538c0-1.458,0.755-2.736,1.892-3.477C1.864,7.839,1.846,7.614,1.846,7.385c0-3.059,2.48-5.538,5.539-5.538c1.117,0,2.155,0.333,3.025,0.902C11.579,1.088,13.507,0,15.692,0c3.569,0,6.462,2.893,6.462,6.462c0,0.411-0.052,0.808-0.128,1.198c1.513,0.859,2.546,2.466,2.546,4.33c0,0.406-0.054,0.799-0.145,1.177C25.365,13.727,26,14.743,26,15.915z";
                    break;

                default:
                    iconPath = "M26,15.915c0,1.774-1.438,3.212-3.212,3.212H16.72h-6.068c-1.774,0-3.212-1.438-3.212-3.212c0-1.128,0.584-2.116,1.463-2.689c-0.021-0.172-0.035-0.346-0.035-0.523c0-2.366,1.918-4.283,4.283-4.283c0.864,0,1.666,0.258,2.339,0.698c0.904-1.284,2.396-2.125,4.086-2.125c0.183,0,0.356,0.035,0.533,0.054c0.028-0.197,0.045-0.392,0.045-0.584c0-2.46-2.001-4.462-4.462-4.462c-1.446,0-2.81,0.71-3.648,1.9l-1.112,1.58L9.315,4.422c-0.577-0.377-1.244-0.576-1.93-0.576c-1.951,0-3.539,1.587-3.539,3.538c0,0.125,0.01,0.263,0.031,0.434l0.151,1.237L2.984,9.737C2.368,10.138,2,10.812,2,11.538c0,1.188,0.966,2.154,2.154,2.154h2.194c-0.509,0.525-0.824,1.225-0.879,2H4.154C1.86,15.692,0,13.833,0,11.538c0-1.458,0.755-2.736,1.892-3.477C1.864,7.839,1.846,7.614,1.846,7.385c0-3.059,2.48-5.538,5.539-5.538c1.117,0,2.155,0.333,3.025,0.902C11.579,1.088,13.507,0,15.692,0c3.569,0,6.462,2.893,6.462,6.462c0,0.411-0.052,0.808-0.128,1.198c1.513,0.859,2.546,2.466,2.546,4.33c0,0.406-0.054,0.799-0.145,1.177C25.365,13.727,26,14.743,26,15.915z";
            }

            return iconPath;



        }

    }




}




//button1: {

//    init: function (wid, view, data, style, wType) {

//        $( "div" ).html( "<p>All new content. <em>You bet!</em></p>" );

//            //vis.binds.hqwidgets.showVersion();
//            //var $div = $('#' + wid).addClass('vis-hq-button-base');
//            //if (!$div.length) {
//            //    setTimeout(function () {
//            //        vis.binds.hqwidgets.button.init(wid, view, data, style, wType);
//            //    }, 100);
//            //    return;
//            //}
//            //var _data = {wid: wid, view: view, wType: wType};
//            //for (var a in data) {
//            //    if (!data.hasOwnProperty(a) || typeof data[a] == 'function') continue;
//            //    if (a[0] != '_') {
//            //        _data[a] = data[a];
//            //    }
//            //}
//            //data = _data;

//            //if (!data.wType) {
//            //    if (data.min === undefined || data.min === null || data.min === '') data.min = false;
//            //    if (data.max === undefined || data.max === null || data.max === '') data.max = true;
//            //}

//            //data.styleNormal    = data.usejQueryStyle ? 'ui-state-default' : (data.styleNormal || 'vis-hq-button-base-normal');
//            //data.styleActive    = data.usejQueryStyle ? 'ui-state-active'  : (data.styleActive || 'vis-hq-button-base-on');
//            //data.digits         = (data.digits || data.digits === 0) ? parseInt(data.digits, 10) : null;
//            //if (typeof data.step == 'string') data.step = data.step.replace(',', '.');
//            //data.step           = parseFloat(data.step || 1);
//            //data.is_comma       = (data.is_comma === 'true' || data.is_comma === true);
//            //data.readOnly       = (data.readOnly === 'true' || data.readOnly === true);
//            //data.midTextColor   = data.midTextColor || '';
//            //data.infoColor      = data.infoColor || '';
//            //data.infoBackground = data.infoBackground || 'rgba(182,182,182,0.6)';
//            //data.pushButton     = (data.pushButton === 'true' || data.pushButton === true);

//            //if (data.wType == 'number') {
//            //    data.min = (data.min === 'true' || data.min === true) ? true : ((data.min === 'false' || data.min === false) ? false : ((data.min !== undefined) ? parseFloat(data.min) : 0));
//            //    data.max = (data.max === 'true' || data.max === true) ? true : ((data.max === 'false' || data.max === false) ? false : ((data.max !== undefined) ? parseFloat(data.max) : 100));
//            //} else {
//            //    data.min = (data.min === 'true' || data.min === true) ? true : ((data.min === 'false' || data.min === false) ? false : ((data.min !== undefined && data.min !== null && data.min !== '') ? data.min : 0));
//            //    data.max = (data.max === 'true' || data.max === true) ? true : ((data.max === 'false' || data.max === false) ? false : ((data.max !== undefined && data.max !== null && data.max !== '') ? data.max : 100));
//            //}
//            //$div.data('data',  data);
//            //$div.data('style', style);

//            //if (data.oid) {
//            //    data.value = vis.states.attr(data.oid + '.val');
//            //    data.ack   = vis.states.attr(data.oid + '.ack');
//            //    data.lc    = vis.states.attr(data.oid + '.lc');
//            //}

//            //if (data['oid-working'])  data.working  = vis.states.attr(data['oid-working']  + '.val');
//            //if (data['oid-battery'])  data.battery  = vis.states.attr(data['oid-battery']  + '.val');
//            //if (data['oid-signal'])   data.signal   = vis.states.attr(data['oid-signal']   + '.val');
//            //if (data['oid-humidity']) data.humidity = vis.states.attr(data['oid-humidity'] + '.val');
//            //if (data['oid-actual'])   data.actual   = vis.states.attr(data['oid-actual']   + '.val');
//            //if (data['oid-drive'])    data.drive    = vis.states.attr(data['oid-drive']    + '.val');

//            //vis.binds.hqwidgets.button.draw($div);
//        }
//}