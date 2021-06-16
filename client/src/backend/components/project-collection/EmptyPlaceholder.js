import React, { Component } from "react";
import PropTypes from "prop-types";
import ContentPlaceholder from "global/components/ContentPlaceholder";

export default class ProjectCollectionEmptyPlaceholder extends Component {
  static displayName = "ProjectCollection.EmptyPlaceholder";

  static propTypes = {
    onShowNew: PropTypes.func.isRequired
  };

  get actions() {
    return [
      {
        title: "Create a collection",
        buttonProps: {
          onClick: this.props.onShowNew
        }
      }
    ];
  }

  render() {
    return (
      <ContentPlaceholder.Wrapper context="backend">
        <ContentPlaceholder.Title icon="booksOnShelfStrokeUnique">
          Ready to create a Project Collection?
        </ContentPlaceholder.Title>
        <ContentPlaceholder.Body>
          With Project Collections, you can take control of what appears on your
          Manifold Library homepage. Create custom groupings of Projects and
          change their order and visibility. You can handpick your collections
          and order them manually, or you can create Smart Collections that
          automatically update based on your filtering criteria.
        </ContentPlaceholder.Body>
        <ContentPlaceholder.Actions actions={this.actions} />
      </ContentPlaceholder.Wrapper>
    );
  }
}
