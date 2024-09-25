const SET_USER = "SET_USER";
const SET_LOGGED = "SET_LOGGED";
const SET_PHONE = "SET_PHONE";
const SET_CODE = "SET_CODE";

const initialState = {
    _id: "",
    phone: "",
    name: "",
    role: "",
    points: 0,
    photo: "",
    status: "A",
    bot_key: "",
    black_list: [],
    chat_list: [],
    code: "",
    logged: false,
    favorite: [],
    jwt:""
};

export const usr = (state = initialState, action) => {
    switch (action.type) {
        case SET_CODE:
            return {
                ...state,
                code: action.payload.code,
            };
        case 'SET_FAVORITE':
                    return {
                        ...state,
                        favorite: action.payload.favorite,
                    };
        case SET_PHONE:
            return {
                ...state,
                phone: action.payload.phone,
            };
        case SET_USER:
            return {
                ...state,
                ...action.payload,
            };
        case SET_LOGGED:
            return {
                ...state,
                logged: action.payload.logged,
            };
        case 'CLEAR_USER':
            state = initialState;
            return {...state}
        case 'SET_JWT':
            return{
                ...state,
                jwt: action.payload.jwt
            }    
        default:
            return state;
    }
};

