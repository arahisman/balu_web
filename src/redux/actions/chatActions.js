export function setChats(chats) {
    return {
        type: "SET_CHATS",
        payload: {chats},
    };
}

export function clearMessages() {
    return {
        type: "CLEAR_CHATS",
    };
}

export function newChat(chat) {
    return {
        type: "NEW_CHAT",
        payload: {chat},
    };
}

export function addMessages(chat_id, messages) {
    return {
        type: "ADD_MESSAGES",
        payload: {chat_id, messages},
    };
}

export function read(chat_id) {
    return {
        type: "READ",
        payload: {chat_id},
    };
}

export function setChat(chat, chat_id) {
    return {
        type: "SET_CHAT",
        payload: {chat, chat_id},
    };
}

export function setGroups(groups) {
    return {
        type: "SET_GROUPS",
        payload: {groups},
    };
}
export function clearGroups() {
    return {
        type: "CLEAR_GROUPS",
    };
}
export function addGroup(group) {
    return {
        type: "NEW_GROUP",
        payload: {group},
    };
}
export function updateGroup(group) {
    return {
        type: "SET_GROUP",
        payload: {group},
    };
}
export function setGroupChats(chats, id) {
    return {
        type: "SET_GROUP_CHATS",
        payload: {chats, id},
    };
}
export function removeGroupChats(chat_id, id) {
    return {
        type: "REMOVE_GROUP_CHAT",
        payload: {chat_id, id},
    };
}

