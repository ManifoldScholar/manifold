import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import FormattedDate from "global/components/FormattedDate";
import * as Styled from "./styles";

class Info extends Component {
  static displayName = "ResourceList.Info";

  static propTypes = {
    resource: PropTypes.object.isRequired,
    withBackground: PropTypes.bool,
    t: PropTypes.func
  };

  static defaultProps = {
    withBackground: false
  };

  render() {
    const { withBackground, resource } = this.props;
    const { attributes } = resource;
    const { kind, createdAt } = attributes;

    return (
      <Styled.Wrapper $background={withBackground}>
        <Styled.Icon size={120} icon={kind} />
        <Styled.Kind>{kind}</Styled.Kind>
        <Styled.Date>
          <FormattedDate
            prefix={this.props.t("dates.added")}
            format="MMMM, yyyy"
            date={createdAt}
          />
        </Styled.Date>
      </Styled.Wrapper>
    );
  }
}

export default withTranslation()(Info);
