(function ($) {

    $.fn.jNumericWidget = function( options ) {
 
        var orientationOpts = {
        	HORIZONTAL: "horizontal",
        	VERTICAL: "vertical"
        },
        settings = $.extend({
            // These are the default settings.
            orientation: orientationOpts.HORIZONTAL,
            step: 1,
            decimals: 0,
            value: 0,
            minValue: undefined,
            maxValue: undefined,
            onIncrease: function () {},
            onDecrease: function () {},
            onChange: function () {}
        }, options ),

        $element = $(this),

        $wrapper = $("<span class='j-wrapper'>"),
        $decBtn = $("<button class='j-btn j-dec'> - </button>"),
        $incBtn = $("<button class='j-btn j-inc'> + </button>"),
        $numInput = $("<input type='text' class='j-num-box' />");

        // build widget
        $wrapper
        	.append($decBtn, $numInput, $incBtn);

        $element
        	.hide()
        	.before($wrapper)
        	.appendTo($wrapper);

        $numInput.keypress(function(e){
        	var chr = String.fromCharCode(e.which);
        	if (chr === ".") {
        		if (this.value.indexOf(".") >= 0)
        			return false;
        		if (e.currentTarget.selectionStart === 0 && this.value.charAt(0) === "-")
        			return false;
        	}
        	if (chr === "-") {
        		if (e.currentTarget.selectionStart || this.value.indexOf("-") >= 0)
        			return false;
        	}
		    if ("1234567890.-".indexOf(chr) < 0)
		        return false;
		});

		$decBtn.click(function () {
			var newValue = Number($numInput.val()) - settings.step;
			if (settings.minValue && newValue < settings.minValue)
				return;
			$numInput.val(newValue);
			$numInput.trigger("change");
		});

		$incBtn.click(function () {
			var newValue = Number($numInput.val()) + settings.step;
			if (settings.maxValue && newValue > settings.maxValue)
				return;
			$numInput.val(newValue);
			$numInput.trigger("change");
		});

        // private
        var isValidOrientation = function (orientation) {
        	return orientation !== orientationOpts.VERTICAL && orientation !== orientationOpts.HORIZONTAL;
        },

        getValueInRange = function (val) {
        	if (settings.minValue && val < settings.minValue)
        		val = settings.minValue;

        	if (settings.maxValue && val > settings.maxValue)
        		val = settings.maxValue;

        	return val;
        },

        valueChangeHandler = function () {
        	var value = this.value;
        	if (settings.decimals && typeof settings.decimals === "number") {
        		var decimalString;
        		if (value.indexOf(".") >= 0) {
        			decimalString = value.split(".")[1];
        		}
        		else {
        			decimalString = "";
        			value += ".";
        		}

        		if (decimalString.length < settings.decimals)
        			value += (Math.pow(10, (settings.decimals - decimalString.length)) + "").substring(1);
        		else if (decimalString.length > settings.decimals)
        			value = value.substring(0, value.length - (decimalString.length - settings.decimals));
        	}
        	else
        		value = parseInt(value);

        	this.value = getValueInRange(value);
        };
 
        // public
        var instance = {
        	settings: settings,
        	changeOrientation: function (orientation) {
        		if (isValidOrientation()) {
	        		settings.orientation = orientation;
	        		$wrapper
	        			.removeClass("j-vertical j-horizontal")
	        			.addClass(orientation === orientationOpts.VERTICAL ? "j-vertical" : "j-horizontal");
        		}
        	}
        };

        instance.changeOrientation(settings.orientation);
        $numInput.val(settings.value);
        valueChangeHandler.call($numInput[0]);
        $numInput.on("change", valueChangeHandler);
        return instance;
    };
 
}(jQuery));