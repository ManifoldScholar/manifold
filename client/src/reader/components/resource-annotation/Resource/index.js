import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Resource from "frontend/components/resource";
import IconComputed from "global/components/icon-computed";
import lh from "helpers/linkHandler";
import isEmpty from "lodash/isEmpty";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";
import { withTranslation } from "react-i18next";
import * as Styled from "./styles";

class ResourceDetail extends PureComponent {
  static propTypes = {
    resource: PropTypes.object,
    handleClose: PropTypes.func,
    t: PropTypes.func
  };

  componentDidMount() {
    window.addEventListener("keyup", this.handleEscape);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleEscape);
  }

  handleEscape = event => {
    if (event.keyCode === 27) {
      this.props.handleClose(event);
    }
  };

  buildRedirectUrl(resource) {
    if (!resource) return null;
    return lh.link(
      "frontendProjectResource",
      resource.attributes.projectSlug,
      resource.attributes.slug
    );
  }

  render() {
    const resource = this.props.resource;
    const attr = resource.attributes;
    const resourceUrl = this.buildRedirectUrl(resource);

    return (
      <Styled.Wrapper>
        <Styled.Container>
          <Styled.Resource>
            <Styled.Icon>
              <IconComputed.Resource icon={attr.kind} size={50} />
            </Styled.Icon>
          </Styled.Resource>
          <Resource.Title resource={resource} />
          <Styled.Content>
            {!isEmpty(attr.captionFormatted) ? (
              <div
                dangerouslySetInnerHTML={{ __html: attr.captionFormatted }}
              />
            ) : null}
            {!isEmpty(attr.descriptionFormatted) ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: attr.descriptionFormatted
                }}
              />
            ) : null}
          </Styled.Content>
        </Styled.Container>
        <Resource.Hero
          resource={resource}
          slideOptions={{ enableZoom: false }}
        />
        <Styled.Container>
          <Resource.Meta
            resource={resource}
            layout={"secondary columnar"}
            showIcon={false}
            showTags={false}
            isMobile
          />

          <nav className="button-nav button-nav--stack">
            <Resource.Link
              attributes={attr}
              buttonClass="button-secondary button-secondary--outlined"
            />
            <br />
            <Link
              to={resourceUrl}
              className="button-secondary button-secondary--outlined"
            >
              <span className="button-secondary__text">
                {this.props.t("reader.actions.visit_resource_page")}
              </span>
              <IconComposer
                icon="arrowRight16"
                size="default"
                className="button-secondary__icon"
              />
            </Link>
            <br />
            <button
              onClick={this.props.handleClose}
              className={classNames(
                "button-secondary",
                "button-secondary--outlined",
                "button-secondary--dull"
              )}
              data-id="close-overlay"
            >
              <IconComposer
                icon="arrowLeft16"
                size="default"
                className="button-secondary__icon"
              />
              <span className="button-secondary__text">
                {this.props.t("reader.actions.return_to_reader")}
              </span>
            </button>
          </nav>
        </Styled.Container>
      </Styled.Wrapper>
    );
  }
}

export default withTranslation()(ResourceDetail);
