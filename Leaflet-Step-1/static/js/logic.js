///////////////////////////////////////////////////////////////////////////////////////////////
// Initialize variables for the geoJSON and the layer group for the map
/////////////////////////////////////////////////////////////////////////////////////////////

var eqGeoJSON = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var earthquakes = new L.LayerGroup();


/////////////////////////////////////////////////////////////////////////////////////////////
// Using D3, parse and run through the geoJSOn data and call createMap() using the data placed
// in the earthquakes layer
/////////////////////////////////////////////////////////////////////////////////////////////

d3.json(eqGeoJSON, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (data, coords) {
            return L.circleMarker(coords, { radius: markerSize(data.properties.mag) });
        },

        style: function (eqFeature) {
            return {
                fillColor: eqColor(eqFeature.properties.mag),
                fillOpacity: 0.7,
                weight: 0.1,
                color: 'black'

            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquakes);
    createMap(earthquakes);
});


/////////////////////////////////////////////////////////////////////////////////////////////
// An else-if function to discern feature color based on earthquake magnitude
/////////////////////////////////////////////////////////////////////////////////////////////

function eqColor(magnitude) {
    if (magnitude > 5) {
        return 'red'
    } else if (magnitude > 4) {
        return 'darkorange'
    } else if (magnitude > 3) {
        return 'tan'
    } else if (magnitude > 2) {
        return 'yellow'
    } else if (magnitude > 1) {
        return 'darkgreen'
    } else {
        return 'lightgreen'
    }
};

