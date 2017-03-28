
vis.binds.buzzhome.wateringventil = {

    init: function (wid, view, data, style, wType) {

        var $div = $('#' + wid).addClass('buzzhome-wateringventil-Root');
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

        // if (data.oid) {
        //     data.value = vis.states.attr(data.oid + '.val');
        //     data.ack = vis.states.attr(data.oid + '.ack');
        //     data.lc = vis.states.attr(data.oid + '.lc');
        //     console.log(data.value + ',' + data.ack + ',' + data.lc);



        //     vis.states.bind(data.oid + '.val', function (e, newVal, oldVal) {
        //         //console.log("value SetTemperature changed - old: " + oldVal + " newValue: "+ newVal);
        //         data.value = newVal
        //         $('#buzzhome-SetTemperature').html(data.value + '&ordm;C');
        //         $("#buzzhome-slider").slider('value', data.value)

        //     });
        // }

        if (data['oid-state']) {
            vis.states.bind(data['oid-state'] + '.val', function (e, newVal, oldVal) {
                data.runcountdown = newVal;
                  
               
                
                //$('#humidity-value').html(data.humidity);
                //console.log("value oid-humidity changed - old: " + oldVal + " newValue: "+ newVal);
            });
        }

        if (data['oid-runcountdown']) {
            vis.states.bind(data['oid-runcountdown'] + '.val', function (e, newVal, oldVal) {
                data.runcountdown = newVal;
                  if (data.runcountdown === true){
                        $('.toggle').toggle(true);
                    }
                    else
                    $('.toggle').toggle(false);
                console.log("value oid-runcountdown changed - old: " + oldVal + " newValue: "+ newVal);
            });
        }

        if (data['oid-countdown']) {
            vis.states.bind(data['oid-countdown'] + '.val', function (e, newVal, oldVal) {
                data.countdown = newVal;
                //vis.binds.buzzhome.wandthermostat.updateWindowStatus(data.windowstate);
                //console.log("value oid-windowstate changed - old: " + oldVal + " newValue: "+ newVal);
            });
        }

        if (data['oid-state']) data.state = vis.states.attr(data['oid-state'] + '.val');
        if (data['oid-runcountdown']) data.runcountdown = vis.states.attr(data['oid-runcountdown'] + '.val');
        if (data['oid-countdown']) data.countdown = vis.states.attr(data['oid-countdown'] + '.val');


        //console.log("Title: " + data.Title + ", Humidity: " + data.humidity + ", Actual:" + data.actual + ", Battery:" + data.battery + ", Window:" + data.windowstate + ", Mode:" + data.mode);



        var $Title = (data.Title).toString();
        var $PrimaryColor = data.maincolor;
        var $invertColors = data.invertColors;




vis.setValue(data.countdown, 20);
    vis.setValue(data.runcountdown.val, true);


        //HTML Zeichnen
        vis.binds.buzzhome.wateringventil.draw($div, $Title);


        //Farben zuweisen
        // vis.binds.buzzhome.wandthermostat.setHighlightColor($PrimaryColor, $invertColors);
        //console.log($invertColors);

        // create slider
        //vis.binds.buzzhome.wandthermostat.createSlider($Value, data.oid);

        vis.binds.buzzhome.wateringventil.createToggle(data.runcountdown, data.countdown);








    },

    createToggle: function(runcountdown, countdown){


        $('.toggle').toggles({
            drag: true, 
            click: true,
            on: runcountdown,
            text: {
                on: countdown, 
                off: 'OFF' 
                },
                width: 200, 
                height: 70,
                type: 'compact'
        });

$('.toggle').on('toggle', function(e, active) {
  if (active) {
      console.log(runcountdown, countdown, "AKTIV");
      vis.setValue(countdown, 20);
    vis.setValue(runcountdown.val, true);
  } else {
       console.log(runcountdown, countdown, "NICHT AKTIV");
      vis.setValue(countdown, 0);
     vis.setValue(runcountdown, false);
  }
});


    
    },
  

    setHighlightColor: function (PrimaryColor, invertColors) {

        var Color1 = PrimaryColor;
        var Color2 = vis.binds.buzzhome.colorFunctions.ColorLuminance(PrimaryColor, -0.3);
        var BoxshadowColor = vis.binds.buzzhome.colorFunctions.getDropshadowColor(PrimaryColor, 0.2)


        var Root = $(".buzzhome-wandthermostat-Root");
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
        return stunden + ':' + minuten + ':' + sec;
    },


    draw: function (container, title) {
        //Hier wird das HTML zusammengebaut und an den Container übergeben


        var $TitleHtml = '<span id="buzzhome-Title" class="buzzhome-Title">' + title + '</span>';

        var $TableHtml = '<table class="buzzhome-table" width="100%" height="100%">' +
            '<tr>' +
            '<td width="50%" height="100%" style="text-align:center;">' +
            '<div style="height:50px; width:200px;" class="toggle toggle-modern"></div>'
        '</td>' +
            '<td width="50%" height="100%">' +
            '<span class="buzzhome-Label">Humidity: </span><span class="buzzhome-ValueSmall" id="humidity-value"> test </span><span class="buzzhome-Label"> %</span><br>' +
            '</td>' +
            ' </tr>' +
            ' </table>'






        container.append($TitleHtml + $TableHtml);



    }

}