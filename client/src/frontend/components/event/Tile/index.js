import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import FormattedDate from "global/components/FormattedDate";
import Utility from "global/components/utility";
import { withRouter } from "react-router-dom";
import * as Styled from "./styles";

export class EventTile extends Component {
  static displayName = "Event.Tile";

  static propTypes = {
    hideLink: PropTypes.bool,
    itemTag: PropTypes.oneOf(["li", "div"]),
    className: PropTypes.string,
    destroyCallback: PropTypes.func,
    visible: PropTypes.bool,
    tileClass: PropTypes.string,
    header: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.any,
    preAttribution: PropTypes.any,
    content: PropTypes.any,
    postAttribution: PropTypes.any,
    date: PropTypes.string,
    dateFormat: PropTypes.string,
    linkHref: PropTypes.string,
    linkTarget: PropTypes.string,
    history: PropTypes.object,
    italicizeContent: PropTypes.bool,
    t: PropTypes.func
  };

  static defaultProps = {
    linkTarget: "_self",
    hideLink: false,
    visible: true,
    className: "",
    itemTag: "li"
  };

  get tileTag() {
    return this.props.itemTag;
  }

  render() {
    if (!this.props.visible) return null;

    const {
      header,
      icon,
      title,
      subtitle,
      preAttribution,
      content,
      postAttribution,
      date,
      dateFormat,
      italicizeContent,
      t,
      linkHref,
      linkTarget,
      hideLink
    } = this.props;

    const hasLink = !hideLink && linkHref;

    return (
      <this.tileTag className={this.props.className}>
        {/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-tabindex */}
        <Styled.Tile $linked={hasLink}>
          {/* eslint-enable jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-tabindex */}
          <Styled.Inner>
            {icon && <Styled.Icon icon={icon} size={48} />}
            {header && <Styled.Header>{header}</Styled.Header>}
            {hasLink && title ? (
              <Styled.Link
                href={linkHref}
                {...(linkTarget === "_blank"
                  ? { target: "_blank", noreferrer: true }
                  : {})}
              >
                <Styled.Title dangerouslySetInnerHTML={{ __html: title }} />
              </Styled.Link>
            ) : (
              <>
                {title && (
                  <Styled.Title dangerouslySetInnerHTML={{ __html: title }} />
                )}
              </>
            )}
            {subtitle && <Styled.Subtitle>{subtitle}</Styled.Subtitle>}
            {preAttribution && <Styled.User>{preAttribution}</Styled.User>}
            {content && (
              <Styled.Content $italic={italicizeContent}>
                {content}
              </Styled.Content>
            )}
            {postAttribution && <Styled.User>{postAttribution}</Styled.User>}
            {date && (
              <Styled.Footer>
                <FormattedDate format={dateFormat} date={date} />
              </Styled.Footer>
            )}
          </Styled.Inner>
        </Styled.Tile>
        {this.props.destroyCallback && (
          <div
            className="utility-button"
            data-id={"destroy"}
            onClick={this.props.destroyCallback}
            role="button"
            tabIndex="0"
          >
            <Utility.IconComposer
              icon="delete32"
              size={26}
              className={"utility-button__icon utility-button__icon--notice"}
            />
            <span className="screen-reader-text">
              {t("actions.delete_event")}
            </span>
          </div>
        )}
      </this.tileTag>
    );
  }
}

export default withRouter(withTranslation()(EventTile));
