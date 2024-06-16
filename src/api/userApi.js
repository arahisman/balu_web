import apiClient from './apiClient'


export const check_code = async (data) => {
    let response = await apiClient().post('/check_code', data);
    return response;
};
export const auth = async (data) => {
    let response = await apiClient().post('/auth', data);
    return response;
};
export const check_phone_reg = async (data) => {
    let response = await apiClient().post('/check_phone_reg', data);
    return response;
};
export const check_phone_auth = async (data) => {
    let response = await apiClient().post('/check_phone_auth', data);
    return response;
};
export const sign_up = async (data) => {
    let response = await apiClient().post('/sign_up', data);
    return response;
};
export const call = async (data) => {
    let response = await apiClient().post('/start_call', data);
    return response;
};

export const updateCall = async (data) => {
    let response = await apiClient().post('/update_call', data);
    return response;
};

export const getCalls = async (data) => {
    let response = await apiClient().post('/get_users_calls', data);
    return response;
};

export const get_users = async () => {
    let response = await apiClient().get('/get_users');
    return response;
};
export const update_user = async (data) => {
    let response = await apiClient().post('/update_user', data);
    return response;
};
export const add_device = async (data) => {
    let response = await apiClient().post('/add_device', data);
    return response;
};
export const set_fb_token = async (data) => {
    let response = await apiClient().post('/set_fb_token', data);
    return response;
};
export const get_user = async (data) => {
    let response = await apiClient().post('/get_user', data);
    return response;
};
export const is_user_exist = async (data) => {
    let response = await apiClient().post('/is_user_exist', data);
    return response;
};
export const set_admin = async (data) => {
    let response = await apiClient().post('/set_admin', data);
    return response;
};
export const online_count = async (data) => {
    let response = await apiClient().get('/send-event');
    return response;
};






