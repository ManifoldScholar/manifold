import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Resourceish } from "components/frontend";
import Link from "./Link";

export default class NotationViewerPreview extends PureComponent {
  static displayName = "NotationViewer.Preview";

  static propTypes = {
    entry: PropTypes.object.isRequired,
    params: PropTypes.object,
    actions: PropTypes.shape({
      startDestroy: PropTypes.func,
      makeActive: PropTypes.func
    }).isRequired
  };

  render() {
    const { entry, params } = this.props;
    const { notation } = entry;

    return (
      <div className="notation-preview-footer">
        <Link notation={notation} params={params}>
          <div>
            <figure>
              <i className="manicon manicon-cube-fill" />
              <Resourceish.Thumbnail
                resourceish={notation}
                showTitle={false}
                showKind={false}
                additionalClasses="icon-only"
              />
              <figcaption
                className="title"
                dangerouslySetInnerHTML={{
                  __html: notation.attributes.titleFormatted
                }}
              />
            </figure>
            <i className="manicon manicon-caret-right" />
          </div>
        </Link>
      </div>
    );
  }
}
