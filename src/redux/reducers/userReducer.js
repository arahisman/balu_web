const initialState = {
  token: '',
  role: '',
  phone: '',
  id: '',
  first_name: '',
  last_name: '',
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case "USER_UPDATE": {
      return {
        ...state,
        ...action.payload,
      };
    }
    case "LOGOUT": {
      return {};
    }

    default:
      return state;
  }
};

export default user;
