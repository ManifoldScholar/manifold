import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "global/components/atomic/Button";
import lh from "helpers/linkHandler";
import Share from "frontend/components/resource/Share";
import * as Styled from "frontend/components/resource/Preview/UserActions/styles";

const BUTTON_STYLE_PROPS = {
  size: "sm",
  shape: "lozenge",
  background: "neutral",
  lowercase: true
};

function ResourceCollectionPreviewUserActions({ resourceCollection }) {
  const { t } = useTranslation();

  const { title, slug, projectSlug } = resourceCollection.attributes;

  const detailUrl = lh.link(
    "frontendProjectResourceCollection",
    projectSlug,
    slug
  );

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
