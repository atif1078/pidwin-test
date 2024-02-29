import { LOGIN, LOGOUT, UPDATE_TOKENS } from "../constants/actionTypes";
import * as api from "../api";
import * as messages from "../messages";
import { jwtDecode } from "jwt-decode";

export const signup = (formData, history) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);
    dispatch({ type: LOGIN, data });
    history("/");
    messages.success("Login Successful");
  } catch (error) {
    messages.error(error.response.data.message);
  }
};

export const login = (formData, history) => async (dispatch) => {
  try {
    const { data } = await api.login(formData);
    dispatch({ type: LOGIN, data });
    history("/");
    messages.success("Login Successful");
  } catch (error) {
    messages.error(error.response.data.message);
  }
};

export const changePassword = (formData, history) => async (dispatch) => {
  try {
    const { data } = await api.changePassword(formData);
    dispatch({ type: LOGOUT, data });
    messages.success("Password Change Was Successful");
    history("/");
  } catch (error) {
    messages.error(error.response.data.message);
  }
};

export const tossCoin = (formData) => async (dispatch) => {
  try {
    const storedProfile = localStorage.getItem("profile");
    const profile = storedProfile ? JSON.parse(storedProfile) : null;
    const token = profile?.token;
    const decodedToken = token && typeof token === 'string' ? jwtDecode(token) : null;
    const dataToSend = { ...formData, userId: decodedToken?._id };
    const { data } = await api.tossCoin(dataToSend);
    dispatch({ type: UPDATE_TOKENS, tokens: data.userTokens });
    messages.success("Coin Tossed Successfully");
    return data;
  } catch (error) {
    messages.error(error.response.data.message);
    throw error;
  }
};
