import { redirect } from "react-router";

export const loader = async ({ params }) => {
  throw redirect(`/groups/${params.id}/home`);
};
