import { useTabsContext } from "../context";
import * as Styled from "./styles";

export default function Panel({ children, className, id }) {
  const { getPanelProps, getTabProps } = useTabsContext();
  const { inert, ...panelProps } = getPanelProps(id);
  const visible = getTabProps(id)["aria-selected"];

  return (
    <Styled.Panel
      className={className}
      {...panelProps}
      inert={!visible ? "" : undefined}
      $visible={visible}
    >
      {children}
    </Styled.Panel>
  );
}

Panel.displayName = "Fronend.Layout.TabPanel";
