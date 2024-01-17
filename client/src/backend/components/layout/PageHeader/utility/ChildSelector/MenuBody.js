import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { maybeHtml, maybeReactNode } from "helpers/maybeHtml";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

function ChildSelectorMenuBody(props, ref) {
  const { links, visible, ...dropDownProps } = props;
  const { t } = useTranslation();

  const renderItem = link => {
    const maybeLinkProps = link.route
      ? { to: lh.link(link.route, link.id) }
      : { as: "span", $noLink: true };

    return (
      <li key={link.id}>
        <Styled.Link {...maybeLinkProps} onClick={dropDownProps.toggleVisible}>
          {link.active && <Styled.LinkIcon icon="checkmark16" size={16} />}
          <Styled.LinkText {...maybeHtml(link.label)}>
            {maybeReactNode(t(link.label))}
          </Styled.LinkText>
        </Styled.Link>
      </li>
    );
  };

  return (
    <Styled.Wrapper $visible={visible} ref={ref} {...dropDownProps}>
      <Styled.List>{links.map(link => renderItem(link))}</Styled.List>
    </Styled.Wrapper>
  );
}

ChildSelectorMenuBody.displayName = "Layout.Projects.SecondaryNav";

export default forwardRef(ChildSelectorMenuBody);
