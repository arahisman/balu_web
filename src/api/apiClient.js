import axios from 'axios';

const apiClient = () => {
    const apiClient = axios.create({
        baseURL: 'http://45.9.43.60:3000',
        timeout: 8000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return apiClient;
};

export default apiClient;
