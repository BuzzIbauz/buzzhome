
vis.binds.buzzhome.statusview = {

    init: function (wid, view, data, style, wType) {

        var $div = $('#' + wid).addClass('buzzhome-Root');
        if (!$div.length) {
            setTimeout(function () {
                vis.binds.buzzhome.statusview.init(wid, view, data, style, wType);
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





        if (data['oid-person1']) {
            vis.states.bind(data['oid-person1'] + '.val', function (e, newVal, oldVal) {
                data.person1 = newVal;

            });
        }

        if (data['oid-person2']) {
            vis.states.bind(data['oid-person2'] + '.val', function (e, newVal, oldVal) {
                data.person2 = newVal;

            });
        }

        if (data['oid-person3']) {
            vis.states.bind(data['oid-person3'] + '.val', function (e, newVal, oldVal) {
                data.person3 = newVal;
            });
        }

        if (data['oid-person4']) {
            vis.states.bind(data['oid-person4'] + '.val', function (e, newVal, oldVal) {
                data.person4 = newVal;
            });
        }

        if (data['oid-numberofnotifications']) {
            vis.states.bind(data['oid-numberofnotifications'] + '.val', function (e, newVal, oldVal) {
                data.numberofnotifications = newVal;
            });
        }

        if (data['oid-notificationtext']) {
            vis.states.bind(data['oid-notificationtext'] + '.val', function (e, newVal, oldVal) {
                data.notificationtext = newVal;
            });
        }




        if (data['oid-person1']) data.person1 = vis.states.attr(data['oid-person1'] + '.val');
        if (data['oid-person2']) data.person2 = vis.states.attr(data['oid-person2'] + '.val');
        if (data['oid-person3']) data.person3 = vis.states.attr(data['oid-person3'] + '.val');
        if (data['oid-person4']) data.person4 = vis.states.attr(data['oid-person4'] + '.val');

        if (data['oid-numberofnotifications']) data.numberofnotifications = vis.states.attr(data['oid-numberofnotifications'] + '.val');
        if (data['oid-notificationtext']) data.notificationtext = vis.states.attr(data['oid-notificationtext'] + '.val');

        if (data['oid-viewLink']) data.viewLink = vis.states.attr(data['oid-viewLink'] + '.val');

        var $PrimaryColor = data.maincolor;
        var $invertColors = data.invertColors;


        var title = data.Title.toString();

        var dataView = data['oid-viewLink'];
        //HTML Zeichnen
        vis.binds.buzzhome.statusview.draw($div, wid, title);


        //Farben zuweisen
        // vis.binds.buzzhome.climateoverview.setHighlightColor($PrimaryColor, $invertColors, wid);
        //console.log($invertColors);


        // listen to MoreButton
        // $("#" + wid + "MoreButton").click(function () {
        //     vis.setValue(dataView, 2);
        // });


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


    draw: function (container, wid, title) {
        //Hier wird das HTML zusammengebaut und an den Container übergeben

        var $TitleHtml = '<span id="buzzhome-Title" class="buzzhome-Title">' + title + '</span>'

        var $ContentHtml = '<div class="gridwrapper">'+

        '       <div class="gridcontent" id="InsideClimateOverView-MainTemperatureContainer" style=" right:0%; position:absolute; height: 68px;">'+
        '           <ul class="horizontal">'+
        '               <li>'+
        '                   <div id="User" class="buzzhome-NotificationIconsContainer">'+
        '                       <svg class="buzzhome-NotificationIcons" id="buzzhome-UserIdicator" viewBox="0 0 24 24" style="fill:#a57c34;">'+
        '                           <path d="M24,12.891v0.002l-0.062,0.454c0,0-1.486,7.654-2.706,7.654c-1.425,0-3.187,0-3.187,0S17.608,21,17,21c-0.446,0-0.981,0-1.517,0h-1.169c-0.574,1.686-1.208,2.989-1.797,2.989c-1.951,0-4.364,0-4.364,0s-2.413,0-4.364,0c-1.671,0-3.705-10.48-3.705-10.48L0,12.887c0,0,0-0.001,0-0.002c-0.006-0.697,0.303-1.428,0.911-1.771c0.653-0.369,1.399-0.541,2.108-0.788c0.483-0.169,2.175-0.508,2.175-0.508L3,13l2.398-1l1.957,2.84L6.521,9.456C4.921,8.728,3.79,6.97,3.79,4.909C3.79,2.198,5.744,0,8.154,0s4.364,2.198,4.364,4.909c0,2.061-1.131,3.818-2.731,4.547L8.936,14.95L11.133,12l0.994,0.533v0L13,13l-0.618-1.043l0,0l-1.267-2.138c0,0,1.691,0.339,2.175,0.508c0.547,0.191,1.115,0.339,1.646,0.565c0.158,0.066,0.312,0.139,0.461,0.223c0.002,0.001,0.003,0.003,0.006,0.005l0,0c0.294,0.168,0.516,0.428,0.668,0.73l0,0v0c0.159,0.317,0.24,0.68,0.237,1.036c0,0.001,0,0.002,0,0.002l-0.085,0.622c0,0-0.012,0.059-0.031,0.159c-0.003,0.016-0.006,0.031-0.01,0.049c-0.008,0.042-0.018,0.089-0.029,0.143c-0.005,0.023-0.008,0.041-0.013,0.066c-0.015,0.075-0.032,0.157-0.052,0.249c-0.004,0.019-0.008,0.039-0.012,0.059c-0.019,0.091-0.04,0.19-0.063,0.296c-0.006,0.026-0.012,0.054-0.017,0.082c-0.02,0.095-0.042,0.195-0.065,0.3c-0.008,0.037-0.016,0.074-0.025,0.113c-0.026,0.118-0.053,0.242-0.082,0.37c-0.005,0.021-0.009,0.041-0.014,0.063c-0.036,0.159-0.073,0.323-0.112,0.494c0,0,0,0,0,0c-0.038,0.167-0.079,0.34-0.121,0.516c-0.007,0.029-0.014,0.058-0.021,0.087c-0.036,0.15-0.072,0.302-0.11,0.456c-0.009,0.038-0.018,0.076-0.028,0.114c-0.038,0.156-0.078,0.313-0.118,0.472c-0.008,0.033-0.016,0.065-0.025,0.097c-0.026,0.102-0.053,0.204-0.079,0.307h1.156c0.305-1.209,0.62-2.624,0.942-4.283l0.006-0.03l0.004-0.03l0.06-0.44l-0.258-2.751c-1.298-0.453-2.247-1.799-2.247-3.409c0-1.98,1.427-3.585,3.187-3.585c1.76,0,3.187,1.605,3.187,3.585c0,1.572-0.905,2.893-2.157,3.377l-0.219,1.953c1.74-0.38,2.234-1.915,2.234-1.915c0.517,0.18,1.768,0.857,2.245,1.126C23.779,11.848,24.004,12.381,24,12.891z"'+
        '                           />'+
        '                       </svg>'+
        '                   </div>'+
        '               </li>'+
        '               <li>'+
        '                   <div id="Notification" class="buzzhome-NotificationIconsContainer">'+
        '                       <svg class="buzzhome-NotificationIcons" id="buzzhome-NotificationsContainer" viewBox="0 0 24 24" style="fill: #a57c34;">'+
        '                           <path d="M1.988,0h20.024C23.11,0,24,0.89,24,1.988v14.024C24,17.11,23.11,18,22.012,18H15l-8,6l0-6H1.988C0.89,18,0,17.11,0,16.012V15h12v-2H0v-3h17V8H0V5h9V3H0V1.988C0,0.89,0.89,0,1.988,0z"'+
        '                           />'+
        '                       </svg>'+
        '                  <div class="buzzhome-RedCircleContainer">'+
        '                     <span class="buzzhome-NumberLabel">12</span>'+
        '                 </div>'+
        '            </div>'+
        '        </li>'+
        '        <div id="NotificationSeperator" class="NotificationSeperator"> </div>'+
        '    </ul>'+
        '  </div>'+
        '        <div id="NotificationSeperatorLonger1"> </div>'+
        '        <div id="NotificationSeperatorLonger2"> </div>'+
        '            <div id="ContentArea" class="gridcontent">'+
        '               <div id="listUser">'+
        '                  <ul class="horizontal" style="margin-top:20px; margin-left:20px; margin-right:20px; margin-bottom:14px;">'+
        '                     <li>'+
        '                        <div style="height:155px; width: 155px; background: greenyellow; margin-right: 20px;"></div>'+
        '                   </li>'+
        '                  <li>'+
        '                     <div style="height:155px; width: 155px; background: green; margin-right: 20px;"></div>'+
        '                </li>'+
        '     <li>'+
        '         <div style="height:155px; width: 155px; background: lightblue; margin-right: 20px;"></div>'+
        '      </li>'+
        '     <li>'+
        '       <div style="height:155px; width: 155px; background: blue;"></div>'+
        ' </li>'+
        '  </ul>'+
        '   <div style="height:4px; position:relative; bottom:0px; width:100%; background: #a57c34;"></div>'+
        '  </div>'+
        ' <div id="listNotification">'+
        '    <ul style="margin:20px; max-height:464px; overflow:auto;">'+
        '        <li>'+
        '           <div class="NotificationWrapper">'+
        '              <span class="buzzhome-ValueSmall"> Headline </span></br>'+
        '              <span class="buzzhome-smallLabel"> Very Long FehlerDescription that do not know what to do write to be long enough to wraps hopefully. </span>'+
        '         </div>'+
        '     </li>'+
        '      <li>'+
        '          <div class="NotificationWrapper">'+
        '              <span class="buzzhome-ValueSmall"> Headline </span></br>'+
        '              <span class="buzzhome-smallLabel"> Very Long FehlerDescription that do not know what to do write to be long enough to wraps hopefully. </span>'+
        '          </div>'+
        '      </li>'+
        '      <li>'+
        '          <div class="NotificationWrapper">'+
        '             <span class="buzzhome-ValueSmall"> Headline </span></br>'+
        '             <span class="buzzhome-smallLabel"> Very Long FehlerDescription that do not know what to do write to be long enough to wraps hopefully. </span>'+
        '         </div>'+
        '    </li>'+
        '  </ul>'+
        '   <div style="height:4px; position:relative; bottom:0px; width:100%; background: #a57c34;"></div>'+
        '  </div>'+
        '   </div>'+
        '   </div>'




        container.append($TitleHtml + $ContentHtml);
    }

}