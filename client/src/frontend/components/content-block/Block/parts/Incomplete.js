import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Utility from "global/components/utility";
import lh from "helpers/linkHandler";

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

  render() {
    return (
      <div className="entity-section-wrapper__body entity-section-wrapper__body--incomplete">
        <Utility.IconComposer icon="warning" size={50} />
        <div>
          <span>
            This content block needs your attention before it can be displayed.
          </span>
          <span className="entity-section-wrapper__link-container">
            <Link
              to={lh.link(
                "backendProjectContentBlock",
                this.projectId,
                this.block.id
              )}
            >
              Fix content block.
            </Link>
          </span>
        </div>
      </div>
    );
  }
}
