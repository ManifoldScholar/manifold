import PropTypes from "prop-types";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import Button from "components/global/atomic/Button";
import Share from "components/frontend/resource/Share";
import * as Styled from "components/frontend/resource/Preview/UserActions/styles";

const BUTTON_STYLE_PROPS = {
  size: "sm",
  shape: "lozenge",
  background: "neutral",
  lowercase: true
};

function ResourceCollectionPreviewUserActions({ resourceCollection }) {
  const { t } = useTranslation();

  const { title, slug, projectSlug } = resourceCollection.attributes;

  const detailUrl = `/projects/${projectSlug}/resource-collections/${slug}`;

  return (
    <Styled.List>
      <li>
        <Button
          as={Link}
          to={detailUrl}
          label={t("resources.cta_label")}
          preIcon="link24"
          {...BUTTON_STYLE_PROPS}
        />
      </li>
      <li>
        <Share title={title} uri={detailUrl} {...BUTTON_STYLE_PROPS} />
      </li>
    </Styled.List>
  );
}

ResourceCollectionPreviewUserActions.displayName =
  "ResourceCollection.Preview.UserActions";

ResourceCollectionPreviewUserActions.propTypes = {
  resourceCollection: PropTypes.object.isRequired
};

export default ResourceCollectionPreviewUserActions;
