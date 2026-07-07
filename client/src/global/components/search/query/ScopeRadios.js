import PropTypes from "prop-types";
import classNames from "classnames";
import Option from "global/components/form/Radio/Option";

export default function ScopeRadios({
  label,
  scopes,
  value,
  onChange,
  inline = false,
  groupName = "search[scope]"
}) {
  if (!scopes?.length) return null;

  return (
    <fieldset
      className={classNames({
        "search-query__filter-group": true,
        "search-query__filter-group--inline": inline
      })}
    >
      <legend className="search-query__group-label">{label}</legend>
      <div className="search-query__filter-group-list">
        {scopes.map(option => (
          <Option
            key={option.value}
            option={{ ...option, originalValue: option.value }}
            groupName={groupName}
            onChange={() => onChange(option.value)}
            value={value}
            inline
          />
        ))}
      </div>
    </fieldset>
  );
}

ScopeRadios.displayName = "Search.Query.ScopeRadios";

ScopeRadios.propTypes = {
  label: PropTypes.string.isRequired,
  scopes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ),
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  inline: PropTypes.bool,
  groupName: PropTypes.string
};
