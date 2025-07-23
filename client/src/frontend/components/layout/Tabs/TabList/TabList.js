import { useTabsContext } from "../context";
import * as Styled from "./styles";

export default function TabList({ children, className }) {
  const { tabListProps } = useTabsContext();

  return (
    <Styled.TabList className={className} {...tabListProps}>
      {children}
    </Styled.TabList>
  );
}

TabList.displayName = "Frontend.Layout.TabList";
