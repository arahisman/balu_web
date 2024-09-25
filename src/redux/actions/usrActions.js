export function saveLogged(logged) {
    return {
        type: "SET_LOGGED",
        payload: {logged},
    };
}

export function savePhone(phone) {
    return {
        type: "SET_PHONE",
        payload: {phone},
    };
}

export function saveCode(code) {
    return {
        type: "SET_CODE",
        payload: {code},
    };
}

export function saveUser(user) {
    return {
        type: "SET_USER",
        payload: {...user},
    };
}

export function clearUser(user) {
    return {
        type: "CLEAR_USER",
    };
}

export function saveFavorite(favorite) {
    return {
        type: "SET_FAVORITE",
        payload: {favorite},
    };
}
export function set_JWT(jwt) {
    return {
        type: "SET_JWT",
        payload: {jwt},
    };
}