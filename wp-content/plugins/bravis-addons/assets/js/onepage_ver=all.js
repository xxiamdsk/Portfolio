(function ($) {
    "use strict";
    if (typeof(one_page_options) != "undefined") {
        one_page_options.speed = parseInt(one_page_options.speed);
        $('.is-one-page').on('click', function (e) {
            var _this = $(this);
            var _link = $(this).attr('href');
            var _id_data = e.currentTarget.hash;
            var _offset;
            var _data_offset = $(this).attr('data-onepage-offset');
            if(_data_offset) {
                _offset = _data_offset;
            } else {
                _offset = 0;
            }
            if ($(_id_data).length === 1) {
                var _target = $(_id_data);
                $('.pxl-onepage-active').removeClass('pxl-onepage-active');
                _this.addClass('pxl-onepage-active');
                $('html, body').stop().animate({ scrollTop: _target.offset().top - _offset }, one_page_options.speed);   
                return false;
            } else {
                window.location.href = _link;
            }
            return false;
        });

        $.each($('.pxl-onepage-sticky .is-one-page'), function (index, item) {
            var target = $(item).attr('href');
            var targets = target.split('#');
            var el =  $('#'+targets[1]);
            var _data_offset = $(item).attr('data-onepage-offset');
            var waypoint = new Waypoint({
                element: el[0],
                handler: function(direction) {
                    if(direction === 'down'){
                        $('.pxl-onepage-active').removeClass('pxl-onepage-active');
                        $(item).addClass('pxl-onepage-active');
                    }
                    else if(direction === 'up'){
                        var prev = $(item).parent().prev().find('.is-one-page');
                        $(item).removeClass('pxl-onepage-active');
                        if(prev.length > 0)
                            prev.addClass('pxl-onepage-active');
                    }
                },
                offset: _data_offset,
            });
        });
    }

})(jQuery);