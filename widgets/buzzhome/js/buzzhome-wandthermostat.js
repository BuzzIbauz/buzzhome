  
  vis.binds.buzzhome.wandthermostat= {
  
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
                    $('#' + wid + 'buzzhome-SetTemperature').html(data.value + '&ordm;C');
                    $("#" +  wid + "slider").slider('value', data.value)

                });
            }

            if (data['oid-humidity']) {
                vis.states.bind(data['oid-humidity'] + '.val', function (e, newVal, oldVal) {
                    data.humidity = newVal;
                    $('#' + wid + '>humidity-value').html(data.humidity);
                    //console.log("value oid-humidity changed - old: " + oldVal + " newValue: "+ newVal);
                });
            }

            if (data['oid-actual']) {
                vis.states.bind(data['oid-actual'] + '.val', function (e, newVal, oldVal) {
                    data.actual = newVal;
                    $('#' + wid + '>buzzhome-TemperatureValue').html(Math.round(data.actual));
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
                    vis.binds.buzzhome.wandthermostat.updateBatteryStatus(data.battery, wid);
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
            var SliderContainerId = wid + "slider";
            var SliderChoosenPosition = wid + "buzzhome-chosen";
            var SliderChoosenValue = wid + "buzzhome-chosenValue";
            var SetTemperatureContainer = wid + "buzzhome-SetTemperature";
            var BatteryIndicatorContainer = wid + "buzzhome-BatteryIndicator";





            //HTML Zeichnen
            vis.binds.buzzhome.wandthermostat.draw($div, $Title, $Actual, $Value, $Humidity, SliderContainerId, SliderChoosenPosition, SliderChoosenValue, SetTemperatureContainer, BatteryIndicatorContainer);

            //Farben zuweisen
            vis.binds.buzzhome.wandthermostat.setHighlightColor($PrimaryColor, $invertColors, wid, SliderContainerId);
            //console.log($invertColors);

            // create slider
            vis.binds.buzzhome.wandthermostat.createSlider($Value, data.oid, SliderContainerId, SliderChoosenPosition, SliderChoosenValue);

            // update BatteryIndicator
            vis.binds.buzzhome.wandthermostat.updateBatteryStatus(data.battery, wid);

            // update WindowState
            vis.binds.buzzhome.wandthermostat.updateWindowStatus(data.windowstate);

            // update Mode
            vis.binds.buzzhome.wandthermostat.updateModeStatus(data.mode);


        },

        createSlider: function (slideAmount, dataoid, SliderContainerId, SliderChoosenPosition, SliderChoosenValue) {

            // var chosenPosition = $('#buzzhome-chosen');
            // var display = $('#buzzhome-chosenValue');



            $("#" + SliderContainerId).slider({
                min: 12,
                max: 30,
                animate: "slow",
                range: "min",
                value: slideAmount,

                slide: function (event, ui) {
                    $("#" + SliderChoosenPosition).css("opacity", "1");

                    $('#' + SliderContainerId +' .ui-slider-handle').html($("#" + SliderChoosenPosition)); //attach chosenPosition to sliderhandle

                    $("#" + SliderChoosenValue).html(ui.value);
                },
                stop: function (event, ui) {
                    $("#" + SliderChoosenPosition).css("opacity", "0");
                    vis.setValue(dataoid, ui.value);
                    console.log(dataoid + "value:" + ui.value);
                }
            });

        },

        setHighlightColor: function (PrimaryColor, invertColors, wid, SliderContainerId) {

            var Color1 = PrimaryColor;
            var Color2 = vis.binds.buzzhome.colorFunctions.ColorLuminance(PrimaryColor, -0.3);
            var BoxshadowColor = vis.binds.buzzhome.colorFunctions.getDropshadowColor(PrimaryColor, 0.2)


            var Root = $("#" + wid);
            var Title = $("#buzzhome-Title");
            var TemperatureValue = $("#buzzhome-TemperatureValue");
            var SetTemperature = $("#buzzhome-SetTemperature");
            var smallValues = $(".buzzhome-ValueSmall");
            var len = smallValues.length;


            if (invertColors == true) {

                Root.css("backgroundColor", PrimaryColor);

                // Root.style.boxShadow = "0px 0px 15px transparent";

                // Root.css("box-shadow", "0px 0px 20px transparent");

                Title.css("color", "#FFFFFF");

                TemperatureValue.css("color", "#FFFFFF");

                SetTemperature.css("color", "#FFFFFF");

                $("#"+wid+"buzzhome-chosenValue").css("color", vis.binds.buzzhome.colorFunctions.getForegroundColor(PrimaryColor));

                for (var i = 0; i < len; i++) {
                    smallValues.eq(i).css("color", "#FFFFFF");

                }

            }

            else {

                Title.css("color", PrimaryColor);

                $("#buzzhome-chosenBorder").css("backgroundColor", PrimaryColor);

                Root.css("backgroundColor", "#FFFFFF");

                // $('#txtApproxFare').css({'border-color':'red','box-shadow':'0px 0px 1px red'})

                // Root.style.boxShadow = "0px 0px 15px" + BoxshadowColor;

                // Root.css("box-shadow", "0px 0px 15px" + BoxshadowColor);

                $("#"+wid+"buzzhome-ChosenSVG").css("fill", Color2);

                $("#"+wid+"buzzhome-chosenValue").css("color", vis.binds.buzzhome.colorFunctions.getForegroundColor(PrimaryColor));

                $("#" + SliderContainerId + " .ui-slider-range").css("backgroundImage", "linear-gradient(" + Color2 + " 0%," + PrimaryColor + " 15%)");

                TemperatureValue.css("color", PrimaryColor);

                SetTemperature.css("color", PrimaryColor);

                for (var i = 0; i < len; i++) {
                    smallValues.eq(i).css("color", PrimaryColor);
                }

            }

        },

        updateBatteryStatus: function (batteryStatus, wid) {
            if (batteryStatus == true) {

                $('#'+ wid +'buzzhome-BatteryIndicator').css('opacity', '1');
            }
            else {

                $('#'+ wid +'buzzhome-BatteryIndicator').css('opacity', '0');
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

        draw: function (container, title, actual, value, humidity, SliderContainerId, SliderChoosenPosition, SliderChoosenValue, SetTemperatureContainer, BatteryIndicatorContainer) {
            //Hier wird das HTML zusammengebaut und an den Container übergeben
            var $SetTemperatureValueHtml = '<div id="buzzhome-SetTemperatureContainer">' +
                '<span id="buzzhome-SetLabel" class="buzzhome-SetLabel">SET:</span>' +
                '<span id="' + SetTemperatureContainer + '" class="buzzhome-SetTemperature">' + value + '&ordm;C</span>' +
                '</div>';

            var $TitleHtml = '<span id="buzzhome-Title" class="buzzhome-TitleHigh">' + title + '</span>';

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
                '<div style="position: absolute; z-index: 100;" id="'+ SliderContainerId + '">' +
                '</div>' +

                '<div id="buzzhome-SliderBackground"> </div>' +


                '<div id="' + SliderChoosenPosition + '" class="buzzhome-chosen">' +
                '<svg id="buzzhome-ChosenSVG" class="buzzhome-ChosenSVG" viewBox="0 0 36.154 44.077">' +
                '<path d="M0,27.891V0l36.154,44.077L0,27.891z" />' +
                '</svg>' +

                '<div id="buzzhome-chosenBorder"></div>' +

                '<span id="'+ SliderChoosenValue +'"class="buzzhome-chosenValue"></span>' +
                ' </div>' +
                ' </div>'

            var $BatteryIndicatorHtml = '<svg id="'+ BatteryIndicatorContainer +'" viewBox="0 0 28 28">' +
                '<path d="M27,8v12H4v-3H1v-6h3V8h17.8L21,10H6v8h14l3-8l0.8-2H27z" />' +
                '</svg>'




            container.append($TitleHtml + $SetTemperatureValueHtml + $TableHtml + $SliderHtml + $BatteryIndicatorHtml);



        }

    }