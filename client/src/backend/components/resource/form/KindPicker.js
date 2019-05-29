import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { UID } from "react-uid";
import classNames from "classnames";
import IconComputed from "global/components/icon-computed";
import Form from "backend/components/form";
import IconComposer from "global/components/utility/IconComposer";

class KindPicker extends PureComponent {
  static displayName = "Resource.KindPicker";

  static propTypes = {
    getModelValue: PropTypes.func,
    includeButtons: PropTypes.bool,
    set: PropTypes.func
  };

  get idPrefix() {
    return "kind";
  }

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
                    <IconComputed.Resource size="default" icon={safeKind} />
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
      <UID name={id => `${this.idPrefix}-${id}`}>
        {id => (
          <div className="resource-kind-picker form-secondary">
            <div className="form-input">
              <label htmlFor={id}>Kind</label>
              <div className={selectClass}>
                <div className="form-select">
                  <IconComposer
                    icon="disclosureDown16"
                    size={22}
                    iconClass="form-select__icon"
                  />
                  <select
                    id={id}
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
        )}
      </UID>
    );
  }
}

export default Form.setter(KindPicker);
