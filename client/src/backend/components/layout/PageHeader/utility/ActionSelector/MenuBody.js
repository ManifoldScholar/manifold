import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import Authorize from "hoc/Authorize";
import { getLinkOrButtonProps } from "../helpers";
import * as Styled from "./styles";

function ActionSelectorMenuBody(props, ref) {
  const { actions, visible, entity, ...dropDownProps } = props;
  const { t } = useTranslation();

  const renderItem = action => {
    const linkOrButtonProps = getLinkOrButtonProps(action);

    if (action.authorize) {
      return (
        <Authorize
          key={action.label}
          entity={entity}
          ability={action.authorize}
        >
          <li>
            <Styled.Link {...linkOrButtonProps}>
              <Styled.LinkIcon icon={action.icon} size={20} />
              <Styled.LinkText>{t(action.label)}</Styled.LinkText>
            </Styled.Link>
          </li>
        </Authorize>
      );
    }

    return (
      <li key={action.label}>
        <Styled.Link {...linkOrButtonProps}>
          <Styled.LinkIcon icon={action.icon} size={20} />
          <Styled.LinkText>{t(action.label)}</Styled.LinkText>
        </Styled.Link>
      </li>
    );
  };

  return (
    <Styled.Wrapper $visible={visible} ref={ref} {...dropDownProps}>
      <Styled.List>{actions.map(action => renderItem(action))}</Styled.List>
    </Styled.Wrapper>
  );
}

ActionSelectorMenuBody.displayName = "Layout.Projects.SecondaryNav";

export default forwardRef(ActionSelectorMenuBody);
