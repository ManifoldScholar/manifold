import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { UIDConsumer } from "react-uid";
import classNames from "classnames";
import IconComputed from "global/components/icon-computed";
import setter from "global/components/form/setter";
import IconComposer from "global/components/utility/IconComposer";
import { withTranslation } from "react-i18next";

class KindPicker extends PureComponent {
  static displayName = "Resource.KindPicker";

  static propTypes = {
    getModelValue: PropTypes.func,
    includeButtons: PropTypes.bool,
    set: PropTypes.func,
    t: PropTypes.func
  };

  get selectClasses() {
    return classNames({
      "resource-kind-picker__select": true,
      "resource-kind-picker__select--only": !this.props.includeButtons
    });
  }

  get idPrefix() {
    return "kind";
  }

  renderSelect(kindList, id) {
    return (
      <>
        <label htmlFor={id}>
          {this.props.t("backend.forms.resource.kind")}
        </label>
        <div className={this.selectClasses}>
          <div className="form-select">
            <IconComposer
              icon="disclosureDown16"
              size={22}
              className="form-select__icon"
            />
            <select
              id={id}
              onChange={event => {
                this.props.set(event.target.value);
              }}
              value={this.props.getModelValue("attributes[kind]").toLowerCase()}
            >
              {kindList.map(kind => {
                const safeKind = kind.toLowerCase();
                const translatedKind = this.props.t(
                  `backend.forms.resource.${safeKind}`
                );

                return (
                  <option key={safeKind} value={safeKind} id={safeKind}>
                    {translatedKind}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </>
    );
  }

  renderRadios(kindList, id) {
    if (!kindList) return null;
    return (
      <div
        role="group"
        aria-label={this.props.t("backend.forms.resource.resource_kind")}
        className="resource-kind-picker__list"
      >
        {kindList.map(kind => {
          const safeKind = kind.toLowerCase();
          const translatedKind = this.props.t(
            `backend.forms.resource.${safeKind}`
          );
          const kindValue = this.props.getModelValue("attributes[kind]");
          const isActive = safeKind === kindValue;
          const itemClass = classNames({
            "resource-kind-picker__item": true,
            radio: true,
            "resource-kind-picker__item--active": isActive
          });
          return (
            <label
              key={safeKind}
              htmlFor={`${id}-${safeKind}`}
              className={itemClass}
            >
              <input
                type="radio"
                value={safeKind}
                id={`${id}-${safeKind}`}
                name={id}
                checked={isActive}
                onChange={() => this.props.set(safeKind)}
                className="resource-kind-picker__input"
              />
              <span className="resource-kind-picker__label">
                {translatedKind}
              </span>
              <IconComputed.Resource
                size="default"
                icon={safeKind}
                className="resource-kind-picker__icon"
              />
            </label>
          );
        })}
      </div>
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

    return (
      <UIDConsumer name={id => `${this.idPrefix}-${id}`}>
        {id => (
          <div className="resource-kind-picker form-secondary">
            <div className="form-input">
              {this.renderSelect(kindList, id)}
              {this.props.includeButtons
                ? this.renderRadios(kindList, id)
                : null}
            </div>
          </div>
        )}
      </UIDConsumer>
    );
  }
}

export default withTranslation()(setter(KindPicker));
