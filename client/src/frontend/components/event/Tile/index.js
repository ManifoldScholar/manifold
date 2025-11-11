import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import FormattedDate from "global/components/FormattedDate";
import Utility from "global/components/utility";
import * as Styled from "./styles";

export default function EventTile({
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
  linkHref,
  linkTarget = "_self",
  hideLink = false,
  className = "",
  visible = true,
  destroyCallback,
  itemTag = "li"
}) {
  const { t } = useTranslation();

  if (!visible) return null;

  const hasLink = !hideLink && linkHref;
  const TileTag = itemTag;

  return (
    <TileTag className={className}>
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
      {destroyCallback && (
        <div
          className="utility-button"
          data-id={"destroy"}
          onClick={destroyCallback}
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
    </TileTag>
  );
}

EventTile.displayName = "Event.Tile";

EventTile.propTypes = {
  hideLink: PropTypes.bool,
  itemTag: PropTypes.oneOf(["li", "div"]),
  className: PropTypes.string,
  destroyCallback: PropTypes.func,
  visible: PropTypes.bool,
  tileClass: PropTypes.string,
  header: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.node,
  preAttribution: PropTypes.node,
  content: PropTypes.node,
  postAttribution: PropTypes.node,
  date: PropTypes.string,
  dateFormat: PropTypes.string,
  linkHref: PropTypes.string,
  linkTarget: PropTypes.string,
  italicizeContent: PropTypes.bool
};
