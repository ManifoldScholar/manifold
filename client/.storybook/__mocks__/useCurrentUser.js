import { fixtures } from "helpers/storybook/exports";

export default function useCurrentUser() {
  console.log("mocked!");
  const { attributes } = fixtures.factory("user");
  return attributes;
}
