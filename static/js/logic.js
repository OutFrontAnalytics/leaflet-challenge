let myMap = L.map("map", {
    center: [38.667883, -98.416376],
    zoom: 3
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Load the GeoJSON data.
  let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  
  // Get the data with d3.
  d3.json(geoData).then(function(data) {
  
    
    function getValue(x) {
	return x > 90 ? "#F06A6A" :
	       x > 70 ? "#F0A76A" :
	       x > 50 ? "#F3B94C" :
	       x > 30 ? "#F3DB4C" :
	       x > 10 ? "#E1F34C" :
	      
		       "#B6F34C";
}

     //'#F06A6A', '#F0A76A', '#F3B94C', '#F3DB4C', '#E1F34C', '#B6F34C' starting from 90

//'#B6F34C', '#E1F34C', '#F3DB4C', '#F3B94C', '#F0A76A','#F06A6A' starting from 0

    function style(feature) {
	return {
		
		stroke: true,
        radius: feature.properties.mag*3,
        fillColor: getValue(feature.geometry.coordinates[2]),
        color: "black",
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.8
	};
}

    
    var dat = L.geoJson(data, {
	pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, style(feature));
	},

 // Binding a popup to each layer
 onEachFeature: function(feature, layer) {
    layer.bindPopup("<strong>" + feature.properties.place + "</strong><br /><br />depth: " +
      feature.geometry.coordinates[2] + "<br /><br />magnitude: " + feature.properties.mag);
  }



    });
    dat.addTo(myMap);
  
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");
      let limits = [-10,10,30,50,70,90];
      let colors = ['#B6F34C', '#E1F34C', '#F3DB4C', '#F3B94C', '#F0A76A','#F06A6A'];
      
  
      limits.forEach(function(limit, index) {
        div.innerHTML +=
      "<i style='background: " + colors[index] + "'></i> " +
      limits[index] + (limits[index + 1] ? "&ndash;" + limits[index + 1] + "<br>" : "+");
    

      });
  
    
      return div;
    };
  
    // Adding the legend to the map
    legend.addTo(myMap);
  

  
    
  
  });
  
  