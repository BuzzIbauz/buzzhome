
vis.binds.buzzhome.climateoverview = {

    init: function (wid, view, data, style, wType) {

        var $div = $('#' + wid).addClass('buzzhome-Root');
        if (!$div.length) {
            setTimeout(function () {
                vis.binds.buzzhome.climateoverview.init(wid, view, data, style, wType);
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



        if (data['oid-actualmain']) {
            vis.states.bind(data['oid-actualmain'] + '.val', function (e, newVal, oldVal) {
                data.actualmain = newVal;

                $("#" + wid + "ActualMainValue").html(Math.round(data.actualmain));

            });
        }

        if (data['oid-batterymain']) {
            vis.states.bind(data['oid-batterymain'] + '.val', function (e, newVal, oldVal) {
                data.batterymain = newVal;
                vis.binds.buzzhome.climateoverview.updateBatteryActual(data.batterymain);
            });
        }

        if (data['oid-windowstatemain']) {
            vis.states.bind(data['oid-windowstatemain'] + '.val', function (e, newVal, oldVal) {
                data.windowstatemain = newVal;
                vis.binds.buzzhome.climateoverview.updateWindowActual(data.windowstatemain);
            });
        }





        if (data['oid-actual1']) {
            vis.states.bind(data['oid-actual1'] + '.val', function (e, newVal, oldVal) {
                data.actual1 = newVal;
                $("#" + wid + "Actual1Value").html(Math.round(data.actual1));
            });
        }

        if (data['oid-battery1']) {
            vis.states.bind(data['oid-battery1'] + '.val', function (e, newVal, oldVal) {
                data.battery1 = newVal;
                vis.binds.buzzhome.climateoverview.updateBattery1(data.battery1);
            });
        }

        if (data['oid-windowstate1']) {
            vis.states.bind(data['oid-windowstate1'] + '.val', function (e, newVal, oldVal) {
                data.windowstate1 = newVal;
                vis.binds.buzzhome.climateoverview.updateWindow1(data.windowstate1);
            });
        }



        if (data['oid-actual2']) {
            vis.states.bind(data['oid-actual2'] + '.val', function (e, newVal, oldVal) {
                data.actual2 = newVal;
                $("#" + wid + "Actual2Value").html(Math.round(data.actual2));
            });
        }

        if (data['oid-battery2']) {
            vis.states.bind(data['oid-battery2'] + '.val', function (e, newVal, oldVal) {
                data.battery2 = newVal;
                vis.binds.buzzhome.climateoverview.updateBattery2(data.battery2);
            });
        }

        if (data['oid-windowstate2']) {
            vis.states.bind(data['oid-windowstate2'] + '.val', function (e, newVal, oldVal) {
                data.windowstate2 = newVal;
                vis.binds.buzzhome.climateoverview.updateWindow2(data.windowstate2);
            });
        }



        if (data['oid-actual3']) {
            vis.states.bind(data['oid-actual3'] + '.val', function (e, newVal, oldVal) {
                data.actual3 = newVal;
                $("#" + wid + "Actual3Value").html(Math.round(data.actual3));
            });
        }

        if (data['oid-battery3']) {
            vis.states.bind(data['oid-battery3'] + '.val', function (e, newVal, oldVal) {
                data.battery3 = newVal;
                vis.binds.buzzhome.climateoverview.updateBattery3(data.battery3);
            });
        }

        if (data['oid-windowstate3']) {
            vis.states.bind(data['oid-windowstate3'] + '.val', function (e, newVal, oldVal) {
                data.windowstate3 = newVal;
                vis.binds.buzzhome.climateoverview.updateWindow3(data.windowstate3);
            });
        }


        if (data['oid-viewLink']) {
            vis.states.bind(data['oid-viewLink'] + '.val', function (e, newVal, oldVal) {
                data.viewLink = newVal;

            });
        }



        if (data['oid-actualmain']) data.actualmain = vis.states.attr(data['oid-actualmain'] + '.val');
        if (data['oid-batterymain']) data.batterymain = vis.states.attr(data['oid-batterymain'] + '.val');
        if (data['oid-windowstatemain']) data.windowstatemain = vis.states.attr(data['oid-windowstatemain'] + '.val');

        if (data['oid-actual1']) data.actual1 = vis.states.attr(data['oid-actual1'] + '.val');
        if (data['oid-battery1']) data.battery1 = vis.states.attr(data['oid-battery1'] + '.val');
        if (data['oid-windowstate1']) data.windowstate1 = vis.states.attr(data['oid-windowstate1'] + '.val');


        if (data['oid-actual2']) data.actual2 = vis.states.attr(data['oid-actual2'] + '.val');
        if (data['oid-battery2']) data.battery2 = vis.states.attr(data['oid-battery2'] + '.val');
        if (data['oid-windowstate2']) data.windowstate2 = vis.states.attr(data['oid-windowstate2'] + '.val');

        if (data['oid-actual3']) data.actual3 = vis.states.attr(data['oid-actual3'] + '.val');
        if (data['oid-battery3']) data.battery3 = vis.states.attr(data['oid-battery3'] + '.val');
        if (data['oid-windowstate3']) data.windowstate3 = vis.states.attr(data['oid-windowstate3'] + '.val');

        if (data['oid-viewLink']) data.viewLink = vis.states.attr(data['oid-viewLink'] + '.val');

        var $PrimaryColor = data.maincolor;
        var $invertColors = data.invertColors;



        console.log("datazeug" + data.windowstate1 + data.windowstate2 + data.windowstate3 + data.windowstatemain);


        var title = data.Title.toString();
        var actualMain = Math.round(data.actualmain);
        var actual1 = Math.round(data.actual1);
        var actual2 = Math.round(data.actual2);
        var actual3 = Math.round(data.actual3);
        var dataView = data['oid-viewLink'];
        //HTML Zeichnen
        vis.binds.buzzhome.climateoverview.draw($div, wid, title, actualMain, actual1, actual2, actual3, dataView);


        //Farben zuweisen
        // vis.binds.buzzhome.climateoverview.setHighlightColor($PrimaryColor, $invertColors, wid);
        //console.log($invertColors);

        //alle Windowstates und Batterys aktualisieren
        vis.binds.buzzhome.climateoverview.updateBatteryActual(data.batterymain, wid);
        vis.binds.buzzhome.climateoverview.updateWindowActual(data.windowstatemain, wid);

        vis.binds.buzzhome.climateoverview.updateWindow1(data.windowstate1, wid);
        vis.binds.buzzhome.climateoverview.updateBattery1(data.battery1, wid);

        vis.binds.buzzhome.climateoverview.updateWindow2(data.windowstate2, wid);
        vis.binds.buzzhome.climateoverview.updateBattery2(data.battery2, wid);

        vis.binds.buzzhome.climateoverview.updateWindow3(data.windowstate3, wid);
        vis.binds.buzzhome.climateoverview.updateBattery3(data.battery3, wid);

        // listen to MoreButton
        $("#"+ wid + "MoreButton").click(function(){
             vis.setValue(dataView, 2);   
        }); 
     

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

    // NavigateToOverView: function (dataView) {
    //     vis.setValue(dataView, 2);
    // },



    updateBatteryActual: function (batterymain, wid) {
        if (batterymain == true) { $("#" + wid + "BatteryIndicatorMain").css("opacity", "1"); }
        else { $("#" + wid + "BatteryIndicatorMain").css("opacity", "0"); }
    },

    updateWindowActual: function (windowstatemain, wid) {
        if (windowstatemain == true) { $("#" + wid + "WindowIndicatorMain").css("opacity", "1"); }
        else { $("#" + wid + "WindowIndicatorMain").css("opacity", "0"); }
    },

    updateBattery1: function (battery1, wid) {
        if (battery1 == true) { $("#" + wid + "BatteryIndicator1").css("opacity", "1"); }
        else { $("#" + wid + "BatteryIndicator1").css("opacity", "0"); }
    },

    updateWindow1: function (windowstate1, wid) {
        if (windowstate1 == true) { $("#" + wid + "WindowIndicator1").css("opacity", "1"); }
        else { $("#" + wid + "WindowIndicator1").css("opacity", "0"); }
    },

    updateBattery2: function (battery2, wid) {
        if (battery2 == true) { $("#" + wid + "BatteryIndicator2").css("opacity", "1"); }
        else { $("#" + wid + "BatteryIndicator2").css("opacity", "0"); }
    },

    updateWindow2: function (windowstate2, wid) {
        if (windowstate2 == true) { $("#" + wid + "WindowIndicator2").css("opacity", "1"); }
        else { $("#" + wid + "WindowIndicator2").css("opacity", "0"); }
    },

    updateBattery3: function (battery3, wid) {
        if (battery3 == true) { $("#" + wid + "BatteryIndicator3").css("opacity", "1"); }
        else { $("#" + wid + "BatteryIndicator3").css("opacity", "0"); }

    },

    updateWindow3: function (windowstate3, wid) {
        if (windowstate3 == true) { $("#" + wid + "WindowIndicator3").css("opacity", "1"); }
        else { $("#" + wid + "WindowIndicator3").css("opacity", "0"); }
    },




    draw: function (container, wid, title, actualMain, actual1, actual2, actual3, dataView) {
        //Hier wird das HTML zusammengebaut und an den Container übergeben

        var $TitleHtml = '<span id="buzzhome-Title" class="buzzhome-Title">' + title + '</span>'

        var $ContentHtml = '<div class="gridwrapper">' +
            '<div class="gridcontent" id="InsideClimateOverView-MainTemperatureContainer" style="width:50%;">' +
            ' <div style="position: absolute; left: 25%; top: 50%; transform: translate(-44%, -55%);">' +
            '<span id="' + wid + 'ActualMainValue" class="buzzhome-Value">' + actualMain + '</span> <span class="buzzhome-ValueSmall">°C </span> <br/>' +
            '<span style="position: absolute; transform: translate(0, -50px);" class="buzzhome-Label">Wohnzimmer </span>' +
            ' </div>' +
            ' </div>' +

            '<div class="gridcontent" style="width:50%; background: #a57c34; overflow: auto; box-shadow:inset 4px 0px 18px 0 rgba(0, 0, 0, 0.5);">' +
            ' <div style="width: 100%; float: left; position: relative; height: 12.5%; ">' +

            ' </div>' +
            ' <div class="listitem">' +

            '  <div class="listitemtextwrapper">' +
            '     <span id="' + wid + 'Actual1Value" class="buzzhome-ValueSmall" style="color: white">' + actual1 + '</span> <span class="buzzhome-ValueSmall" style="color: white">°C</span><br/>' +
            '      <span class="buzzhome-smallLabel">Schlafzimmer </span>' +
            '  </div>' +


            ' <ul class="horizontal" style="right:10%; top:50%; transform: translate(0, -65%); position: absolute;">' +

            '  <li>' +
            '      <svg id="' + wid + 'BatteryIndicator1" class="buzzhome-SmallListIndicator" viewBox="0 0 28 28" style="fill: #D64545;">' +
            '          <path d="M27,8v12H4v-3H1v-6h3V8h17.8L21,10H6v8h14l3-8l0.8-2H27z" />' +
            '     </svg>' +
            '</li>' +
            ' <li>' +
            '    <svg id="' + wid + 'WindowIndicator1" class="buzzhome-SmallListIndicator" viewBox="0 0 20 24" style="fill:#FFFFFF;">' +
            '       <path d="M20,20h-3.6L6,24v-4v-2V6l10.4-4H2v16h2v2H0V0h20V20z" />' +
            '  </svg>' +
            '</li>' +


            '</ul>' +



            ' </div>' +
            '<div class="listitem">' +

            '                    <div class="listitemtextwrapper">' +
            '                       <span  id="' + wid + 'Actual2Value" class="buzzhome-ValueSmall" style="color: white">' + actual2 + '</span> <span class="buzzhome-ValueSmall" style="color: white">°C</span><br/>' +
            '                      <span class="buzzhome-smallLabel">Kinderzimmer </span>' +
            '                 </div>' +
            '                <ul class="horizontal" style="right:10%; top:50%; transform: translate(0, -65%); position: absolute;">' +

            '                   <li>' +
            '                      <svg id="' + wid + 'BatteryIndicator2" class="buzzhome-SmallListIndicator" viewBox="0 0 28 28" style="fill: #D64545;">' +
            '                         <path d="M27,8v12H4v-3H1v-6h3V8h17.8L21,10H6v8h14l3-8l0.8-2H27z" />' +
            '                    </svg>' +
            '               </li>' +
            '              <li>' +
            '                 <svg id="' + wid + 'WindowIndicator2" class="buzzhome-SmallListIndicator" viewBox="0 0 20 24" style="fill:#FFFFFF;">' +
            '                    <path d="M20,20h-3.6L6,24v-4v-2V6l10.4-4H2v16h2v2H0V0h20V20z" />' +
            '               </svg>' +
            '          </li>' +


            '     </ul>' +

            '</div>' +
            '<div class="listitem">' +
            '   <div class="listitemtextwrapper">' +
            '      <span id="' + wid + 'Actual3Value" class="buzzhome-ValueSmall" style="color: white">' + actual3 + '</span> <span class="buzzhome-ValueSmall" style="color: white">°C</span> <br/>' +
            '     <span class="buzzhome-smallLabel">Badezimmer </span>' +
            ' </div>' +



            '                   <ul class="horizontal" style="right:10%; top:50%; transform: translate(0, -65%); position: absolute;">' +

            '                      <li>' +
            '                         <svg id="' + wid + 'BatteryIndicator3" class="buzzhome-SmallListIndicator" viewBox="0 0 28 28" style="fill: #D64545;">' +
            '                            <path d="M27,8v12H4v-3H1v-6h3V8h17.8L21,10H6v8h14l3-8l0.8-2H27z" />' +
            '                       </svg>' +
            '                  </li>' +
            '                 <li>' +
            '                    <svg id="' + wid + 'WindowIndicator3" class="buzzhome-SmallListIndicator" viewBox="0 0 20 24" style="fill:#FFFFFF;">' +
            '                       <path d="M20,20h-3.6L6,24v-4v-2V6l10.4-4H2v16h2v2H0V0h20V20z" />' +
            '                  </svg>' +
            '             </li>' +


            '        </ul>' +

            '   </div>' +
            '   <div style="width: 100%; float: left; position: relative; height: 12.5%;">' +

            '  </div>' +

            '   <div class="seperator" style="top: 37.5%;"></div>' +
            ' <div class="seperator" style="top: 62.5%;"></div>' +
            '  </div>' +
            '  </div>'


        var $MainIndicators = '<ul class="horizontal" style="right:52%; top:5%; position: absolute;">' +
            '<li>' +
            '<svg class="buzzhome-SmallListIndicator" id="' + wid + 'BatteryIndicatorMain" viewBox="0 0 28 28" style="fill: #D64545;">' +
            ' <path d="M27,8v12H4v-3H1v-6h3V8h17.8L21,10H6v8h14l3-8l0.8-2H27z" />' +
            '</svg>' +
            ' </li>' +
            '<li>' +
            '<svg class="buzzhome-SmallListIndicator" id="' + wid + 'WindowIndicatorMain" viewBox="0 0 20 24" style="fill:#a57c34;">' +
            ' <path d="M20,20h-3.6L6,24v-4v-2V6l10.4-4H2v16h2v2H0V0h20V20z" />' +
            '</svg>' +
            ' </li>' +
            ' </ul>'




        
        var $MoreButton = '<button id="' + wid + 'MoreButton" type="button" class="morebutton">' +
            '<span class="buzzhome-moreLabel">MORE</span>' +
            '<svg class="buzzhome-moreIcon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="17px" height="24px" viewBox="0 0 17 24" style="enable-background:new 0 0 17 24;" xml:space="preserve">' +
            '<path i:knockout="Off" style="fill:#FFFFFF;" d="M8,24H0l9-12L0,0l8,0l9,12L8,24z" />' +
            '</svg>' +
            ' </button>'

        container.append($TitleHtml + $ContentHtml + $MainIndicators + $MoreButton);
    }

}