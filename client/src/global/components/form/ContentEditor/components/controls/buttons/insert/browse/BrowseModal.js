import { useId, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ingestionSourcesAPI } from "api";
import { useParams } from "react-router-dom";
import { useFetch, usePaginationState } from "hooks";
import Button from "global/components/atomic/Button";
import BrowseList from "./BrowseList";
import * as Styled from "./styles";

export default function BrowseModal(props) {
  const { icon, addLabel, closeModal, onSelect, format } = props;
  const uid = useId();
  const { t } = useTranslation();

  const [active, setActive] = useState(null);

  const onCancel = e => {
    e.preventDefault();
    closeModal();
  };

  const onAdd = e => {
    e.preventDefault();
    onSelect(active);
    closeModal();
  };

  const { id } = useParams();

  const [pagination, setPageNumber] = usePaginationState(1, 8);

  const filters = useMemo(() => ({ format }), [format]);

  const { data: assets, meta: assetsMeta, loaded } = useFetch({
    request: [ingestionSourcesAPI.index, id, filters, pagination],
    condition: !!id
  });

  return loaded ? (
    <Styled.Modal
      showCloseButton={false}
      closeOnOverlayClick={false}
      labelledBy={t("editor.forms.labelled_by_uid", { uid })}
      describedBy={t("editor.forms.described_by_uid", { uid })}
      onEsc={onCancel}
    >
      <Styled.Content>
        <Styled.ModalHeader className="dialog__header">
          <Styled.Heading>
            <Styled.HeaderIcon icon={icon} size={32} />
            <h2 id={t("editor.forms.labelled_by_uid", { uid })}>
              Browse Assets
            </h2>
          </Styled.Heading>
          <Styled.CloseButton onClick={onCancel} tabIndex={0}>
            <Styled.CloseText>{t("actions.close")}</Styled.CloseText>
            <Styled.CloseIcon icon="close24" size={24} />
          </Styled.CloseButton>
        </Styled.ModalHeader>
        <BrowseList
          assets={assets}
          assetsMeta={assetsMeta}
          setPageNumber={setPageNumber}
          active={active}
          setActive={setActive}
          format={format}
        />
        <Styled.ButtonGroup>
          <Button
            onClick={onAdd}
            data-id="accept"
            label={addLabel}
            size="md"
            background="outline-accent"
          />
          <Button
            onClick={onCancel}
            data-id="reject"
            label={t("actions.cancel")}
            size="md"
            background="outline"
          />
        </Styled.ButtonGroup>
      </Styled.Content>
    </Styled.Modal>
  ) : null;
}
