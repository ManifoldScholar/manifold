import { useTranslation } from "react-i18next";
import Login from "frontend/components/login";
import HeadContent from "global/components/HeadContent";

export default function SignUpRoute() {
  const { t } = useTranslation();

  return (
    <>
      <HeadContent title={t("titles.signup")} appendDefaultTitle />
      <Login isSignUp />
    </>
  );
}
