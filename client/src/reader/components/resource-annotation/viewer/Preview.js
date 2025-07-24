import PropTypes from "prop-types";
import Resourceish from "frontend/components/resourceish";
import Link from "./Link";
import IconComposer from "global/components/utility/IconComposer";

export default function ViewerPreview({ entry, params }) {
  return (
    <div inert={!entry ? "" : undefined} className="notation-preview-footer">
      {entry && (
        /* eslint-disable jsx-a11y/anchor-is-valid */
        <Link
          notation={entry.notation}
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
                resourceish={entry.notation}
                showTitle={false}
                showKind={false}
                iconOnly
              />
              <figcaption
                className="notation-preview-footer__figcaption"
                dangerouslySetInnerHTML={{
                  __html: entry.notation.attributes.titleFormatted
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
      )}
    </div>
  );
}

ViewerPreview.displayName = "ResourceAnnotation.Viewer.Preview";

ViewerPreview.propTypes = {
  entry: PropTypes.object,
  params: PropTypes.object,
  actions: PropTypes.shape({
    startDestroy: PropTypes.func,
    makeActive: PropTypes.func
  }).isRequired
};
