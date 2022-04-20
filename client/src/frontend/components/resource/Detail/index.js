import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import CommentContainer from "global/containers/comment";
import Utility from "frontend/components/utility";
import Hero from "../Hero";
import Link from "../Link";
import Meta from "../Meta";
import Title from "../Title";
import VariantList from "../VariantList";
import * as Styled from "./styles";

class ResourceDetail extends Component {
  static displayName = "Resource.Detail";

  static propTypes = {
    projectUrl: PropTypes.string,
    resourceUrl: PropTypes.string.isRequired,
    resource: PropTypes.object,
    t: PropTypes.func
  };

  createDescription(description) {
    if (!description) return { __html: this.props.t("errors.no_content") };
    return {
      __html: description
    };
  }

  get canEngagePublicly() {
    const { resource } = this.props;
    if (!resource) return false;
    return resource.attributes.abilities.engagePublicly;
  }

  // The cancel prop is required by CommentEditor.
  // We don't render the cancel button in this context,
  // so this is basically a stub. --MO
  cancelComment(event) {
    if (!event) return null;
    event.preventDefault();
  }

  render() {
    const { resource, resourceUrl } = this.props;
    if (!resource) return null;
    const attr = resource.attributes;
    const t = this.props.t;

    /* eslint-disable jsx-a11y/anchor-is-valid                                          */
    /* jsx-a11y sees the link in this component as missing a href attribute, but it's a */
    /* false positive, as the child Link component does in fact render an a tag with a  */
    /* href.                                                                            */
    return (
      <Styled.Container>
        <Styled.TitleWrapper>
          <Title resource={resource} showIcon={false} />
        </Styled.TitleWrapper>

        <Hero resource={resource} />

        <Styled.DetailsContainer>
          <Styled.RightCol>
            <Link attributes={attr} />
            <Utility.ShareBar url={resourceUrl} />
            <Meta resource={resource} layout={"secondary"} />
            <VariantList resource={resource} />
          </Styled.RightCol>
          <Styled.MetaMobile>
            <Meta resource={resource} layout={"secondary"} isMobile />
          </Styled.MetaMobile>
          <Styled.VariantsMobile>
            <VariantList resource={resource} isMobile />
          </Styled.VariantsMobile>
          <Styled.Content>
            <Styled.Caption
              dangerouslySetInnerHTML={{ __html: attr.captionFormatted }}
            />

            <Styled.DescriptionHeader>
              {t("pages.subheaders.full_description")}
            </Styled.DescriptionHeader>
            <div
              dangerouslySetInnerHTML={this.createDescription(
                attr.descriptionFormatted
              )}
            />
            <Styled.Comments>
              {this.canEngagePublicly && (
                <>
                  <CommentContainer.Thread subject={resource} />
                  <CommentContainer.Editor
                    focus={false}
                    label={t("actions.add_comment")}
                    subject={resource}
                    cancel={event => this.cancelComment(event)}
                  />
                </>
              )}
            </Styled.Comments>
          </Styled.Content>
        </Styled.DetailsContainer>
      </Styled.Container>
    );
    /* eslint-enable jsx-a11y/anchor-is-valid */
  }
}

export default withTranslation()(ResourceDetail);
