import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Menu from "../parts/Menu";
import MenuItem from "../parts/MenuItem";
import * as Styled from "./styles";

function Highlight({
  menu,
  visible,
  direction,
  actions,
  onKeyDown,
  activeAnnotation
}) {
  const { t } = useTranslation();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      window.setTimeout(() => setCopied(false), 1500);
    }
  }, [copied]);

  /* eslint-disable */
  const onCopyClick = () => {
    if (!activeAnnotation?.attributes?.subject) return;

    navigator?.clipboard
      .writeText(activeAnnotation.attributes.subject)
      .then(() => {
        setCopied(true);
      });
  };
  /* eslint-enable */

  return (
    <Menu
      menu={menu}
      visible={visible}
      aria-label={t("reader.menus.popup.log_in_annotate")}
      direction={direction}
      onKeyDown={onKeyDown}
    >
      <Styled.Actions>
        <MenuItem
          menu={menu}
          onClick={() => actions.destroyAnnotation(activeAnnotation)}
          kind="any"
          label={t("reader.menus.popup.remove_highlight")}
          icon="delete24"
        />
        <MenuItem
          menu={menu}
          onClick={onCopyClick}
          kind="any"
          label={
            copied
              ? t("actions.copied")
              : t("reader.menus.popup.copy_highlight")
          }
          icon={copied ? "checkmark16" : "copy24"}
        />
      </Styled.Actions>
    </Menu>
  );
}

Highlight.displayName = "Annotation.Popup.Menus.Highlight";

Highlight.propTypes = {
  menu: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  direction: PropTypes.oneOf(["up", "down"]),
  visible: PropTypes.bool,
  activeAnnotation: PropTypes.object
};

export default Highlight;
