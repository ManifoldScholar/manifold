import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Form from "./Form";
import { requests } from "api";
import lh from "helpers/linkHandler";
import Layout from "backend/components/layout";

export default function MakersNew() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSuccess = maker => {
    const path = lh.link("backendRecordsMaker", maker.id);
    navigate(path, { keepNotifications: true });
  };

  return (
    <section>
      <Layout.DrawerHeader title={t("records.makers.new_header")} />
      <Form
        successHandler={handleSuccess}
        options={{ adds: requests.beMakers }}
      />
    </section>
  );
}

MakersNew.displayName = "Makers.New";
