import axios from 'axios';
import config from '../config';
import {store} from '../store';

const apiClient = () => {
    const state = store.getState();
    let usr = state.usr;
    console.log(usr.jwt)
    const apiClient = axios.create({
        baseURL: config.baseURL,
        timeout: 8000,
        headers: {
            'Content-Type': 'application/json',
            'authorization':usr.jwt
        },
    });

    return apiClient;
};

export default apiClient;
