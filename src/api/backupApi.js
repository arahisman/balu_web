import apiClient from "./apiClient";

export const save_backup = async (data) => {
    let response = await apiClient().post("/save_backup", data);
    return response;
};

export const is_backup_ready = async (data) => {
    let response = await apiClient().post("/is_backup_ready", data);
    return response;
};

export const get_backups = async (data) => {
    let response = await apiClient().post("/get_backups", data);
    return response;
};


