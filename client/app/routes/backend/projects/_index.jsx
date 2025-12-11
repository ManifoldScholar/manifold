import { redirect } from "react-router";

export const loader = () => {
  throw redirect("/backend/projects/all");
};
