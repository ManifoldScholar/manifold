import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Resourceish from "frontend/components/resourceish";
import Link from "./Link";
import IconComposer from "global/components/utility/IconComposer";

export default class NotationViewerPreview extends PureComponent {
  static displayName = "NotationViewer.Preview";

  static propTypes = {
    entry: PropTypes.object,
    params: PropTypes.object,
    actions: PropTypes.shape({
      startDestroy: PropTypes.func,
      makeActive: PropTypes.func
    }).isRequired
  };

  render() {
    const { entry, params } = this.props;

    if (!entry) return null;

    const { notation } = entry;

    /* eslint-disable jsx-a11y/anchor-is-valid                                          */
    /* jsx-a11y sees the link in this component as missing a href attribute, but it's a */
    /* false positive, as the child Link component does in fact render an a tag with a  */
    /* href.                                                                            */
    return (
      <div className="notation-preview-footer">
        <Link
          notation={notation}
          params={params}
          className="notation-preview-footer__link"
        >
          <div className="notation-preview-footer__link-inner">
            <figure className="notation-preview-footer__figure">
              <IconComposer
                icon="resourceFilled16"
                size="default"
                className="notation-preview-footer__cube-icon"
              />
              <Resourceish.Thumbnail
                resourceish={notation}
                showTitle={false}
                showKind={false}
                iconOnly
              />
              <figcaption
                className="notation-preview-footer__figcaption"
                dangerouslySetInnerHTML={{
                  __html: notation.attributes.titleFormatted
                }}
              />
            </figure>
            <IconComposer
              icon="disclosureDown32"
              size="default"
              className="notation-preview-footer__caret-icon"
            />
          </div>
        </Link>
      </div>
    );
    /* eslint-enable jsx-a11y/anchor-is-valid */
  }
}
