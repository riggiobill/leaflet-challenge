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


/////////////////////////////////////////////////////////////////////////////////////////////
// Standard function to build the map using Mapbox API calls, then adds in the 
// previous layers and data.
/////////////////////////////////////////////////////////////////////////////////////////////

function createMap() {

    /////////////////////////////////////////////////////////////////////////////////////////////
    // Map data
    /////////////////////////////////////////////////////////////////////////////////////////////

    var highContrastMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.high-contrast',
        accessToken: API_KEY
    });

    var streetMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: API_KEY
    });

    var darkMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.dark',
        accessToken: API_KEY
    });


    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: API_KEY
    });



    /////////////////////////////////////////////////////////////////////////////////////////////
    // Layer data
    /////////////////////////////////////////////////////////////////////////////////////////////

    var baseLayers = {
        "High Contrast": highContrastMap,
        "Street": streetMap,
        "Dark": darkMap,
        "Satellite": satellite
    };

    var overlays = {
        "Earthquakes": earthquakes
        //plate tectonics for optional
    };

    var myMap = L.map('map', {
        center: [40, -99],
        zoom: 4.3,
        layers: [streetMap, earthquakes]
    });

    // .addTo to affix the layers to the map
    L.control.layers(baseLayers, overlays).addTo(myMap);


    /////////////////////////////////////////////////////////////////////////////////////////////
    // Add a legend to the map with layer control for the layers
    /////////////////////////////////////////////////////////////////////////////////////////////


    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            eqMagnitude = [0, 1, 2, 3, 4, 5],
            labels = [];

        div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

        for (var i = 0; i < eqMagnitude.length; i++) {
            div.innerHTML +=
                '<i style="background:' + Color(eqMagnitude[i] + 1) + '"></i> ' +
                eqMagnitude[i] + (eqMagnitude[i + 1] ? '&ndash;' + eqMagnitude[i + 1] + '<br>' : '+');
        }

        return div;
    };
    // .addTo to add the layer to the map
    legend.addTo(myMap);
}