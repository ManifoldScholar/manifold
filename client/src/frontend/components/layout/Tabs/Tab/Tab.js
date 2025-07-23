import { useTabsContext } from "../context";
import * as Styled from "./styles";

export default function Tab({ id, children, ...restProps }) {
  const { getTabProps } = useTabsContext();

  const active = getTabProps(id)["aria-selected"];

  return (
    <Styled.Tab
      type="button"
      {...restProps}
      {...getTabProps(id)}
      $active={active}
    >
      {children}
    </Styled.Tab>
  );
}

Tab.displayName = "Frontend.Layout.Tab";
