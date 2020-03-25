import React, { Component } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import classnames from "classnames";
import IconComputed from "global/components/icon-computed";

export default class Info extends Component {
  static displayName = "ResourceList.Info";

  static propTypes = {
    resource: PropTypes.object.isRequired,
    withBackground: PropTypes.bool
  };

  static defaultProps = {
    withBackground: false
  };

  render() {
    const { withBackground, resource } = this.props;
    const { attributes } = resource;
    const { kind, createdAt } = attributes;
    const infoClassNames = classnames({
      "resource-info": true,
      "with-background": withBackground
    });

    return (
      <div className={infoClassNames}>
        <IconComputed.Resource
          size={120}
          icon={kind}
          iconClass="resource-slide-figure__resource-icon"
        />
        <span className="resource-type">{kind}</span>
        <span className="resource-date">
          <FormattedDate prefix="Added" format="MMMM, yyyy" date={createdAt} />
        </span>
      </div>
    );
  }
}
