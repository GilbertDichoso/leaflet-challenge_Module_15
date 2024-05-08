// Initialize map
var map = L.map('map').setView([0, 0], 2);

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Fetch earthquake data using D3
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(function(data) {
    // Create legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend');
        var depths = [0, 10, 30, 50, 70, 90];
        var labels = [];
         
        for (var i = 0; i < depths.length; i++) {
            var color = getColor(depths[i] + 1);
            div.innerHTML +=
                '<i style="background:' + color + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
        }
        return div;
    };
    legend.addTo(map);

    // Loop through earthquake data
    data.features.forEach(function(feature) {
        var lon = feature.geometry.coordinates[0];
        var lat = feature.geometry.coordinates[1];
        var depth = feature.geometry.coordinates[2];
        var mag = feature.properties.mag;
        var place = feature.properties.place;

        // Define marker size based on magnitude
        var size = mag * 7;

        // Define marker color based on depth
        var color = getColor(depth);

        // Create popup message
        var popupMsg = `<b>Location:</b> ${place}<br><b>Magnitude:</b> ${mag}<br><b>Depth:</b> ${depth} km`;
        
        // Create marker and add to map
        var marker = L.circleMarker([lat, lon], {
            radius: size,
            fillColor: color,
            color: color,
            fillOpacity: 0.7
        }).bindPopup(popupMsg).addTo(map);
    });
});

// Function to get color based on depth
function getColor(d) {
    return d > 90 ? '#002269' :
           d > 70 ? '#063cae' :
           d > 50 ? '#0448db' :
           d > 30 ? '#548cee' :
           d > 10 ? '#a2bffa' :
                    '#82c3f0';
}
