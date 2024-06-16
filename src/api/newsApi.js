import apiClient from './apiClient'


export const set_news = async (data) => {
    let response = await apiClient().post('/set_news', data);
    return response;
};
export const get_news = async () => {
    let response = await apiClient().get('/get_news');
    return response;
};
export const add_sponsor = async (data) => {
    let response = await apiClient().post("/add_sponsor", data);
    return response;
};

export const sponsors_list = async (data) => {
    let response = await apiClient().post("/sponsors_list", data);
    return response;
};

export const delete_sponsors_list = async (data) => {
    let response = await apiClient().post("/delete_sponsors_list", data);
    return response;
};








