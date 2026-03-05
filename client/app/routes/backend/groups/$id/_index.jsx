import { redirect } from "react-router";

export const loader = ({ params }) => {
  throw redirect(`/backend/groups/${params.id}/details`);
};
