import React, { useState, useEffect } from "react";
import {
  Container,
  Grow,
  Paper,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import CoinToss from "../CoinToss/CoinToss";

const Home = () => {
  const [tosses, setTosses] = useState(() => {
    const savedTosses = localStorage.getItem("tosses");
    return savedTosses ? JSON.parse(savedTosses) : [];
  });
  const user = localStorage.getItem("profile")
    ? jwtDecode(JSON.parse(localStorage.getItem("profile")).token)
    : "null";
  const isSingedIn = user;

  useEffect(() => {
    localStorage.setItem("tosses", JSON.stringify(tosses));
  }, [tosses]);

  const handleResult = (result) => {
    setTosses((prevTosses) => [...prevTosses.slice(-9), result]);
    console.log("Result from CoinToss:", result);
  };

  return (
    <Grow in>
      <Container component="main" maxWidth="sm">
        <Paper elevation={3}>
          {isSingedIn !== "null" && isSingedIn !== null ? (
            <Stack spacing={5} alignItems={"center"} sx={{ paddingY: 5 }}>
              <Typography variant="h4" align="center" color="primary">
                {`Welcome ${user.name}`}
              </Typography>
              <CoinToss onResult={handleResult} />
              <List
                sx={{
                  maxHeight: "200px",
                  overflow: "auto",
                  border: "1px solid #ccc",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                {tosses.map((toss, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`Toss ${index + 1}: ${toss.outcome}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Stack>
          ) : (
            <Typography variant="h4" align="center" color="primary">
              Login to Play
            </Typography>
          )}
        </Paper>
      </Container>
    </Grow>
  );
};

export default Home;
