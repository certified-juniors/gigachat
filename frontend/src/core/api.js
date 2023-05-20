import axios from 'axios';

let token;

const api = axios.create({
    baseURL: 'http://62.217.177.150:8082/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// return string
export async function getHi() {
    const response = await api.get('/hi');
    return response.data;
}