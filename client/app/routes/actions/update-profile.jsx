import { meAPI } from "api";
import formAction from "lib/react-router/helpers/formAction";

export const action = formAction({
  mutation: ({ data }) => meAPI.update(data),
  requireAuth: true
});
