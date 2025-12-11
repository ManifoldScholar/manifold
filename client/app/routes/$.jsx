import { data } from "react-router";

export const loader = () => {
  throw data(null, { status: 404 });
};

export default function CatchAll() {
  return null;
}
