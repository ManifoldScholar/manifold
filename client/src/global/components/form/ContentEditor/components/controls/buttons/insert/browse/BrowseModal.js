import { useId } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import BrowseList from "./BrowseList";
import * as Styled from "./styles";

export default function BrowseModal(props) {
  const { onCancel, onAdd, heading, icon, addLabel, active, setActive } = props;
  const id = useId();
  const { t } = useTranslation();

  const handleResolveClick = e => {
    e.preventDefault();
    console.log("here");
    onAdd();
  };

  const handleRejectClick = e => {
    e.preventDefault();
    onCancel();
  };

  const buttonClasses = "button-secondary button-secondary--outlined";

  return (
    <Styled.Modal
      showCloseButton={false}
      closeOnOverlayClick={false}
      labelledBy={t("editor.forms.labelled_by_uid", { id })}
      describedBy={t("editor.forms.described_by_uid", { id })}
      onEsc={props.reject}
    >
      <>
        <Styled.ModalHeader className="dialog__header">
          <Styled.Heading>
            <Styled.HeaderIcon icon={icon} />
            <h2 id={t("editor.forms.labelled_by_uid", { id })}>{heading}</h2>
          </Styled.Heading>
          <Styled.CloseButton onClick={handleRejectClick} tabIndex={0}>
            <Styled.CloseText>{t("actions.close")}</Styled.CloseText>
            <Styled.CloseIcon icon="close24" size={24} />
          </Styled.CloseButton>
        </Styled.ModalHeader>
        <Styled.ModalBody className="dialog__body">
          <BrowseList active={active} setActive={setActive} />
          <Styled.ButtonGroup>
            {typeof onAdd === "function" && (
              <button
                onClick={handleResolveClick}
                className={buttonClasses}
                data-id="accept"
              >
                <span>{addLabel}</span>
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
