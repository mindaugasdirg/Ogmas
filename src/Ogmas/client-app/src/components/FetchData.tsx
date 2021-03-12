import React from 'react';
import { getAccessToken } from '../clients/AuthorizationClient';

interface Forecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

export const FetchData = () => {
    const [forecasts, setForecasts] = React.useState<Forecast[]>([]);
    const [loading, setLoading] = React.useState(true);

    const populateWeatherData = async () => {
        const token = await getAccessToken();
        const headers = !token ? undefined : { 'Authorization': `Bearer ${token}` };
        const response = await fetch('weatherforecast', { headers });
        const data = await response.json();
        setForecasts(data);
        setLoading(false);
    };

    React.useEffect(() => { populateWeatherData() }, []);

    const renderForecastsTable = (forecasts: Forecast[]) => {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Temp. (C)</th>
                        <th>Temp. (F)</th>
                        <th>Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {forecasts.map(forecast =>
                        <tr key={forecast.date}>
                            <td>{forecast.date}</td>
                            <td>{forecast.temperatureC}</td>
                            <td>{forecast.temperatureF}</td>
                            <td>{forecast.summary}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    };

    let contents = loading
        ? <p><em>Loading...</em></p>
        : renderForecastsTable(forecasts);

    return (
        <div>
            <h1 id="tabelLabel" >Weather forecast</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents}
        </div>
    );
};