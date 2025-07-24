
vis.binds.buzzhome.wateringventil = {

    init: function (wid, view, data, style, wType) {

        var $div = $('#' + wid).addClass('buzzhome-Root');
        if (!$div.length) {
            setTimeout(function () {
                vis.binds.buzzhome.wateringventil.init(wid, view, data, style, wType);
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

        if (data['oid-state']) {
            vis.states.bind(data['oid-state'] + '.val', function (e, newVal, oldVal) {
                data.state = newVal;

                //$('#humidity-value').html(data.humidity);
                //console.log("value oid-humidity changed - old: " + oldVal + " newValue: "+ newVal);
            });
        }

        if (data['oid-runcountdown']) {
            vis.states.bind(data['oid-runcountdown'] + '.val', function (e, newVal, oldVal) {
                data.runcountdown = newVal;

                var ToggleSwitch = $('#' + ToggleContainerId).data('toggles');

                if (data.runcountdown === true) {
                    ToggleSwitch.toggle(true);
                }
                else {
                    ToggleSwitch.toggle(false);
                }
                console.log("value oid-runcountdown changed - old: " + oldVal + " newValue: " + newVal);
            });
        }

        if (data['oid-countdown']) {
            vis.states.bind(data['oid-countdown'] + '.val', function (e, newVal, oldVal) {
                data.countdown = newVal;

                var ToggleSwitch = $('#' + ToggleContainerId + ' .toggle-on');
                ToggleSwitch.html(vis.binds.buzzhome.wateringventil.secToStr(data.countdown));

                console.log("value oid-countdown changed - old: " + oldVal + " newValue: " + newVal);
            });
        }

        if (data['oid-timestamp']) {
            vis.states.bind(data['oid-timestamp'] + '.val', function (e, newVal, oldVal) {
                data.timestamp = newVal;

                vis.binds.buzzhome.wateringventil.setTimeStamp(data.timestamp, wid);

            });
        }


        if (data['oid-state']) data.state = vis.states.attr(data['oid-state'] + '.val');
        if (data['oid-runcountdown']) data.runcountdown = vis.states.attr(data['oid-runcountdown'] + '.val');
        if (data['oid-countdown']) data.countdown = vis.states.attr(data['oid-countdown'] + '.val');
        if (data['oid-timestamp']) data.timestamp = vis.states.attr(data['oid-timestamp'] + '.val');

        var $Title = (data.Title).toString();
        var $PrimaryColor = data.maincolor;
        var $invertColors = data.invertColors;
        var $CountdownInMinutes = data.CountdownInMinutes;
        var ToggleContainerId = wid + "toggle";


        //HTML Zeichnen
        vis.binds.buzzhome.wateringventil.draw($div, $Title, ToggleContainerId, wid);


        //Farben zuweisen
        // vis.binds.buzzhome.wandthermostat.setHighlightColor($PrimaryColor, $invertColors, wid);
        //console.log($invertColors);

        vis.binds.buzzhome.wateringventil.createToggle(data, ToggleContainerId);

        vis.binds.buzzhome.wateringventil.setTimeStamp(data.timestamp, wid);


    },

    createToggle: function (data, ToggleContainerId) {

        $('#' + ToggleContainerId).toggles({
            drag: true,
            click: true,
            on: data.runcountdown,
            text: {
                on: data.countdown,
                off: 'OFF'
            },
            width: 200,
            height: 70,
            type: 'compact'
        });

        $('#' + ToggleContainerId).on('toggle', function (e, active) {
            if (active) {
                //console.log(data.runcountdown, data.countdown, "AKTIV");
                vis.setValue(data['oid-countdown'], data.CountdownInMinutes * 60);
                vis.setValue(data['oid-runcountdown'], true);
            }
            else {
                //console.log(data.runcountdown, data.countdown, "NICHT AKTIV");
                vis.setValue(data['oid-countdown'], 0);
                vis.setValue(data['oid-runcountdown'], false);
            }
        });
    },


    setTimeStamp: function (timestamp, wid) {


        var a = new Date(timestamp);
        var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = vis.binds.buzzhome.formatFunctions.addZero(a.getDate());
        var hour = vis.binds.buzzhome.formatFunctions.addZero(a.getHours());
        var min = vis.binds.buzzhome.formatFunctions.addZero(a.getMinutes());
        var sec = vis.binds.buzzhome.formatFunctions.addZero(a.getSeconds());


        $("#Date" + wid).html(date + '.' + month + '.' + year);
        $("#Time" + wid).html(hour + ':' + min + ':' + sec);

    },



    setHighlightColor: function (PrimaryColor, invertColors) {

        var Color1 = PrimaryColor;
        var Color2 = vis.binds.buzzhome.colorFunctions.ColorLuminance(PrimaryColor, -0.3);
        var BoxshadowColor = vis.binds.buzzhome.colorFunctions.getDropshadowColor(PrimaryColor, 0.2)

        var Root = $("#" + wid);
        var Title = $("#buzzhome-Title");

        if (invertColors == true) {

            Root.css("backgroundColor", PrimaryColor);

            // Root.style.boxShadow = "0px 0px 15px transparent";

            // Root.css("box-shadow", "0px 0px 20px transparent");

            Title.css("color", "#FFFFFF");
        }

        else {

            Title.css("color", PrimaryColor);
            Root.css("backgroundColor", "#FFFFFF");
        }

    },

    secToStr: function (sec) {
        sec = parseInt(sec);
        minuten = parseInt(sec / 60);
        sec = sec % 60;
        stunden = parseInt(minuten / 60);
        minuten = minuten % 60;

        if (stunden == 0) {
            return minuten + ':' + sec;
        }
        else {
            return stunden + ':' + minuten + ':' + sec;
        }
    },


    draw: function (container, title, ToggleContainerId, wid) {
        //Hier wird das HTML zusammengebaut und an den Container übergeben

        var $TitleHtml = '<span id="buzzhome-Title" class="buzzhome-Title">' + title + '</span>';

        var $ContentHtml = '<div class="gridwrapper">' +
            '<div class="gridcontent" style="width:25%;">' +
            '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="50%" height="50%" viewBox="0 0 16.021 26.006" style="position: absolute; left: 12.5%; top: 50%; transform: translate(-50%, -50%);" xml:space="preserve">' +
            '<path i:knockout="Off" style="fill:#a57c34;" d="M16.021,17.794c0,4.536-3.586,8.213-8.01,8.213c-4.424,0-8.01-3.677-8.01-8.213c0-2.963,3.411-7.891,5.782-12.1C4.206,9.93,2.405,14.839,2.587,17.623c0.268,4.097,2.474,7.015,5.424,7.015c0,0-2.67-1.369-2.67-6.844c0-2.667,2.304-12.813,2.646-17.567C7.99,0.153,8.01,0.07,8.01,0C8.01,4.106,16.021,13.258,16.021,17.794z" />' +
            '</svg>' +
            '</div>' +
            '<div class="gridcontent" style="width:25%;">' +
            '<div class="textwrapper" style="position: absolute; left: 25%; top: 50%; transform: translate(0, -50%);">' +
            '<span id="Date' + wid + '" class="buzzhome-Label">12.03.2017 </span> <br>' +

            '<span id="Time' + wid + '" class="buzzhome-ValueSmall"> 15 min </span>' +
            '</div>' +
            '</div>' +
            '<div class="gridcontent" style="width:50%;">' +
            '<div id="' + ToggleContainerId + '" class="toggle toggle-modern" style="height: 145px; width: 390px; position: absolute; right: 52px; top: 50%; transform: translate(0%, -50%);" />' +
            '</div>' +
            '</div>'

        container.append($TitleHtml + $ContentHtml);
    }

}