import { LOGIN, LOGOUT, UPDATE_TOKENS } from "../constants/actionTypes";

const loginReducer = (state = { authData: null }, action) => {
  switch (action.type) {
    case LOGIN:
      localStorage.setItem("profile", JSON.stringify({ ...action?.data }));
      return { ...state, authData: action?.data };

    case LOGOUT:
      localStorage.clear();
      return { ...state, authData: null };

    case UPDATE_TOKENS:
      if (state.authData) {
        const updatedProfile = { ...state.authData, tokens: action?.tokens };
        localStorage.setItem("profile", JSON.stringify(updatedProfile));
        return { ...state, authData: updatedProfile };
      }

    default:
      return state;
  }
};
export default loginReducer;
