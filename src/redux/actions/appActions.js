export function saveTheme(theme) {
    return {
        type: "SET_THEME",
        payload: {theme},
    };
}
export function saveFirst(first) {
     return {
         type: "SET_FIRST",
         payload: {first},
     };
 }

export function saveLang(lang) {
    return {
        type: "SET_LANG",
        payload: {lang},
    };
}

export function saveUserList(user_list) {
    return {
        type: "SET_USER_LIST",
        payload: {user_list},
    };
}

export function saveSponsors(sponsors) {
    console.log(sponsors)
    return {
        type: "SET_SPONSORS",
        payload: {sponsors},
    };
}

export function clearApp() {
    return {
        type: "CLEAR_APP",
    };
}
