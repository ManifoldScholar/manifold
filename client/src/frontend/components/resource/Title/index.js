import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import FormattedDate from "global/components/FormattedDate";
import IconComputed from "global/components/icon-computed";
import Collecting from "frontend/components/collecting";
import * as Styled from "./styles";

class ResourceTitle extends Component {
  static displayName = "Resource.Title";

  static propTypes = {
    resource: PropTypes.object,
    showIcon: PropTypes.bool,
    showDate: PropTypes.bool,
    t: PropTypes.func
  };

  static defaultProps = {
    showIcon: true,
    showDate: true
  };

  render() {
    const attr = this.props.resource.attributes;

    return (
      <Styled.Container>
        {this.props.showIcon ? (
          <Styled.Icon className={attr.kind}>
            <IconComputed.Resource icon={attr.kind} size={60} />
          </Styled.Icon>
        ) : null}
        <div>
          <Styled.TitleAndToggle>
            <Styled.Title
              dangerouslySetInnerHTML={{ __html: attr.titleFormatted }}
            />
            <Styled.ToggleWrapper>
              <Collecting.Toggle collectable={this.props.resource} />
            </Styled.ToggleWrapper>
          </Styled.TitleAndToggle>
          {this.props.showDate ? (
            <Styled.DateWrapper>
              {this.props.t("dates.resource_added")}{" "}
              <FormattedDate format="MMMM, yyyy" date={attr.createdAt} />
            </Styled.DateWrapper>
          ) : null}
        </div>
      </Styled.Container>
    );
  }
}

export default withTranslation()(ResourceTitle);
