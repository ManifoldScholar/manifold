import React, { Component } from "react";
import PropTypes from "prop-types";
import Resource from "frontend/components/resource";
import lh from "helpers/linkHandler";
import * as Styled from "./styles";

export default class ResourceListThumbnails extends Component {
  static displayName = "ResourceList.Thumbnails";

  static propTypes = {
    resources: PropTypes.array
  };

  render() {
    if (!this.props.resources?.length > 0) return null;
    return (
      <Styled.Grid>
        {this.props.resources.map(resource => {
          const { projectSlug } = resource.attributes ?? {};
          return (
            <li key={resource.id}>
              <Styled.Link
                to={lh.link(
                  "frontendProjectResource",
                  projectSlug,
                  resource.attributes.slug
                )}
              >
                <Resource.Thumbnail
                  key={resource.id}
                  resource={resource}
                  showTitle
                />
              </Styled.Link>
            </li>
          );
        })}
      </Styled.Grid>
    );
  }
}
