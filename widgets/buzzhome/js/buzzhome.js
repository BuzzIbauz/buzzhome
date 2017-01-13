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

                for (var i = 0 ; i < len; i++) {
                    smallValues.eq(i).css("color", "#FFFFFF");

                }

            }

            else {

                Title.css("color", PrimaryColor);

                $("#buzzhome-chosenBorder").css("backgroundColor", PrimaryColor);

                Root.css("backgroundColor", "#FFFFFF");

                Root.css("boxShadow", "0px 0px 20px" + PrimaryColor);

                $("#buzzhome-ChosenSVG").attr("fill", Color2);

                $("#buzzhome-chosenValue").css("color", vis.binds.buzzhome.wandthermostat.setForegroundColor(PrimaryColor));

                $("#buzzhome-slider .ui-slider-range").css("backgroundImage", "linear-gradient(" + Color2 + " 0%," + PrimaryColor + " 15%)");

                TemperatureValue.css("color", PrimaryColor);

                SetTemperature.css("color", PrimaryColor);

                for (var i = 0 ; i < len; i++) {
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

            var $TableHtml = '<table class="buzzhome-table" width="100%" height="90%">' +
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