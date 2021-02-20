import React, { Fragment, useEffect, useState, useCallback } from "react";
import { Box, Paper, TextField, Typography } from "@material-ui/core";
import { UserCard } from "../components/user-card";
import { getUsers } from "../services/github";

import { Subject, merge } from "rxjs";
import {
  map,
  tap,
  switchMap,
  debounceTime,
  distinctUntilChanged,
  catchError,
  pluck
} from "rxjs/operators";

function createController() {
  const mount$ = new Subject();
  const nameChanged$ = new Subject();

  const userName$ = nameChanged$.asObservable();

  const itemsData$ = userName$.pipe(
    debounceTime(1000),
    distinctUntilChanged(),
    switchMap((username) =>
      getUsers(username).catch(() => ({ items: [], total_count: 0 }))
    )
  );

  const users$ = itemsData$.pipe(
    map((data) => data.items ?? []),
    distinctUntilChanged()
  );
  const totalItems$ = itemsData$.pipe(
    map((data) => data.total_count ?? 0),
    distinctUntilChanged()
  );

  return {
    setName: (name) => nameChanged$.next(name),
    mount: () => mount$.next(),
    users$,
    totalItems$,
    userName$,
    unmount: () => {
      mount$.complete();
      nameChanged$.complete();
    }
  };
}

// const items$ = new Subject().pipe(
//   debounceTime(1000),
//   distinctUntilChanged(),
//   switchMap((username) => getUsers(username)),
//   catchError((error) => ({ items: [], count: 0 })),
//   map(({ items, total_count }) => ({ items, count: total_count }))
// );

// const username$ = new Subject().pipe(
//   map((e) => e.currentTarget.value),
//   tap((username) => items$.next(username))
// );

export const GitHubRxJs = () => {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const [rxController] = useState(createController);

  const onNameChanged = useCallback(
    (event) => rxController.setName(event.currentTarget.value),
    [rxController]
  );

  useEffect(() => {
    const { users$, totalItems$, userName$, mount, unmount } = rxController;

    const s1 = merge(
      userName$.pipe(tap((n) => setUsername(n))),
      totalItems$.pipe(tap((n) => setTotalItems(n))),
      users$.pipe(tap((u) => setUsers(u)))
    ).subscribe();

    mount();

    return () => {
      s1.unsubscribe();
      unmount();
    };
  }, [rxController]);

  return (
    <Fragment>
      <Paper>
        <Box p={2}>
          <TextField
            placeholder="Start typing username"
            onChange={onNameChanged}
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
