import { useState } from "react";
import { useNavigate, useFetcher } from "react-router";
import { useTranslation } from "react-i18next";
import { featuresAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import formAction from "app/routes/utility/helpers/formAction";
import Layout from "components/backend/layout";
import Dialog from "components/global/dialog";
import Form from "components/global/form";
import FrontendLayout from "components/frontend/layout";
import PageHeader from "components/backend/layout/PageHeader";
import Properties from "components/backend/feature/Properties";
import { useApiCallback, useConfirmation, useNotifications } from "hooks";

export const loader = async ({ params, context, request }) => {
  return loadEntity({
    context,
    fetchFn: () => featuresAPI.show(params.id),
    request
  });
};

export const action = formAction({
  mutation: ({ data, params }) => featuresAPI.update(params.id, data)
});

export default function FeaturePropertiesRoute({ loaderData: feature }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const { confirm, confirmation } = useConfirmation();
  const [dirtyModel, setDirtyModel] = useState(null);
  const dirtyAttrs = dirtyModel?.attributes;

  const deleteFeature = useApiCallback(featuresAPI.destroy);
  const { addNotification } = useNotifications();

  const handleDestroy = () => {
    confirm({
      heading: t("modals.delete_feature"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        try {
          await deleteFeature(feature.id);
          addNotification({
            level: 0,
            id: `FEATURE_DESTROYED_${feature.id}`,
            heading: t("notifications.feature_delete"),
            body: t("notifications.delete_record_body"),
            expiration: 3000
          });
          closeDialog();
          navigate("/backend/records/features");
        } catch {
          closeDialog();
          navigate("/backend/records/features");
        }
      }
    });
  };

  const utility = [
    {
      label: "actions.delete",
      icon: "delete32",
      onClick: handleDestroy
    }
  ];

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <PageHeader
        type="feature"
        backUrl="/backend/records/features"
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
          <Form.FieldGroup
            label={t("records.features.preview.section_title")}
            instructions={t("records.features.preview.instructions")}
          >
            <FrontendLayout.Splash
              feature={feature}
              preview
              previewAttrs={dirtyAttrs}
            />
          </Form.FieldGroup>
          <Properties
            feature={feature}
            fetcher={fetcher}
            onDirty={setDirtyModel}
          />
        </section>
      </Layout.BackendPanel>
    </>
  );
}
