import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import FormattedDate from "global/components/FormattedDate";
import classnames from "classnames";
import IconComputed from "global/components/icon-computed";

class Info extends Component {
  static displayName = "ResourceList.Info";

  static propTypes = {
    resource: PropTypes.object.isRequired,
    withBackground: PropTypes.bool,
    t: PropTypes.func
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
          className="resource-slide-figure__resource-icon"
        />
        <span className="resource-type">{kind}</span>
        <span className="resource-date">
          <FormattedDate
            prefix={this.props.t("dates.added")}
            format="MMMM, yyyy"
            date={createdAt}
          />
        </span>
      </div>
    );
  }
}

export default withTranslation()(Info);
