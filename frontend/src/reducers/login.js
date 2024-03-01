import { LOGIN, LOGOUT, UPDATE_TOKENS } from "../constants/actionTypes";

const loginReducer = (state = { authData: null }, action) => {
  switch (action.type) {
    case LOGIN:
      localStorage.setItem("profile", JSON.stringify({ ...action?.data }));
      localStorage.setItem("userTokens", action?.data.tokens.toString());
      window.dispatchEvent(new Event('localStorageTokenUpdated'));
      return { ...state, authData: action?.data };

    case LOGOUT:
      localStorage.clear();
      return { ...state, authData: null };

    case UPDATE_TOKENS:
      if (state.authData) {
        const updatedProfile = { ...state.authData, tokens: action?.tokens };
        localStorage.setItem("profile", JSON.stringify(updatedProfile));
        localStorage.setItem("userTokens", action?.tokens.toString());
        window.dispatchEvent(new Event('localStorageTokenUpdated'));
        return { ...state, authData: updatedProfile };
      }

    default:
      return state;
  }
};
export default loginReducer;
