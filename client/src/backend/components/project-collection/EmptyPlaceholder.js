import React, { Component } from "react";
import PropTypes from "prop-types";
import ContentPlaceholder from "global/components/ContentPlaceholder";
import IconComposer from "global/components/utility/IconComposer";
import classnames from "classnames";

export default class ProjectCollectionEmptyPlaceholder extends Component {
  static displayName = "ProjectCollection.EmptyPlaceholder";

  static propTypes = {
    onShowNew: PropTypes.func.isRequired
  };

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
        <ContentPlaceholder.Actions>
          <button
            className="button-icon-secondary"
            onClick={this.props.onShowNew}
          >
            <IconComposer
              icon="plus16"
              size={20}
              iconClass={classnames(
                "button-icon-secondary__icon",
                "button-icon-secondary__icon--large"
              )}
            />
            <span>{"Create a Collection"}</span>
          </button>
        </ContentPlaceholder.Actions>
      </ContentPlaceholder.Wrapper>
    );
  }
}
