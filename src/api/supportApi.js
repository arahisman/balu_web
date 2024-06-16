import apiClient from "./apiClient";

export const create_support = async (data) => {

    let response = await apiClient().post("/create_support", data);
    return response;
};
export const get_users_supports = async (data) => {
    let response = await apiClient().post("/get_users_supports", data);
    return response;
};

export const get_all_supports = async (data) => {
    let response = await apiClient().post("/get_all_supports", data);
    return response;
};

export const get_supporters_tickets = async () => {
    let response = await apiClient().post("/get_supporters_tickets");
    return response;
};
export const update_support = async (data) => {

    let response = await apiClient().post("/update_support", data);
    return response;
};
