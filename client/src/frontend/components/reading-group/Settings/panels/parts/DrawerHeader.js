import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "backend/components/layout";
import useCollapseContext from "global/components/Collapse/useCollapseContext";
import { readingGroupsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import lh from "helpers/linkHandler";

const { request } = entityStoreActions;

export default function DrawerHeader({ readingGroup, confirm }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleDelete() {
    const heading = t("messages.reading_group.destroy_heading");
    const message = t("messages.reading_group.destroy_message");
    confirm(heading, message, () => {
      const call = readingGroupsAPI.destroy(readingGroup.id);
      const options = { removes: readingGroup };
      const readingGroupRequest = request(
        call,
        requests.feReadingGroupDestroy,
        options
      );
      dispatch(readingGroupRequest).promise.then(() => {
        navigate(lh.link("frontendMyReadingGroups"));
      });
    });
  }

  const { toggleProps } = useCollapseContext();

  const buttons = [
    ...(readingGroup.links?.clone
      ? [
          {
            icon: "duplicate24",
            label: t("actions.duplicate"),
            className: "utility-button__icon",
            ...toggleProps
          }
        ]
      : []),
    {
      onClick: handleDelete,
      icon: "delete24",
      label: t("actions.delete"),
      className: "utility-button__icon utility-button__icon--notice"
    }
  ];

  return (
    <Layout.DrawerHeader
      title={t("forms.edit_group.title")}
      buttons={buttons}
      buttonLayout="inline"
      small
    />
  );
}

DrawerHeader.displayName = "ReadingGroup.Settings.DrawerHeader";

DrawerHeader.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  confirm: PropTypes.func.isRequired
};
