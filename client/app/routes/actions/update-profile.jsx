import { meAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";

export const action = formAction({
  mutation: ({ data }) => meAPI.update(data),
  requireAuth: true
});
