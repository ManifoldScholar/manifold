import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import DownloadOrExternalLink from "../../Link";
import Share from "../../Share";
import * as Styled from "./styles";

function ResourcePreviewUserActions({ resource }) {
  const { title, slug } = resource.attributes;
  const { project } = resource.relationships;

  return (
    <Styled.Wrapper>
      <Link
        to={lh.link("frontendProjectResource", project.attributes.slug, slug)}
      >
        More info
      </Link>
      <DownloadOrExternalLink resource={resource} />
      <Share title={title} />
    </Styled.Wrapper>
  );
}

ResourcePreviewUserActions.displayName = "Resource.Preview.UserActions";

ResourcePreviewUserActions.propTypes = {
  resource: PropTypes.object.isRequired
};

export default ResourcePreviewUserActions;
