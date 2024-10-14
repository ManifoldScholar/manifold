import React from "react";
import { usersAPI } from "api";
import { useFetch } from "hooks";

export default function UserActivity({ user }) {
  const { data: annotations } = useFetch({
    request: [usersAPI.annotations, user.id]
  });
  const { data: rgMemberships } = useFetch({
    request: [usersAPI.annotations, user.id]
  });
  return (
    <>
      <div>{JSON.stringify(rgMemberships)}</div>
      <div>{JSON.stringify(annotations)}</div>
    </>
  );
}
