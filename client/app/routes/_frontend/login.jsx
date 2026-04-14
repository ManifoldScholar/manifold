import { useTranslation } from "react-i18next";
import Login from "components/frontend/login";
import HeadContent from "components/global/HeadContent";

export default function LoginRoute() {
  const { t } = useTranslation();

  return (
    <>
      <HeadContent title={t("titles.login")} appendDefaultTitle />
      <Login isSignUp={false} />
    </>
  );
}
