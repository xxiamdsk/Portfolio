(function(b){var a=function(a,b){setTimeout(function(){elementorFrontend.waypoint(a.find('.pxl-counter--value:not(.effect-slide)'),function(){var c=b(this),a=c.data(),d=a.toValue.toString().match(/\.(.*)/);d&&(a.rounding=d[1].length),c.numerator(a)},{offset:'95%',triggerOnce:!0}),elementorFrontend.waypoint(a.find('.pxl-counter--value.effect-slide'),function(){var c=b(this),a=c.data(),d=c[0],e=a.startnumber,f=a.endnumber,g=a.delimiter,h=a.duration;od=new Odometer({el:d,value:e,format:g,theme:'default'}),od.update(f)},{offset:'95%',triggerOnce:!0})},300)};b(window).on('elementor/frontend/init',function(){elementorFrontend.hooks.addAction('frontend/element_ready/pxl_counter.default',a),elementorFrontend.hooks.addAction('frontend/element_ready/pxl_team_counter.default',a),elementorFrontend.hooks.addAction('frontend/element_ready/pxl_client_box.default',a),elementorFrontend.hooks.addAction('frontend/element_ready/pxl_banner_box.default',a)})})(jQuery)