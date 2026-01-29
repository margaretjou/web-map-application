mapboxgl.accessToken =
    'pk.eyJ1IjoibWpvdSIsImEiOiJjbWh5ZWZ6N2gwYWluMmptdTVlczZ5NXEzIn0.Ha9WIGJy4xJyUiZSR5xbNg';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 3.5, // starting zoom
    minZoom: 1, // minimum zoom level of the map
    center: [-100, 40], // starting center
    projection: 'albers'
});
const grades = [0, 1000, 5000, 10000, 50000, 100000],
            colors = ['#fef0d9','#fdd49e','#fdbb84','#fc8d59','#e34a33','#b30000'],
            radii = [3, 5, 10, 15, 20, 25];
        //load data to the map as new layers.
        //map.on('load', function loadingData() {
        map.on('load', () => { //simplifying the function statement: arrow with brackets to define a function
            // when loading a geojson, there are two steps
            // add a source of the data and then add the layer out of the source
            map.addSource('covidCounts', {
                type: 'geojson',
                data: 'assets/us-covid-2020-counts.json'
            });
            map.addLayer({
                'id': 'covidCounts-point',
                'type': 'circle',
                'source': 'covidCounts',
                'minzoom': 3,
                'paint': {
                    // increase the radii of the circle as cases value increases
                    'circle-radius': {
                        'property': 'cases',
                        'stops': [
                            [grades[0], radii[0]],
                            [grades[1], radii[1]],
                            [grades[2], radii[2]],
                            [grades[3], radii[3]],
                            [grades[4], radii[4]],
                            [grades[5], radii[5]]
                        ]
                    },
                    // change the color of the circle as cases value increases
                    'circle-color': {
                        'property': 'cases',
                        'stops': [
                            [grades[0], colors[0]],
                            [grades[1], colors[1]],
                            [grades[2], colors[2]],
                            [grades[3], colors[3]],
                            [grades[4], colors[4]],
                            [grades[5], colors[5]]
                        ]
                    },
                    'circle-stroke-color': 'white',
                    'circle-stroke-width': 1,
                    'circle-opacity': 0.9
                }
            });
            // click on tree to view magnitude in a popup
            map.on('click', 'covidCounts-point', (event) => {
                new mapboxgl.Popup()
                    .setLngLat(event.features[0].geometry.coordinates)
                    .setHTML(`<strong>Cases:</strong> ${event.features[0].properties.cases}`)
                    .addTo(map);
            });
        });
        // create legend
        const legend = document.getElementById('legend');
        // set up legend grades and labels (show ranges covered by each circle)
        var labels = ['<strong>COVID-19 Case Counts</strong>'],
            vbreak;
        // iterate through grades and create a scaled circle and a range label for each
        for (var i = 0; i < grades.length; i++) {
            vbreak = grades[i];
            // build a human-friendly range label
            var rangeLabel;
            if (i === 0) {
                rangeLabel = '< ' + grades[0].toLocaleString();
            } else if (i < grades.length - 1) {
                rangeLabel = grades[i].toLocaleString() + ' - ' + grades[i + 1].toLocaleString();
            } else {
                rangeLabel = '≥ ' + grades[i].toLocaleString();
            }

            // Creates a dot and label for each circle size
            for (var i = 0; i < grades.length; i++) {
                let lower = grades[i];
                let upper = grades[i + 1] ? grades[i + 1] - 1 : null; // next grade minus 1
                let rangeLabel = upper ? `${lower.toLocaleString()} – ${upper.toLocaleString()}` : `≥ ${lower.toLocaleString()}`;
                
                let dot_radii = 13 + radii[i];
                labels.push(
                    '<p class="break" style="display: flex; align-items: center; margin-bottom: 4px;">' +
                        '<i class="dot" style="background:' + colors[i] + 
                        '; width: ' + dot_radii + 'px; height: ' + dot_radii + 'px; border-radius: 50%; margin-right: 8px;"></i>' +
                        '<span class="dot-label">' + rangeLabel + '</span>' +
                    '</p>'
                );
            }
        }
        // combine all the html codes.
        legend.innerHTML = labels.join('');