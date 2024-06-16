const SET_CHATS = "SET_CHATS";
const NEW_CHAT = "NEW_CHAT";
const SET_CHAT = "SET_CHAT";
const SEND_MESSAGE = "SEND_MESSAGE";
const ADD_MESSAGES = "ADD_MESSAGES";

const initialState = {
  chats: [],
  messages: {},
  new_messages: {},
  count: 0,
};
let local_chats, messages, count, new_messages

export const chats = (state = initialState, action) => {
  switch (action.type) {
    case SET_CHATS:
      return {
        ...state,
        chats: action.payload.chats,
      };
    case "CLEAR_CHATS":
      state = initialState;
      return { ...state };
    case "CLEAR":
      return {
        ...state,
        chats: [],
        messages: {},
        new_messages: {},
        count: 0,
      };
    case NEW_CHAT:
      local_chats = state.chats ? Object.assign(state.chats) : {};
      if (!local_chats.some((i) => i._id == action.payload.chat)) {
        local_chats = [action.payload.chat, ...state.chats];
        let messages = state.messages ? Object.assign(state.messages) : {};
        messages[action.payload.chat._id] = [];
        return {
          ...state,
          chats: local_chats,
          messages,
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
      messages = state.messages;
      count = state.count ? Object.assign(state.count) : 0;
      count += action.payload.messages.length;
      new_messages = state.new_messages
        ? Object.assign(state.new_messages)
        : {};

      if (state.messages[action.payload.chat_id]) {
        let nm = state.messages[action.payload.chat_id].filter(
          (msg) => !action.payload.messages.some((l) => l._id == msg._id)
        );
        messages[action.payload.chat_id] = [...action.payload.messages, ...nm];
        if (new_messages[action.payload.chat_id]) {
          new_messages[action.payload.chat_id] +=
            action.payload.messages.length +
            nm.length -
            messages[action.payload.chat_id].length;
        } else {
          new_messages[action.payload.chat_id] =
            action.payload.messages.length +
            nm.length -
            messages[action.payload.chat_id].length;
        }
      } else {
        messages[action.payload.chat_id] = [...action.payload.messages];
        if (new_messages[action.payload.chat_id]) {
          new_messages[action.payload.chat_id] +=
            action.payload.messages.length;
        } else {
          new_messages[action.payload.chat_id] = action.payload.messages.length;
        }
      }
      action.payload.messages.forEach((mr) => {
        if (mr.oldId && mr.oldId.length) {
          messages[action.payload.chat_id].forEach((mmm) => {
            if (mmm._id === mr.oldId) {
              mmm.p = mr.p;
              messages[action.payload.chat_id] = [
                mmm,
                ...messages[action.payload.chat_id].filter(
                  (o) => o._id !== mr.oldId
                ),
              ];
            }
          });
        }
      });
      messages[action.payload.chat_id] = messages[action.payload.chat_id].sort(
        (b, a) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      return {
        ...state,
        messages: { ...messages },
        count,
        new_messages: { ...{}, ...new_messages },
      };
    case "READ":
      count = state.count || 0;
      new_messages = state.new_messages
        ? Object.assign(state.new_messages)
        : {};
      count -= new_messages[action.payload.chat_id];
      new_messages[action.payload.chat_id] = 0;
      return {
        ...state,
        count,
        new_messages: { ...{}, ...new_messages },
      };

    default:
      return state;
  }
};
