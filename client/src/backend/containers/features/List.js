import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { featuresAPI, requests } from "api";
import { useFetch, useApiCallback } from "hooks";
import EntitiesList, {
  Button,
  FeatureRow
} from "backend/components/list/EntitiesList";
import Authorize from "hoc/Authorize";

export default function FeaturesList() {
  const { t } = useTranslation();

  const { data: features, refresh } = useFetch({
    request: [featuresAPI.index],
    options: { requestKey: requests.beFeatures }
  });

  const updateFeature = useApiCallback(featuresAPI.update, {
    requestKey: requests.beFeatureUpdate,
    noTouch: true
  });

  const togglePublished = async feature => {
    if (!feature) return;
    await updateFeature(feature.id, {
      attributes: {
        live: !feature.attributes.live
      }
    });
    refresh();
  };

  if (!features) return null;

  return (
    <Authorize
      ability="update"
      entity={["feature"]}
      failureNotification={{
        body: t("errors.access_denied.authorization_admin_type", {
          type: "features"
        })
      }}
      failureRedirect
    >
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
            path={lh.link("backendRecordsFeatureNew")}
            type="add"
            text={t("records.features.button_label")}
            authorizedFor="feature"
          />
        ]}
      />
    </Authorize>
  );
}

FeaturesList.displayName = "Features.List";
