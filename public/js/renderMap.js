maptilersdk.config.apiKey = mapTilerToken;
let coordinates = [];
if (campground) {
    coordinates = [campground.geometry.coordinates[0], campground.geometry.coordinates[1]];
} else {
    coordinates = [68.33337541669607, 25.395392392670566];
}

const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.STREETS,
    center: coordinates,
    zoom: 11,
});

// Just add a simple marker - no sources, no layers, no bullshit
new maptilersdk.Marker()
    .setLngLat(coordinates)
    .addTo(map);