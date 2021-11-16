import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Resource from "frontend/components/resource";
import * as Styled from "./styles";

export default class ResourceListCards extends PureComponent {
  static displayName = "ResourceList.Cards";

  static propTypes = {
    resourceCollection: PropTypes.object,
    resources: PropTypes.array.isRequired,
    project: PropTypes.object.isRequired,
    pagination: PropTypes.object,
    paginationClickHandler: PropTypes.func,
    itemHeadingLevel: PropTypes.oneOf([2, 3, 4, 5, 6])
  };

  render() {
    const {
      resources,
      resourceCollection,
      project,
      itemHeadingLevel
    } = this.props;

    if (!resources) return null;

    return (
      <Styled.List>
        {this.props.resources.map(resource => {
          return (
            <Styled.Item key={resource.id}>
              <Resource.Card
                resourceCollection={resourceCollection}
                resource={resource}
                project={project}
                itemHeadingLevel={itemHeadingLevel}
              />
            </Styled.Item>
          );
        })}
      </Styled.List>
    );
  }
}
