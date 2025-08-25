import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Menu from "../../parts/Menu";
import RGMenuItem from "../../parts/RGMenuItem";
import IconComposer from "global/components/utility/IconComposer";
import lh from "helpers/linkHandler";
import { useReaderContext } from "hooks";
import withCurrentUser from "hoc/withCurrentUser";
import * as Styled from "./styles";

function ReadingGroupMenu({
  menu,
  visible,
  onBackClick,
  onKeyDown,
  direction,
  readingGroups,
  currentReadingGroup,
  onSelect,
  currentUser
}) {
  const context = useReaderContext();
  const canEngagePublicly = context.attributes.abilities.engagePublicly;
  const canAccessReadingGroups =
    currentUser?.attributes.classAbilities.readingGroup.read;

  function isPrivateGroup(privacy) {
    return privacy === "private" || privacy === "anonymous";
  }
  const { t } = useTranslation();

  return (
    <Menu
      menu={menu}
      visible={visible}
      aria-label={t("glossary.reading_group_one")}
      direction={direction}
      onKeyDown={onKeyDown}
    >
      <Styled.Back
        menu={{ ...menu, visible }}
        onClick={onBackClick}
        kind="any"
        label={t("navigation.back")}
        icon="arrowLeft32"
      />
      <Styled.Header>
        <Styled.Heading>
          {canAccessReadingGroups ? "Change Current Group:" : "Visibility"}
        </Styled.Heading>
      </Styled.Header>
      <Styled.ButtonGroup role="group">
        {canEngagePublicly && (
          <RGMenuItem
            menu={{ ...menu, visible }}
            label={t("reader.my_public_annotations")}
            value="public"
            onClick={() => onSelect("public")}
            selected={currentReadingGroup === "public"}
          />
        )}
        <RGMenuItem
          menu={{ ...menu, visible }}
          label={t("reader.my_private_annotations")}
          value="private"
          onClick={() => onSelect("private")}
          privateGroup
          selected={currentReadingGroup === "private"}
        />
        {!!readingGroups?.length &&
          readingGroups.map(rg => (
            <RGMenuItem
              key={rg.id}
              menu={{ ...menu, visible }}
              label={rg.attributes.name}
              value={rg.id}
              onClick={() => onSelect(rg.id)}
              privateGroup={isPrivateGroup(rg.attributes.privacy)}
              selected={currentReadingGroup === rg.id}
            />
          ))}
        {canAccessReadingGroups && (
          <Styled.Footer>
            <Styled.Manage
              {...menu}
              visible={visible}
              as={Link}
              to={lh.link("frontendMyReadingGroups")}
            >
              <span>{t("reader.menus.popup.manage_groups")}</span>
              <IconComposer icon="link24" size="default" />
            </Styled.Manage>
          </Styled.Footer>
        )}
      </Styled.ButtonGroup>
    </Menu>
  );
}

ReadingGroupMenu.displayName = "Annotation.Popup.Menus.ReadingGroup";

ReadingGroupMenu.propTypes = {
  menu: PropTypes.object.isRequired,
  onBackClick: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  direction: PropTypes.oneOf(["up", "down"]),
  readingGroups: PropTypes.array,
  currentReadingGroup: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  currentUser: PropTypes.object
};

export default withCurrentUser(ReadingGroupMenu);
