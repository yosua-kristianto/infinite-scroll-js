/*
* Infinity Server Side Scrolling 
* Author: Cua 04/29/2020 
* Inspire: https://stackoverflow.com/a/50799177
* How to use:
* 1. You need to enable JQuery to use this function
* 2. There are 9 parameters. 
* - wrapperId is your wrapper container id in string. 
* - contentId is your content container id in string. 
* - methodType is for AJAX type in string.
* - uri is for uri that you wanna hit
* - datatype is your destination's datatype in string
* - data is your json Request
* - preHitAjax is a function to do when the ajax still not hit
* - postHitAjax is a function to do when the ajax done hit
* - requestSuccess is a function to do when ajax success
* - requestError is a function to do when ajax error
* - endOfRequest is a function to disable ajax call.
* 3. On success, the function will have success parameter as a returned data
* 4. On error, you can use either xhr, status, or error function 
* 5. There are 4 local variables in here. Method to change AJAX method call, 
* endpoint to change endpoint AJAX call, type for the datatype AJAX call, and param is to change AJAX parameters.
* 6. There's a setting variable available for infinityScrolling function
* 6. For the example, you can see allowance-dealer.blade.php file
* 
* If any shits happened, go see the link above or contact me through email : yosua_kristianto144@outlook.com
*
*/

infinityScroll = function (wrapperId, contentId, methodType, uri, datatype, data, preHitAjax, postHitAjax, changeSettings, requestSuccess, requestError, endOfRequest){
    class InfinityScrollSettings{
        constructor(m, e, t, p){
            this.method = m;
            this.endpoint = e;
            this.type = t;
            this.param = p;
        }
    }

    last_y_position = 0;

    function scroller(){
        wrapper = document.getElementById(wrapperId);
        content = document.getElementById(contentId);
        wrapperScrollTop = wrapper.scrollTop;
        wrapperOffsetHeight = wrapper.offsetHeight;
        contentOffsetHeight = content.offsetHeight;

        // Check whatever user scroll left
        if(wrapper.scrollLeft != 0){
            return false;
        }

        if(wrapper.scrollLeft == 0)
            if(last_y_position == wrapperScrollTop)
                return false;
        

        last_y_position = wrapperScrollTop;

        // add more contents if user scrolled down enough
        if(wrapperScrollTop + wrapperOffsetHeight + (wrapperOffsetHeight * 0.3) > contentOffsetHeight)
        {
            if(!$('#loader').hasClass('d-none')){
                !$('#loader').removeClass('d-none')
                return;
            }

            preHitAjax();

            var Setting = new InfinityScrollSettings(methodType, uri, datatype, data);

            var setting = changeSettings();
            if(setting.endOfRequest == false){

                Setting.method = (setting.method != null ? setting.method : methodType);
                Setting.endpoint = (setting.endpoint != null ? setting.endpoint : uri);
                Setting.type = (setting.type != null ? setting.type : datatype);
                Setting.param = (setting.param != null ? setting.param : data);

                if(endOfRequest == false){
                    $.ajax({
                        type: Setting.method,
                        url: Setting.endpoint,
                        dataType: Setting.type,
                        data: Setting.param,
                        success: function(success){
                            requestSuccess(success);
                        },
                        error: function(xhr, status, error){
                            requestError(xhr, status, error);
                        }
                    });
                }

                postHitAjax();
            }
        }
    }
    
    // hook the scroll handler to scroll event
    if(endOfRequest == false){
        if(wrapper.addEventListener)
            wrapper.addEventListener("scroll", scroller, false);
    }
}
