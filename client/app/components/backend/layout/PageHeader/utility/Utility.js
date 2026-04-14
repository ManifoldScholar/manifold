import React from "react";
import ActionButtons from "./ActionButtons";
import ActionSelector from "./ActionSelector";
import ChildSelector from "./ChildSelector";
import * as Styled from "./styles";

export default function Utility({
  actions,
  links,
  entityType,
  childType,
  note,
  hasSecondaryNav
}) {
  const showUtilityRow = actions || note;
  const showDropdownRow = hasSecondaryNav && (actions || links);

  return (
    <>
      {showDropdownRow && (
        <Styled.DropdownRow>
          {actions && <ActionSelector actions={actions} entity={entityType} />}
          {links && <ChildSelector links={links} entity={childType} mobile />}
        </Styled.DropdownRow>
      )}
      {showUtilityRow && (
        <Styled.UtilityRow $hideOnMobile={hasSecondaryNav}>
          {actions && <ActionButtons actions={actions} entity={entityType} />}
          {note && <Styled.Note>{note}</Styled.Note>}
        </Styled.UtilityRow>
      )}
    </>
  );
}
