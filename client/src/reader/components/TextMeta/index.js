import PropTypes from "prop-types";
import Meta from "global/components/meta";

export default function TextMeta({ title, subtitle, meta, license }) {
  return (
    <div className="reader-text-meta">
      <header>
        <h2 className="title">{title}</h2>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </header>
      <Meta.List metadata={meta ?? {}} license={license} />
    </div>
  );
}

TextMeta.displayName = "Reader.TextMeta";

TextMeta.propTypes = {
  title: PropTypes.string,
  meta: PropTypes.object,
  subtitle: PropTypes.string,
  license: PropTypes.string
};
