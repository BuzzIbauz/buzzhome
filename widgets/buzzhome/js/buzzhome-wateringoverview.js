
vis.binds.buzzhome.wateringoverview = {

    init: function (wid, view, data, style, wType) {

        var $div = $('#' + wid).addClass('buzzhome-Root');
        if (!$div.length) {
            setTimeout(function () {
                vis.binds.buzzhome.wateringoverview.init(wid, view, data, style, wType);
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



        if (data['oid-timestamp1']) {
            vis.states.bind(data['oid-timestamp1'] + '.val', function (e, newVal, oldVal) {
                data.timestamp1 = newVal;

                $("#" + wid + "timestamp1").html(vis.binds.buzzhome.wateringoverview.TimstampTillNowTimeSpan(data.timestamp1));
            });
        }

        if (data['oid-timestamp1']) {
            vis.states.bind(data['oid-timestamp1'] + '.val', function (e, newVal, oldVal) {
                data.timestamp1 = newVal;
                $("#" + wid + "timestamp2").html(vis.binds.buzzhome.wateringoverview.TimstampTillNowTimeSpan(data.timestamp2));
            });
        }

        if (data['oid-timestamp3']) {
            vis.states.bind(data['oid-timestamp3'] + '.val', function (e, newVal, oldVal) {
                data.timestamp3 = newVal;
                $("#" + wid + "timestamp3").html(vis.binds.buzzhome.wateringoverview.TimstampTillNowTimeSpan(data.timestamp3));
            });
        }


        if (data['oid-viewLink']) {
            vis.states.bind(data['oid-viewLink'] + '.val', function (e, newVal, oldVal) {
                data.viewLink = newVal;

            });
        }



        if (data['oid-timestamp1']) data.timestamp1 = vis.states.attr(data['oid-timestamp1'] + '.val');
        if (data['oid-timestamp2']) data.timestamp2 = vis.states.attr(data['oid-timestamp2'] + '.val');
        if (data['oid-timestamp3']) data.timestamp3 = vis.states.attr(data['oid-timestamp3'] + '.val');

        if (data['oid-viewLink']) data.viewLink = vis.states.attr(data['oid-viewLink'] + '.val');

        var $PrimaryColor = data.maincolor;
        var $invertColors = data.invertColors;


        var title = data.Title.toString();


        var dataView = data['oid-viewLink'];


        //HTML Zeichnen
        vis.binds.buzzhome.wateringoverview.draw($div, wid, title, data);


        //Farben zuweisen
        // vis.binds.buzzhome.climateoverview.setHighlightColor($PrimaryColor, $invertColors, wid);
        //console.log($invertColors);

        setInterval(function () {
            $("#" + wid + "timestamp1").html(vis.binds.buzzhome.wateringoverview.TimstampTillNowTimeSpan(data.timestamp1));
        }, 60000);

        setInterval(function () {
            $("#" + wid + "timestamp2").html(vis.binds.buzzhome.wateringoverview.TimstampTillNowTimeSpan(data.timestamp2));
        }, 60000);

        setInterval(function () {
            $("#" + wid + "timestamp3").html(vis.binds.buzzhome.wateringoverview.TimstampTillNowTimeSpan(data.timestamp3));
        }, 60000);


        $("#" + wid + "timestamp1").html(vis.binds.buzzhome.wateringoverview.TimstampTillNowTimeSpan(data.timestamp1));
        $("#" + wid + "timestamp2").html(vis.binds.buzzhome.wateringoverview.TimstampTillNowTimeSpan(data.timestamp2));
        $("#" + wid + "timestamp3").html(vis.binds.buzzhome.wateringoverview.TimstampTillNowTimeSpan(data.timestamp3));

        // listen to MoreButton
        $("#" + wid + "MoreButton").click(function () {
            vis.setValue(dataView, 1);
        });


    },

    TimstampTillNowTimeSpan: function (TimeStamp) {

        var DateNow = Date.now();
        var TimeSpan = DateNow - TimeStamp;

        var hours = parseInt(TimeSpan / (1000 * 60 * 60));

        console.log(DateNow + "blah" + TimeStamp+ "blah" + TimeSpan+ "blah" + hours);

        if (hours < 24) {
            return hours + " hours"
        }
        else {
            var days = hours / 24
            return Math.round(days) + " days"
        }


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





    draw: function (container, wid, title, data) {
        //Hier wird das HTML zusammengebaut und an den Container übergeben

        var $TitleHtml = '<span id="buzzhome-Title" class="buzzhome-Title">' + title + '</span>'

        var $ContentHtml = '<div class="gridwrapper">' +
            '<div class="gridcontent" id="InsideClimateOverView-MainTemperatureContainer" style="width:50%;">' +

            '<ul class="horizontal" style="right:50%; top:37%; transform: translate(-75%,-100%); position: absolute;">' +
            ' <li>' +
            '    <div style="background:#a57c34; height: 40px; width:40px;     border-radius: 20px;"></div>' +
            ' </li>' +
            ' <li>' +
            '   <div style="background:#a57c34; height: 40px; width:40px;    border-radius: 20px;"></div>' +
            ' </li>' +
            '  <li>' +
            '   <div style="background:#a57c34; height: 40px; width:40px;    border-radius: 20px;"></div>' +
            ' </li>' +
            ' </ul>' +

            ' <div class="watering-timestampContainer">' +
            '   <span id="' + wid + 'timestamp1" class="buzzhome-Label">' + data.timestamp1 + ' </span><br/>' +
            '   <span id="' + wid + 'timestamp2" class="buzzhome-Label">' + data.timestamp2 + ' </span><br/>' +
            '   <span id="' + wid + 'timestamp3" class="buzzhome-Label">' + data.timestamp3 + ' </span><br/>' +
            ' </div>  ' +

            ' </div>' +




            ' <div class="gridcontent" style="width:50%; overflow: hidden;">' +
            '    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"' +
            '        x="0px" y="0px" height="100%" viewBox="0 0 214.591 253" style="enable-background:new 0 0 214.591 253; position:absolute; right:0;"' +
            '     xml:space="preserve">' +
            '      <defs>' +
            '     </defs>' +
            '    <path i:knockout="Off" style="fill:#A57C34;" d="M73.143,253c0-10.069-5.649-18.82-13.951-23.254l0.003-0.006c-18.847-9.855-31.709-29.591-31.709-52.333c0-20.093,10.041-37.841,25.38-48.499l0,0c13.426-9.88,22.149-25.78,22.149-43.729c0-27.66-20.778-50.469-47.527-53.83l0,0C11.978,29.327,0,16.062,0,0h214.591v253H73.143z" />' +
            ' </svg>' +

            ' <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"' +
            '   x="0px" y="0px" height="62%" viewBox="0 0 81.027 149.137" style="enable-background:new 0 0 81.027 149.137; position:absolute; left:50%; top:18%;"' +
            '  xml:space="preserve">' +
            '  <defs>' +
            '  </defs>' +
            '  <path i:knockout="Off" style="fill:#A57C34;" d="M79.742,34.246c3.381,26.135-10.3,27.438-26.114,52.024s-7.793,63.052-7.793,63.052C-8.213,83.462,0.521,35.188,0.521,35.188C2.639,17.453,16.548,2.731,35.07,0.335C56.758-2.471,76.63,12.674,79.738,34.246L79.742,34.246z" />' +
            '</svg>' +



            ' </div>' +
            ' </div>'

        var $MoreButton = '<button id="' + wid + 'MoreButton" type="button" class="morebutton">' +
            '<span class="buzzhome-moreLabel">MORE</span>' +
            '<svg class="buzzhome-moreIcon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="17px" height="24px" viewBox="0 0 17 24" style="enable-background:new 0 0 17 24;" xml:space="preserve">' +
            '<path i:knockout="Off" style="fill:#FFFFFF;" d="M8,24H0l9-12L0,0l8,0l9,12L8,24z" />' +
            '</svg>' +
            ' </button>'

        container.append($TitleHtml + $ContentHtml + $MoreButton);
    }

}