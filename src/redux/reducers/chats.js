const SET_CHATS = "SET_CHATS";
const NEW_CHAT = "NEW_CHAT";
const SET_CHAT = "SET_CHAT";
const SEND_MESSAGE = "SEND_MESSAGE";
const ADD_MESSAGES = "ADD_MESSAGES";

const initialState = {
    chats: [],
    messages: {},
    new_messages: {},
    count: 0
};

export const chats = (state = initialState, action) => {
    switch (action.type) {
        case SET_CHATS:
            return {
                ...state,
                chats: action.payload.chats,
            };
        case 'CLEAR_CHATS':
            state = initialState;
            return {...state}
        case 'CLEAR':

            return {
                ...state,
                chats: [],
                messages: {},
                new_messages: {},
                count: 0
            };
        case NEW_CHAT:
            local_chats = state.chats? Object.assign(state.chats) : {};
            if (!local_chats.some(i => i._id == action.payload.chat)) {
                local_chats = [action.payload.chat, ...state.chats];
                return {
                    ...state,
                    chats: local_chats,
                };
            }

        case SET_CHAT:
            local_chats = state.chats ? Object.assign(state.chats) : {};
            local_chats[action.payload.chat_id] = action.payload.chat;
            return {
                ...state,
                chats: local_chats,
            };

        case ADD_MESSAGES:
            let local_chats = state.chats ? Object.assign(state.chats) : {};
            if(local_chats[action.payload.chat_id]){
                local_chats[action.payload.chat_id].last_msg_text=action.payload.message.text;
            }
            return {
                ...state,
                chats: local_chats,
            };
        case 'READ':
            return {
                ...state,
            };

        default:
            return state;
    }
};

