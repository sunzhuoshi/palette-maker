class ColorPicker {
	
checkWithColorPicker(pixels, colorPicker) {
	var passedCount = 0;
	var result = {name: colorPicker.name, passRate: 0};
	pixels.forEach(function(pixel) {
		if (colorPicker.func(pixel.red, pixel.green, pixel.blue)) {
			passedCount ++;
		}
	});
	result.passRate = passedCount / pixels.length;
	console.log(result);
	return result;
}

addColorPickerData(data, colorPicker) {
	var colorData = {x: [], y: [], z: [], color: []};
	var step = 10;
	for (var r=0; r<=255; r+=step) {
		for (var g=0; g<=255; g+=step) {
			for (var b=0; b<=255; b+=step) {
				if (colorPicker.func(r, g, b)) {
					colorData.x.push(r);
					colorData.y.push(g);
					colorData.z.push(b);
					if (colorPicker.color) {
						colorData.color.push(colorPicker.color);						
					}
					else {
						colorData.color.push("rgb(" + r + "," + g + "," + b + ")");
					}
				}
			}
		}
	}
	data.x = data.x.concat(colorData.x);
	data.y = data.y.concat(colorData.y);
	data.z = data.z.concat(colorData.z);
	data.marker.color = data.marker.color.concat(colorData.color);
}

plotColorPicker(pixels) {
  var colors = _.map(pixels, (p, index) => {
    return "rgb(" + p.red + "," + p.green + "," + p.blue + ")";
  });

  var data = {
    x: _.map(pixels, (p) => { return p.red; }),
    y: _.map(pixels, (p) => { return p.green; }),
    z: _.map(pixels, (p) => { return p.blue; }),
    mode: 'markers',
    marker: {
      size: 3,
      color: colors,
      line: {
        color: 'rgb(100,100,100)',
        width: 1
      }
    },
    type: 'scatter3d'
  };
  
  var defaultColorPickers = [];
  defaultColorPickers['red'] = 
	{
		name: 'red',
		func: function(r, g, b) {
			var threshold = 50;
			return (r - g) >= threshold && (r - b) >= threshold;
		},
		//color: "rgb(255, 0, 0)",
		check: true,
		show: true
	};
	defaultColorPickers['green'] = 
	{
		name: 'green',
		func: function(r, g, b) {
			var threshold = 50;
			return (g - r) >= threshold && (g - b) >= threshold;
		},
		//color: "rgb(0, 255, 0)",
		check: true,
		show: true
	};
	defaultColorPickers['blue'] = 
	{
		name: 'blue',
		func: function(r, g, b) {
			var threshold = 50;
			return (b - r) >= threshold && (b - g) >= threshold;
		},
		//color: "rgb(0, 0, 255)", // use original pixel color
		check: true,
		show: true
	};
	defaultColorPickers['black'] = 
	{
		name: 'black',
		func: function(r, g, b) {
			var threshold1 = 50;
			var threshold2 = 64;
			return Math.abs(r - b) <= threshold1 && Math.abs(r - g) <= threshold1 && Math.abs(g - b) <= threshold1 &&
				r <= threshold2 && g <= threshold2 && b <= threshold2;
		},
		//color: "rgb(0, 0, 0)",
		check: true
	};
	defaultColorPickers['white'] = 
	{
		name: 'white',
		func: function(r, g, b) {
			var threshold1 = 50;
			var threshold2 = 200;
			return Math.abs(r - b) <= threshold1 && Math.abs(r - g) <= threshold1 && Math.abs(g - b) <= threshold1 &&
				r >= threshold2 && g >= threshold2 && b >= threshold2;
		},
		//color: "rgb(0, 0, 0)",
		check: true
	};	
	defaultColorPickers['cyan'] = 
	{
		name: 'cyan',
		func: function(r, g, b) {
			var threshold = 50;
			return (g - r) >= threshold && (b - r) >= threshold && Math.abs(g - b) <= threshold;
		},
		//color: "rgb(0, 255, 255)",
		check: true		
	};
	defaultColorPickers['magenta'] = 
	{
		name: 'magenta',
		func: function(r, g, b) {
			var threshold = 50;
			return (r - g) >= threshold && (b - g) >= threshold && Math.abs(r - b) <= threshold;
		},
		//color: "rgb(255, 0, 255)",
		check: true
	};
	defaultColorPickers['yellow'] =
	{
		name: 'yellow',
		func: function(r, g, b) {
			var threshold = 50;
			return (r - b) >= threshold && (g - b) >= threshold && Math.abs(r - g) <= threshold;
		},
		//color: "rgb(255, 255, 0)",
		check: true
	};
  
  if (!window.colorPickers) {
	  window.colorPickers = defaultColorPickers;
	  window.showColorPicker = function(name, show, ifHideOthers) {
		  if (ifHideOthers) {
			for (var nm in window.colorPickers) {
				window.colorPickers[nm].show = false;
			}			  
		  }
		  window.colorPickers[name].show = show;		  
	  }
  }
  var colorPickers = window.colorPickers;
  
  for (var name in colorPickers) {
	  var colorPicker = colorPickers[name];
	  if (colorPicker.check) {
			this.checkWithColorPicker(pixels, colorPicker);		  
	  }
	  if (colorPicker.show) {
			this.addColorPickerData(data, colorPicker);					  
	  }	  
  }
  
  var layout = {
    margin: { l:0, r:0, b: 0, t: 0 },
    scene: {
      xaxis: { title: "Red", color: "red" },
      yaxis: { title: "Green", color: "green" },
      zaxis: { title: "Blue", color: "blue" }
    }
  };

  Plotly.newPlot('color-picker-plot', [data], layout);
  $("#color-picker-plot").show();
}

}
module.exports = ColorPicker;