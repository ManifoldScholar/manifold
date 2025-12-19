import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Navigation, Title } from "../parts";
import { useSettings } from "hooks";
import * as Styled from "./styles";

function GroupsHeading({ currentUser }) {
  const { t } = useTranslation();

  const links = [
    {
      to: "/my/groups",
      text: t("navigation.reading_group.my_groups"),
      exact: false
    },
    {
      to: "/groups",
      text: t("navigation.reading_group.public_groups"),
      exact: true
    }
  ];

  const {
    attributes: {
      general: { disablePublicReadingGroups }
    }
  } = useSettings();

  return (
    <header>
      <Styled.Container>
        <Styled.Flex>
          {!currentUser ? (
            <Title
              title={t("navigation.reading_group.public_groups")}
              icon="annotationGroup24"
            />
          ) : (
            <>
              {disablePublicReadingGroups ? (
                <Title
                  title={t("navigation.reading_group.my_groups")}
                  icon="annotationGroup24"
                />
              ) : (
                <Navigation
                  ariaLabel={t("navigation.reading_group.label")}
                  links={links}
                  layout="flex"
                  padLinks
                />
              )}
              <Styled.CreateButton
                to="/my/groups/new"
                className="button-tertiary"
              >
                {t("navigation.reading_group.create")}
              </Styled.CreateButton>
            </>
          )}
        </Styled.Flex>
      </Styled.Container>
    </header>
  );
}

GroupsHeading.displayName = "ReadingGroup.GroupsHeading";

GroupsHeading.propTypes = {
  currentUser: PropTypes.object
};

export default GroupsHeading;
