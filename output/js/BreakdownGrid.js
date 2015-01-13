function BreakdownGrid (gridEnvironment) {
    this.gridMargin = 180;

    this.viewBox = = "0 0 " + $('#chartBreakdown').width() + " 340";
    this.svg;
    this.breakMargin = 20;

    this.breakBounds = function() {
    	var values = [];

    	$.each(gridEnvironment.originalColumnList, function () key, value) {
    		if(key == 'lpd', key == 'ipadkeystrokes') {
    			values.push(value);
    		}
    	});

    	return [6, 9];
    };
}