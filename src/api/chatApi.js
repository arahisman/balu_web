import apiClient from "./apiClient";

export const new_chat = async (data) => {
    let response = await apiClient().post("/create_chat", data);
    return response;
};
export const new_group = async (data) => {
    let response = await apiClient().post("/create_group", data);
    return response;
};

export const update_chat = async (data) => {
    let response = await apiClient().post("/update_chat", data);
    return response;
};
export const update_group = async (data) => {
    let response = await apiClient().post("/update_group", data);
    return response;
};
export const get_chats = async () => {
    let response = await apiClient().get("/get_chats");
    return response;
};
export const new_msg = async (data) => {
    let response = await apiClient().post("/new_msg", data);
    return response;
};

export const get_messages = async (data) => {
    let response = await apiClient().post("/get_messages", data);
    return response;
};

export const get_new_msgs = async (data) => {
    let response = await apiClient().post("/get_new_msgs", data);
    return response;
};
export const get_users_chats = async (data) => {
    let response = await apiClient().post("/get_users_chats", data);
    return response;
};
export const get_groups_chats = async (data) => {
    let response = await apiClient().post("/get_groups_chats", data);
    return response;
};
export const get_users_groups = async (data) => {
    let response = await apiClient().post("/get_users_groups", data);
    return response;
};
export const exit_chat = async (data) => {
    let response = await apiClient().post("/exit_chat", data);
    return response;
};
export const exit_group = async (data) => {
    let response = await apiClient().post("/exit_group", data);
    return response;
};


