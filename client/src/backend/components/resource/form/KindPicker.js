import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { UIDConsumer } from "react-uid";
import IconComputed from "global/components/icon-computed";
import setter from "global/components/form/setter";
import { withTranslation } from "react-i18next";
import Form from "global/components/form";
import { FormSelect } from "global/components/form/Select/index";
import * as Styled from "./styles";

class KindPicker extends PureComponent {
  static displayName = "Resource.KindPicker";

  static propTypes = {
    getModelValue: PropTypes.func,
    includeButtons: PropTypes.bool,
    set: PropTypes.func,
    t: PropTypes.func
  };

  get idPrefix() {
    return "kind";
  }

  get set() {
    return this.props.set;
  }

  renderSelect(kindList, id) {
    return (
      <>
        <Form.Label id={id} label={this.props.t("resources.new.kind")} />
        <Styled.SelectWrapper $only={this.props.includeButtons}>
          <FormSelect
            onChange={event => {
              this.set(event.target.value);
            }}
            value={this.props.getModelValue("attributes[kind]").toLowerCase()}
            options={kindList.map(kind => {
              const safeKind = kind.toLowerCase();
              const translatedKind = this.props.t(`resources.new.${safeKind}`);
              return {
                value: safeKind,
                label: translatedKind,
                key: safeKind
              };
            })}
          />
        </Styled.SelectWrapper>
      </>
    );
  }

  renderRadios(kindList, id) {
    if (!kindList) return null;
    return (
      <Styled.List
        role="group"
        aria-label={this.props.t("resources.new.resource_kind")}
      >
        {kindList.map(kind => {
          const safeKind = kind.toLowerCase();
          const translatedKind = this.props.t(`resources.new.${safeKind}`);
          const kindValue = this.props.getModelValue("attributes[kind]");
          const isActive = safeKind === kindValue;

          return (
            <Styled.Item
              key={safeKind}
              htmlFor={`${id}-${safeKind}`}
              $active={isActive}
            >
              <Styled.Input
                type="radio"
                value={safeKind}
                id={`${id}-${safeKind}`}
                name={id}
                checked={isActive}
                onChange={() => this.props.set(safeKind)}
              />
              <Styled.Label>{translatedKind}</Styled.Label>
              <IconComputed.Resource size="default" icon={safeKind} />
            </Styled.Item>
          );
        })}
      </Styled.List>
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
          <Styled.KindPicker className="form-secondary">
            <Form.FieldWrapper>
              {this.renderSelect(kindList, id)}
              {this.props.includeButtons
                ? this.renderRadios(kindList, id)
                : null}
            </Form.FieldWrapper>
          </Styled.KindPicker>
        )}
      </UIDConsumer>
    );
  }
}

export default withTranslation()(setter(KindPicker));
