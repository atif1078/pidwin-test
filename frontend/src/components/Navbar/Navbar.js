import React, { useState, useEffect } from "react";
import {
  AppBar,
  Typography,
  Toolbar,
  Avatar,
  Button,
  Stack,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import * as actionType from "../../constants/actionTypes";
import { styles } from "./styles";
import { useUser } from "../../context/UserContext";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(() => {
    const storedTokens = localStorage.getItem("userTokens");
    return storedTokens ? parseInt(storedTokens, 10) : 100;
  });
  const dispatch = useDispatch();
  let location = useLocation();
  const history = useNavigate();

  const logout = () => {
    dispatch({ type: actionType.LOGOUT });
    history("/auth");
    setUser("null");
    localStorage.removeItem("userTokens");
    window.dispatchEvent(new Event("localStorageTokenUpdated"));
  };

  useEffect(() => {
    const profile = localStorage.getItem("profile");
    if (profile) {
      const decodedToken = jwtDecode(JSON.parse(profile).token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        logout();
      } else {
        setUser(decodedToken);
        const storedTokens = localStorage.getItem('userTokens');
        if (storedTokens) {
          setTokens(parseInt(storedTokens, 10));
        }
      }
    }

    const tokenUpdateListener = () => {
      const updatedTokens =
        parseInt(localStorage.getItem("userTokens"), 10) || 100;
      setTokens(updatedTokens);
    };

    window.addEventListener("localStorageTokenUpdated", tokenUpdateListener);

    return () => {
      window.removeEventListener(
        "localStorageTokenUpdated",
        tokenUpdateListener
      );
    };
  }, [location]);

  return (
    <AppBar sx={styles.appBar} position="static" color="inherit">
      <div sx={styles.brandContainer}>
        <Typography
          component={Link}
          to="/"
          sx={styles.heading}
          variant="h5"
          align="center"
        >
          CoinToss
        </Typography>
      </div>
      <Toolbar sx={styles.toolbar}>
        {user !== "null" && user !== null ? (
          <div sx={styles.profile}>
            <Stack direction={"row"} spacing={1}>
              <Avatar sx={styles.purple} alt={user.name} src={user.picture}>
                {user.name.charAt(0)}
              </Avatar>
              <Typography sx={styles.userName} variant="h6">
                {user.name}
              </Typography>
            </Stack>
            <Typography variant="h6">Tokens: {tokens}</Typography>
            <Button
              variant="contained"
              sx={styles.logout}
              color="secondary"
              onClick={logout}
            >
              Logout
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                history("/password");
              }}
            >
              Set Password
            </Button>
          </div>
        ) : (
          <Button
            component={Link}
            to="/auth"
            variant="contained"
            color="primary"
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
