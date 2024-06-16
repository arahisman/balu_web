const SET_THEME = 'SET_THEME';
const SET_LANG = 'SET_LANG';

const initialState = {
  theme: 'main',
  lang: 'Rus',
  user_list: [],
  first: true,
  sponsors: [],
};

export const app = (state = initialState, action) => {
  switch (action.type) {
    case SET_THEME:
      return {
        ...state,
        theme: action.payload.theme,
      };
    case 'SET_FIRST':
      return {
        ...state,
        first: action.payload.first,
      };
    case 'SET_USER_LIST':
      return {
        ...state,
        user_list: [...action.payload.user_list],
      };
    case 'SET_SPONSORS':
      return {
        ...state,
        sponsors: [...action.payload.sponsors],
      };
    case 'CLEAR_APP':
      state = initialState;
      return {...state};
    case SET_LANG:
      return {
        ...state,
        lang: action.payload.lang,
      };

    default:
      return state;
  }
};
