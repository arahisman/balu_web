const initialState = {
  groups: [],
  chats: {},
};

export const groups = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_GROUPS':
      return {
        ...state,
        groups: action.payload.groups,
      };
    case 'CLEAR_GROUPS':
      state = initialState;
      return {...state};

    case 'NEW_GROUP':
      return {
        ...state,
        groups: [...state.groups, action.payload.group],
      };
    case 'SET_GROUP':
      let local_groups = state.groups ? Object.assign(state.groups) : [];
      local_groups[
        state.groups.findIndex(item => item._id == action.payload.group._id)
      ] = action.payload.group;
      return {
        ...state,
        groups: [...local_groups],
      };
    case 'SET_GROUP_CHATS':
      let local_chats = (state.chats && Object.assign(state.chats)) || {};
      local_chats[action.payload.id] = action.payload.chats;
      return {
        ...state,
        chats: {...local_chats},
      };
    case 'REMOVE_GROUP_CHAT':
      local_chats = (state.chats && Object.assign(state.chats)) || {};
      local_chats[action.payload.id] = local_chats[action.payload.id].filter((i)=>i._id!==action.payload.chat_id)
      return {
        ...state,
        chats: {...local_chats},
      };

    default:
      return state;
  }
};
