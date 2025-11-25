import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import lh from "helpers/linkHandler";
import PageHeader from "backend/components/layout/PageHeader";
import Layout from "backend/components/layout";
import Authorize from "hoc/Authorize";
import Properties from "backend/components/feature/Properties";

export default function FeaturesNew() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSuccess = feature => {
    const path = lh.link("backendRecordsFeature", feature.id);
    navigate(path);
  };

  return (
    <Authorize
      failureNotification={{
        body: t("records.features.preview.unauthorized_create")
      }}
      failureRedirect
      entity="feature"
      ability="create"
    >
      <PageHeader
        type="feature"
        backUrl={lh.link("backendRecordsFeatures")}
        backLabel={t("records.features.back_label")}
        title={t("records.features.new_header")}
        note={t("records.features.new_instructions")}
        icon="Lamp64"
      />
      <Layout.BackendPanel>
        <Properties onSuccess={handleSuccess} />
      </Layout.BackendPanel>
    </Authorize>
  );
}

FeaturesNew.displayName = "Features.New";
