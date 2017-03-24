  
  vis.binds.buzzhome.wateringventil= {
  
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
                   // $('#buzzhome-TemperatureValue').html(Math.round(data.actual));
                    //console.log("value oid-actual changed - old: " + oldVal + " newValue: "+ newVal);
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





            //HTML Zeichnen
            vis.binds.buzzhome.wateringventil.draw($div, $Title);

            
            //Farben zuweisen
           // vis.binds.buzzhome.wandthermostat.setHighlightColor($PrimaryColor, $invertColors);
            //console.log($invertColors);

            // create slider
            //vis.binds.buzzhome.wandthermostat.createSlider($Value, data.oid);

         

        

       


        },


        // createSlider: function (slideAmount, dataoid) {

        //     var chosenPosition = $('#buzzhome-chosen');
        //     var display = $('#buzzhome-chosenValue');



        //     $("#buzzhome-slider").slider({
        //         min: 12,
        //         max: 30,
        //         animate: "slow",
        //         range: "min",
        //         value: slideAmount,

        //         slide: function (event, ui) {
        //             chosenPosition.css("opacity", "1");

        //             $('.ui-slider-handle').html(chosenPosition); //attach chosenPosition to sliderhandle

        //             display.html(ui.value);
        //         },
        //         stop: function (event, ui) {
        //             chosenPosition.css("opacity", "0");
        //             vis.setValue(dataoid, ui.value);
        //         }
        //     });

        // },

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

      
        draw: function (container, title) {
            //Hier wird das HTML zusammengebaut und an den Container übergeben
          

            var $TitleHtml = '<span id="buzzhome-Title" class="buzzhome-Title">' + title + '</span>';

            var $TableHtml = '<table class="buzzhome-table" width="100%" height="100%">' +
                '<tr>' +
                '<td width="50%" height="100%" style="text-align:center;">' +
                '<div class="toggle"></div>'
                '</td>' +
                '<td width="50%" height="100%">' +
                '<span class="buzzhome-Label">Humidity: </span><span class="buzzhome-ValueSmall" id="humidity-value"> test </span><span class="buzzhome-Label"> %</span><br>' +
                '</td>' +
                ' </tr>' +
                ' </table>'


            var $ToggleHtml = '<label class="switch"> '+
'<input type="checkbox" checked="checked" />'+
'<div class="slider">'+
'</div>'+
'</label>'


     



            container.append($TitleHtml + $TableHtml + $ToggleHtml );



        }

    }