import React, { useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Stack,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { UPDATE_TOKENS } from "../../constants/actionTypes";
import { tossCoin } from "../../actions/login";
import { useUser } from "../../context/UserContext";

const CoinToss = ({ onResult }) => {
  const [wager, setWager] = useState(1);
  const [choice, setChoice] = useState("Heads");
  const dispatch = useDispatch();
  const { setTokens } = useUser();

  const handleWagerChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 1) {
      setWager(value);
    } else {
      setWager(1);
    }
  };

  const handleSubmit = async () => {
    try {
      const storedProfile = localStorage.getItem("profile");
      const profile = storedProfile ? JSON.parse(storedProfile) : null;
      const token = profile?.token;
      const decodedToken =
        token && typeof token === "string" ? jwtDecode(token) : null;
      const userId = decodedToken?._id;
      if (!userId) {
        console.error("User ID not found");
        return;
      }

      const data = await dispatch(tossCoin({ userId, wager, choice }));
      onResult(data);
      setTokens(data.userTokens);
      console.log("Coin toss response:", data);
      console.log("Coin toss:", data.userTokens);
      if (data.winStreak === 3 || data.winStreak === 5) {
        alert(`Bonus payout! You won ${data.winStreak === 3 ? '3x' : '10x'} your wager!`);
      }
      dispatch({ type: UPDATE_TOKENS, tokens: data.userTokens });
    } catch (error) {
      console.error("Error during coin toss:", error.response.data.message);
    }
  };

  return (
    <Stack direction={"row"} justifyContent={"center"} alignItems={"center"}>
      <TextField
        sx={{
          marginRight: 2,
        }}
        label="Wager"
        type="number"
        value={wager}
        onChange={handleWagerChange}
      />
      <FormControl>
        <RadioGroup
          row
          value={choice}
          onChange={(e) => setChoice(e.target.value)}
        >
          <FormControlLabel value="Heads" control={<Radio />} label="Heads" />
          <FormControlLabel value="Tails" control={<Radio />} label="Tails" />
        </RadioGroup>
      </FormControl>
      <Button onClick={handleSubmit} variant="contained" color="secondary">
        Toss
      </Button>
    </Stack>
  );
};

export default CoinToss;
