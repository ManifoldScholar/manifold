import { useId, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import BrowseList from "./BrowseList";
import * as Styled from "./styles";

export default function BrowseModal(props) {
  const { icon, addLabel, closeModal, onSelect, format } = props;
  const id = useId();
  const { t } = useTranslation();

  const [active, setActive] = useState(null);

  const buttonClasses = "button-secondary button-secondary--outlined";

  const onCancel = e => {
    e.preventDefault();
    closeModal();
  };

  const onAdd = e => {
    e.preventDefault();
    onSelect(active);
    closeModal();
  };

  return (
    <Styled.Modal
      showCloseButton={false}
      closeOnOverlayClick={false}
      labelledBy={t("editor.forms.labelled_by_uid", { id })}
      describedBy={t("editor.forms.described_by_uid", { id })}
      onEsc={onCancel}
    >
      <Styled.ModalContent>
        <Styled.ModalHeader className="dialog__header">
          <Styled.Heading>
            <Styled.HeaderIcon icon={icon} size={32} />
            <h2 id={t("editor.forms.labelled_by_uid", { id })}>
              Browse Assets
            </h2>
          </Styled.Heading>
          <Styled.CloseButton onClick={onCancel} tabIndex={0}>
            <Styled.CloseText>{t("actions.close")}</Styled.CloseText>
            <Styled.CloseIcon icon="close24" size={24} />
          </Styled.CloseButton>
        </Styled.ModalHeader>
        <Styled.ModalBody>
          <BrowseList active={active} setActive={setActive} format={format} />
        </Styled.ModalBody>
        <Styled.ButtonGroup>
          <button onClick={onAdd} className={buttonClasses} data-id="accept">
            <span>{addLabel}</span>
          </button>
          <button
            className={classNames(buttonClasses, "button-secondary--dull")}
            onClick={onCancel}
            data-id="reject"
          >
            <span>{t("actions.cancel")}</span>
          </button>
        </Styled.ButtonGroup>
      </Styled.ModalContent>
    </Styled.Modal>
  );
}
