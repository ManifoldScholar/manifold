import { passwordsAPI } from "api";
import formAction from "lib/react-router/helpers/formAction";

export const action = formAction({
  mutation: ({ data }) => passwordsAPI.create(data)
});
