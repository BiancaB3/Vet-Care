
import axios from 'axios';

// Create an Axios instance with the backend base URL
export const api = axios.create({
	baseURL: 'http://localhost:8080',
	headers: {
		'Content-Type': 'application/json',
	},
});

