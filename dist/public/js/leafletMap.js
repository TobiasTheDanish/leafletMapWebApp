var locations;
var markers = [];

fetch('/api/get-locations')
    .then((res) => res.json())
    .then((data) => locations = data)
    .finally(() => initMap(locations));

function initMap(locations) {

    var map = L.map('map');
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    if(locations === null || locations.length === 0) {
        navigator.geolocation.getCurrentPosition((position) => {
            let latlng = L.latLng(position.coords.latitude, position.coords.longitude);

            map.setView(latlng, 19);
        }, (err) => {
            console.log(err);

            map.setView([51.000001, 51.000001], 13);
        });
    } else {
        setMarkers(locations, map);
    }

    map.on('click', async (e) => {
        var {lat, lng} = map.mouseEventToLatLng(e.originalEvent); 
        const newLocations = postLocation(lat, lng, map);
        newLocations.then((data) => {
            setMarkers(data, map);
        }).catch((err) => {
            console.log("PostLocation() unsuccesfull. Error message: " + err.message);
        })
    });

    map.attributionControl.addAttribution()
}

async function postLocation(lat, lng) {
    return fetch("/api/new-location/",
        {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'lat': lat, 'long': lng })
        })
        .then(res => res.json())
        .then(data => data);
}

function setMarkers(locations, map) {
    if(markers !== null && markers.length > 0) {
        markers.forEach(marker => {
            marker.removeFrom(map);
        })
    }

    let maxLat = Number.MIN_VALUE;
    let maxLong = Number.MIN_VALUE;
    let minLat = Number.MAX_VALUE;
    let minLong = Number.MAX_VALUE;

    locations.forEach(async (location) => {
        minLat = Math.min(location.lat, minLat);
        minLong = Math.min(location.long, minLong);
        maxLat = Math.max(location.lat, maxLat);
        maxLong = Math.max(location.long, maxLong);

        let latlng = L.latLng(location.lat, location.long);
        
        var address = await getAddressFromLatLng(latlng.lat, latlng.lng);

        var marker = L.circleMarker(latlng);
        
        marker.bindPopup(
            `
            <div>
                <p><strong>${address.street} ${address.housenumber}</strong></p>
                <p>${address.postcode}, ${address.city}. ${address.country}</p>
            </div>
            `);

        markers.push(marker);

        marker.addTo(map);
    });

    const offset = 0.001;
    map.fitBounds([
        [(maxLat), (maxLong)],
        [(minLat), (minLong)]
    ], {
        maxZoom: 16.5,
        animate: false,
        padding: [offset, offset]
    });
}

async function getAddressFromLatLng(lat, lng) {
    return await fetch(`/api/address?lat=${lat}&long=${lng}`)
        .then(res => res.json())
        .then(data => data);
}