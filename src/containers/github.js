import React, { Fragment, useEffect, useState } from "react";
import { Box, Paper, TextField, Typography } from "@material-ui/core";
import { UserCard } from "../components/user-card";
import { getUsers } from "../services/github";

export const GitHub = () => {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (!username) {
      setUsers([]);
      return;
    }
    getUsers(username).then((res) => {
      const { items, total_count } = res;
      setUsers(items);
      setTotalItems(total_count);
    });
  }, [username]);

  return (
    <Fragment>
      <Paper>
        <Box p={2}>
          <TextField
            placeholder="Start typing username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <Typography>Total items: {totalItems}</Typography>
        </Box>
      </Paper>

      <Box m={2}>
        {users.map((user) => (
          <Box key={user.id} m={2}>
            <UserCard key={user.id} user={user} />
          </Box>
        ))}
      </Box>
    </Fragment>
  );
};
