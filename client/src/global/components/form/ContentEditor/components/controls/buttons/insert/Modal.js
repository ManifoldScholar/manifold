import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useUID } from "react-uid";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

export default function InsertModal(props) {
  const { form, resolve, reject, heading, icon, resolveLabel } = props;
  const uid = useUID();
  const { t } = useTranslation();

  const handleResolveClick = e => {
    e.preventDefault();
    resolve(e);
  };

  const handleRejectClick = e => {
    e.preventDefault();
    reject(e);
  };

  const buttonClasses = "button-secondary button-secondary--outlined";

  return (
    <Styled.Modal
      maxWidth={600}
      showCloseButton={false}
      closeOnOverlayClick={false}
      labelledBy={t("editor.forms.labelled_by_uid", { uid })}
      describedBy={t("editor.forms.described_by_uid", { uid })}
      onEsc={props.reject}
    >
      <>
        <Styled.ModalHeader className="dialog__header">
          <Styled.Heading>
            <Styled.HeaderIcon icon={icon} />
            <h2 id={t("editor.forms.labelled_by_uid", { uid })}>{heading}</h2>
          </Styled.Heading>
          <Styled.CloseButton onClick={handleRejectClick} tabIndex={0}>
            <Styled.CloseText>{t("actions.close")}</Styled.CloseText>
            <Styled.CloseIcon icon="close24" size={24} />
          </Styled.CloseButton>
        </Styled.ModalHeader>
        <Styled.ModalBody className="dialog__body">
          {form}
          <Styled.ButtonGroup>
            {typeof resolve === "function" && (
              <button
                onClick={handleResolveClick}
                className={buttonClasses}
                data-id="accept"
              >
                <span>{resolveLabel}</span>
              </button>
            )}
            <button
              className={classNames(buttonClasses, "button-secondary--dull")}
              onClick={handleRejectClick}
              data-id="reject"
            >
              <span>{t("actions.cancel")}</span>
            </button>
          </Styled.ButtonGroup>
        </Styled.ModalBody>
      </>
    </Styled.Modal>
  );
}

InsertModal.displayName = "ContentEditor.Insert.Modal";

InsertModal.propTypes = {
  resolve: PropTypes.func,
  reject: PropTypes.func.isRequired,
  heading: PropTypes.string,
  options: PropTypes.object,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};
