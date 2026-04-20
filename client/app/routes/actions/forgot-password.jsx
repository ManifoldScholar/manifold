import { passwordsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";

export const action = formAction({
  mutation: ({ data }) => passwordsAPI.create(data)
});
