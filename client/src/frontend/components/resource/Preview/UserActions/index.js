import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "global/components/atomic/Button";
import lh from "helpers/linkHandler";
import DownloadOrExternalLink from "../../Link";
import Share from "../../Share";
import * as Styled from "./styles";

const BUTTON_STYLE_PROPS = {
  size: "sm",
  shape: "lozenge",
  background: "neutral",
  lowercase: true
};

function ResourcePreviewUserActions({
  resource,
  resourceCollection,
  hideDetailLink = false
}) {
  const { t } = useTranslation();

  const {
    kind,
    title,
    transcriptUrl,
    transcriptFileName,
    slug,
    projectSlug,
    downloadable
  } = resource.attributes;
  const { project } =
    resourceCollection?.relationships ?? resource.relationships;

  const detailUrl = resourceCollection
    ? lh.link(
        "frontendProjectCollectionResource",
        projectSlug,
        resourceCollection.attributes.slug,
        slug
      )
    : lh.link("frontendProjectResource", projectSlug, slug);

  return (
    <Styled.List>
      {!hideDetailLink && (
        <li>
          <Button
            as={Link}
            to={detailUrl}
            label={t("resources.cta_label")}
            preIcon="link24"
            {...BUTTON_STYLE_PROPS}
          />
        </li>
      )}
      {(kind === "link" || downloadable) && (
        <li>
          <DownloadOrExternalLink resource={resource} {...BUTTON_STYLE_PROPS} />
        </li>
      )}
      {transcriptUrl && transcriptFileName && (
        <li>
          <Button
            as="a"
            label={t("resources.new.transcript")}
            href={transcriptUrl}
            download={transcriptFileName}
            preIcon="download24"
            {...BUTTON_STYLE_PROPS}
          />
        </li>
      )}
      <li>
        <Share
          title={`${title} | ${project.attributes.title}`}
          {...BUTTON_STYLE_PROPS}
        />
      </li>
    </Styled.List>
  );
}

ResourcePreviewUserActions.displayName = "Resource.Preview.UserActions";

ResourcePreviewUserActions.propTypes = {
  resource: PropTypes.object.isRequired,
  resourceCollection: PropTypes.object,
  hideDetailLink: PropTypes.bool
};

export default ResourcePreviewUserActions;
