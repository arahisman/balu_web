import apiClient from "./apiClient";

export const ask_q = async (data) => {
    let response = await apiClient().post("/ask_q", data);
    return response;
};

export const get_qs = async () => {
    let response = await apiClient().post("/get_qs");
    return response;
};

export const answer_q = async (data) => {
    let response = await apiClient().post("/answer_q", data);
    return response;
};

export const find_q = async (data) => {
    let response = await apiClient().post("/find_q", data);
    return response;
};

export const update_support = async (data) => {
    let response = await apiClient().post("/update_support", data);
    return response;
};
