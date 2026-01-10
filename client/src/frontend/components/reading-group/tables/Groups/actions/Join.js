import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useRevalidator } from "react-router";
import template from "lodash/template";
import classNames from "classnames";
import { useConfirmation } from "hooks";
import Dialog from "global/components/dialog";
import { queryApi } from "app/routes/utility/helpers/queryApi";

function JoinGroup({ readingGroup, buttonText, outlined }) {
  const { t } = useTranslation();
  const { revalidate } = useRevalidator();
  const { confirm, confirmation } = useConfirmation();

  const joinGroup = group => {
    const {
      href: endpoint,
      meta: { method }
    } = group.links.join;
    return queryApi({
      endpoint,
      method,
      options: {}
    });
  };

  const doJoin = async () => {
    try {
      await joinGroup(readingGroup);
      revalidate();
    } catch (error) {
      // Error handling - could show a notification here if needed
      console.error("Failed to join reading group:", error);
    }
  };

  function handleClick() {
    const heading = t("messages.reading_group.join.heading");
    const message = t("messages.reading_group.join.message");
    const compiledMessage = template(message)({ readingGroup });
    confirm({
      heading,
      message: compiledMessage,
      callback: closeDialog => {
        doJoin().then(() => {
          closeDialog();
        });
      }
    });
  }

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <button
        onClick={handleClick}
        className={classNames({
          "button-tertiary": true,
          "button-tertiary--outlined": outlined
        })}
      >
        {buttonText || t("actions.join")}
      </button>
    </>
  );
}

JoinGroup.displayName = "GroupsTable.Group.Join";

JoinGroup.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  buttonText: PropTypes.string,
  outlined: PropTypes.bool
};

export default JoinGroup;
