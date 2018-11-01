import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Meta } from "components/global";

export default class ProjectDetailMeta extends PureComponent {
  static displayName = "ProjectDetail.Meta";

  static propTypes = {
    metadata: PropTypes.object.isRequired
  };

  render() {
    return (
      <div className="entities">
        <Meta.List metadata={this.props.metadata} />
      </div>
    );
  }
}
