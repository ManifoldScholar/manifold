import { useTranslation } from "react-i18next";
import { useRevalidator } from "react-router";
import { featuresAPI } from "api";
import loadList from "app/routes/utility/loaders/loadList";
import { useApiCallback } from "hooks";
import EntitiesList, {
  Button,
  FeatureRow
} from "components/backend/list/EntitiesList";

export const loader = async ({ request, context }) => {
  return loadList({ request, context, fetchFn: featuresAPI.index });
};

export default function FeaturesListRoute({ loaderData }) {
  const { t } = useTranslation();
  const { revalidate } = useRevalidator();
  const updateFeature = useApiCallback(featuresAPI.update);

  const togglePublished = async feature => {
    if (!feature) return;
    await updateFeature(feature.id, {
      attributes: {
        live: !feature.attributes.live
      }
    });
    revalidate();
  };

  const { data: features } = loaderData;

  return (
    <EntitiesList
      title={t("records.features.header")}
      titleStyle="bar"
      entityComponent={FeatureRow}
      entityComponentProps={{
        onTogglePublish: togglePublished
      }}
      entities={features}
      buttons={[
        <Button
          key="new"
          path="/backend/records/features/new"
          type="add"
          text={t("records.features.button_label")}
          authorizedFor="feature"
        />
      ]}
    />
  );
}
