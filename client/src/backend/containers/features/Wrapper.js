import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate, Outlet, useParams } from "react-router-dom";
import { featuresAPI, requests } from "api";
import lh from "helpers/linkHandler";
import Layout from "backend/components/layout";
import PageHeader from "backend/components/layout/PageHeader";
import FrontendLayout from "frontend/components/layout";
import withConfirmation from "hoc/withConfirmation";
import { useFetch, useApiCallback, useNotification, useFromStore } from "hooks";
import Form from "global/components/form";
import Authorize from "hoc/Authorize";
import { entityStoreActions } from "actions";

const { flush } = entityStoreActions;

function FeatureDetailWrapper({ confirm }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: feature } = useFetch({
    request: [featuresAPI.show, id],
    options: { requestKey: requests.beFeature },
    condition: !!id
  });

  useEffect(() => {
    return () => dispatch(flush(requests.beFeature));
  }, [dispatch]);

  const session = useFromStore({
    path: "entityEditor.sessions.backend-feature-update"
  });

  const deleteFeature = useApiCallback(featuresAPI.destroy, {
    requestKey: requests.beFeatureDestroy,
    removes: feature
  });

  const notifyDestroy = useNotification(f => ({
    level: 0,
    id: `FEATURE_DESTROYED_${f.id}`,
    heading: t("notifications.feature_delete"),
    body: t("notifications.delete_record_body"),
    expiration: 3000
  }));

  const doDestroy = useCallback(async () => {
    if (!feature) return;
    try {
      await deleteFeature(feature.id);
      notifyDestroy(feature);
      navigate(lh.link("backendRecordsFeatures"));
    } catch {
      navigate(lh.link("backendRecordsFeatures"));
    }
  }, [deleteFeature, feature, notifyDestroy, navigate]);

  const handleDestroy = () => {
    if (!feature) return;
    const heading = t("modals.delete_feature");
    const message = t("modals.confirm_body");
    confirm(heading, message, doDestroy);
  };

  const utility = [
    {
      label: "actions.delete",
      icon: "delete32",
      onClick: handleDestroy
    }
  ];

  if (!feature) return null;

  return (
    <Authorize
      failureNotification={{
        body: t("records.features.preview.unauthorized_update")
      }}
      failureRedirect
      entity={feature}
      ability="update"
    >
      <PageHeader
        type="feature"
        backUrl={lh.link("backendRecordsFeatures")}
        backLabel={t("records.features.back_label")}
        title={
          feature.attributes.header ||
          t("records.features.preview.no_title", {
            position: feature.attributes.position
          })
        }
        actions={utility}
        icon="Lamp64"
      />
      <Layout.BackendPanel>
        <section>
          {session?.dirty?.attributes ? (
            <Form.FieldGroup
              label={t("records.features.preview.section_title")}
              instructions={t("records.features.preview.instructions")}
            >
              <FrontendLayout.Splash
                feature={feature}
                preview
                previewAttrs={session.dirty.attributes}
              />
            </Form.FieldGroup>
          ) : null}
          <Outlet
            context={{
              feature
            }}
          />
        </section>
      </Layout.BackendPanel>
    </Authorize>
  );
}

FeatureDetailWrapper.displayName = "Features.DetailWrapper";

export default withConfirmation(FeatureDetailWrapper);
