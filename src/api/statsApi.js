import apiClient from './apiClient'


export const get_stats = async () => {
    let response = await apiClient().post('/statistics', {});
    return response;
};
export const get_stats_now = async () => {
    let response = await apiClient().post('/statistics_now', {});
    return response;
};

export const delete_all_stats = async () => {
    let response = await apiClient().post('/delete_all_stats', {});
    return response;
};









