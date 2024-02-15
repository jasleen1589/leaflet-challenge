let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

let my_Map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// Add a tile layer to map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(my_Map);

// Retrieve and add the earthquake data to the map
d3.json(url).then(function (data) {
    function map_style(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: map_Color(feature.geometry.coordinates[2]),
            color: "black",
            radius: map_Radius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    };

    function map_Color(depth) {
        switch (true) {
            case depth > 90:
                return "#000000";
            case depth > 70:
                return "#111111";
            case depth > 50:
                return "#1E1E1E";
            case depth > 30:
                return "#3C3C3C";
            case depth > 10:
                return "#4D4D4D";
            default:
                return "#211919";
        }
    }

    function map_Radius(mag) {
        if(mag === 0) {
            return 1;
        }
        return mag * 4;
    }

    L.geoJson(data, {

        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: map_style,

        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);
        }
    }).addTo(my_Map);

    // Add the legend with colors to corrolate with depth
    var legend = L.control({position: "bottomright"});

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
        depth = [-10, 10, 30, 50, 70, 90];

        for(var i=0; i < depth.length; i++) {
            div.innerHTML += '<i style="background: ' + map_Color(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(my_Map)
});