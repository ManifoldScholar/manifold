import { useTranslation } from "react-i18next";
import Login from "frontend/components/login";
import HeadContent from "global/components/HeadContent";

export default function LoginRoute() {
  const { t } = useTranslation();

  return (
    <>
      <HeadContent title={t("titles.login")} appendDefaultTitle />
      <Login isSignUp={false} />
    </>
  );
}
