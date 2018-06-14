import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import uniqueId from "lodash/uniqueId";
import classNames from "classnames";
import { Resource } from "components/frontend";
import setter from "components/backend/Form/setter";

class KindPicker extends PureComponent {
  static displayName = "Resource.KindPicker";

  static propTypes = {
    getModelValue: PropTypes.func,
    includeButtons: PropTypes.bool,
    set: PropTypes.func,
    id: PropTypes.string
  };

  static defaultProps = {
    id: uniqueId("kind-")
  };

  renderKindPickerButtons(kindList) {
    if (!kindList) return null;
    return (
      <ul role="radiogroup">
        {kindList.map(kind => {
          const safeKind = kind.toLowerCase();
          const kindValue = this.props.getModelValue("attributes[kind]");
          const isActive = safeKind === kindValue;
          const buttonClass = classNames({
            button: true,
            active: isActive
          });
          return (
            <li key={safeKind}>
              <div
                onClick={() => {
                  this.props.set(safeKind);
                }}
                className={buttonClass}
                role="radio"
                tabIndex="0"
                aria-checked={isActive}
              >
                <figure>
                  <figcaption>
                    <span>
                      {kind}
                      {safeKind ===
                      this.props.getModelValue("attributes[kind]") ? (
                        <span className="screen-reader-text">
                          Selected Kind
                        </span>
                      ) : null}
                    </span>
                  </figcaption>
                  <div className={`resource-icon ${safeKind}`}>
                    <Resource.Icon.Composer kind={safeKind} />
                  </div>
                </figure>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    const kindList = [
      "Image",
      "Video",
      "Audio",
      "File",
      "Link",
      "PDF",
      "Document",
      "Spreadsheet",
      "Presentation",
      "Interactive"
    ];

    const selectClass = classNames({
      "picker-select": true,
      "select-only": !this.props.includeButtons
    });

    return (
      <div className="resource-kind-picker form-secondary">
        <div className="form-input">
          <label htmlFor={this.props.id}>Kind</label>
          <div className={selectClass}>
            <div className="form-select">
              <i className="manicon manicon-caret-down" aria-hidden="true" />
              <select
                id={this.props.id}
                onChange={event => {
                  this.props.set(event.target.value);
                }}
                value={this.props
                  .getModelValue("attributes[kind]")
                  .toLowerCase()}
              >
                {kindList.map(kind => {
                  const safeKind = kind.toLowerCase();

                  return (
                    <option key={safeKind} value={safeKind} id={safeKind}>
                      {kind}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          {this.props.includeButtons
            ? this.renderKindPickerButtons(kindList)
            : null}
        </div>
      </div>
    );
  }
}

export default setter(KindPicker);
