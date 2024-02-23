'use strict';

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(async (position) => {
        let lat, lon, weather, air;

        try {
            lat = position.coords.latitude;
            lon = position.coords.longitude;

            const api_url = `/weather/${lat},${lon}`;
            const response = await fetch(api_url);
            const json = await response.json();
            console.log(json);

            weather = json.weather;
            air = json.air_quality.results[0].measurements[0];

            document.querySelector('#lat').textContent = lat.toFixed(2);
            document.querySelector('#lon').textContent = lon.toFixed(2);
            document.querySelector('#summary').textContent =
                weather.weather[0].main;
            document.querySelector('#temperature').textContent =
                weather.main.temp;

            document.querySelector('#aq_parameter').textContent = air.parameter;
            document.querySelector('#aq_value').textContent = air.value;
            document.querySelector('#aq_units').textContent = air.unit;
            document.querySelector('#aq_date').textContent = air.lastUpdated;
        } catch (error) {
            document.querySelector('#aq_value').textContent = 'NO READING';
            air = { value: -1 };
            console.log('something went wrong');
        }

        const data = { lat, lon, weather, air };

        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        };

        const db_response = await fetch('/api', options);
        const db_json = await db_response.json();
        console.log(db_json);
    });
} else {
    console.log('geolocation not available');
}
