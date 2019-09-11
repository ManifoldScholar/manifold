import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Utility from "global/components/utility";
import lh from "helpers/linkHandler";
import has from "lodash/has";

export default class ProjectContentBlockIncomplete extends PureComponent {
  static displayName = "Project.Content.Block.Incomplete";

  static propTypes = {
    block: PropTypes.object
  };

  get block() {
    return this.props.block;
  }

  get projectId() {
    return this.block.relationships.project.id;
  }

  get blockErrors() {
    return this.block.attributes.incompleteRenderAttributes;
  }

  get presentBlockErrors() {
    const errors = this.blockErrors
      .map(key => {
        const error = this.lookupError(key);
        if (!error) return null;
        return <span key={key}>{error}</span>;
      })
      .filter(Boolean);
    if (errors.length > 0) return errors;
    return [this.defaultError];
  }

  get defaultError() {
    return (
      <span>
        <Link to={this.blockEditLink}>Fix this content block.</Link>
      </span>
    );
  }

  get blockType() {
    return this.block.attributes.type;
  }

  get blockEditLink() {
    return lh.link("backendProjectContentBlock", this.projectId, this.block.id);
  }

  get availableErrors() {
    return {
      "Content::TableOfContentsBlock": {
        text: (
          <>
            Specify a text to{" "}
            <Link to={this.blockEditLink}>fix this block</Link>.
          </>
        )
      },
      "Content::RecentActivityBlock": {
        has_activity: (
          <>
            No activity has been recorded for this project. This warning will
            disappear once there is project activity.
          </>
        )
      },
      "Content::MarkdownBlock": {
        body: (
          <>
            Add Markdown content to{" "}
            <Link to={this.blockEditLink}>fix this block</Link>.
          </>
        )
      },
      "Content::TextsBlock": {
        texts: (
          <>
            <Link to={this.projectEditLink("backendProjectTexts")}>
              Add texts to the project
            </Link>{" "}
            or{" "}
            <Link to={this.blockEditLink}>adjust the block configuration</Link>{" "}
            to fix this block.
          </>
        )
      },
      "Content::ResourcesBlock": {
        resources_or_collections: (
          <>
            Add{" "}
            <Link to={this.projectEditLink("backendProjectResources")}>
              resources
            </Link>{" "}
            or{" "}
            <Link
              to={this.projectEditLink("backendProjectResourceCollections")}
            >
              resource collections
            </Link>{" "}
            to the project to fix this block.
          </>
        )
      },
      "Content::MetadataBlock": {
        has_metadata: (
          <>
            <Link to={this.projectEditLink("backendProjectMetadata")}>
              Add project metadata
            </Link>{" "}
            to fix this block.
          </>
        )
      }
    };
  }

  projectEditLink(type) {
    return lh.link(type, this.projectId, this.block.id);
  }

  lookupError(key) {
    if (!has(this.availableErrors, [this.blockType, key])) return null;
    return this.availableErrors[this.blockType][key];
  }

  render() {
    return (
      <div className="entity-section-wrapper__body entity-section-wrapper__body--incomplete">
        <Utility.IconComposer icon="warningSign64" size={50} />
        <div>
          <span className="entity-section-wrapper__body--incomplete-header">
            This content block needs your attention before it can be displayed.
          </span>
          <span className="entity-section-wrapper__link-container">
            {this.presentBlockErrors.map(error => error)}
            <span className="entity-section-wrapper__body--warning">
              Note: This message is only visible to project editors.
            </span>
          </span>
        </div>
      </div>
    );
  }
}
