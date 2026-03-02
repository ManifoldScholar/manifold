import { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import template from "lodash/template";
import classNames from "classnames";
import { useConfirmation } from "hooks";
import Dialog from "global/components/dialog";

function JoinGroup({ readingGroup, buttonText, outlined }) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const { confirm, confirmation } = useConfirmation();

  useEffect(() => {
    if (fetcher.data?.errors) {
      console.error("Failed to join reading group:", fetcher.data.errors);
    }
  }, [fetcher.data]);

  const doJoin = useCallback(() => {
    const {
      href: endpoint,
      meta: { method }
    } = readingGroup.links.join;
    fetcher.submit(
      JSON.stringify({ intent: "join-via-link", endpoint, method }),
      {
        method: "post",
        encType: "application/json",
        action: "/actions/reading-group-membership"
      }
    );
  }, [readingGroup, fetcher]);

  function handleClick() {
    const heading = t("messages.reading_group.join.heading");
    const message = t("messages.reading_group.join.message");
    const compiledMessage = template(message)({ readingGroup });
    confirm({
      heading,
      message: compiledMessage,
      callback: closeDialog => {
        doJoin();
        closeDialog();
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
