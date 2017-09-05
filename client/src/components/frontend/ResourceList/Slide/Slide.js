import React, { Component } from "react";
import PropTypes from "prop-types";
import FormattedDate from "components/global/FormattedDate";

export default class ResourceListSlideFigure extends Component {
  static propTypes = {
    resource: PropTypes.object
  };

  render() {
    const resource = this.props.resource;
    const attr = resource.attributes;

    return (
      <figure>
        <div
          ref={c => {
            this._figure = c;
          }}
          className="figure-default"
          style={{ backgroundImage: "url(/static/images/resource-splash.png)" }}
        >
          <div className="resource-info">
            <i className={`manicon manicon-resource-${attr.kind}`} />
            <span className="resource-type">
              {attr.kind}
            </span>
            <span className="resource-date">
              <FormattedDate
                prefix="Uploaded"
                format="MMMM, YYYY"
                date={attr.createdAt}
              />
            </span>
          </div>
        </div>
      </figure>
    );
  }
}
