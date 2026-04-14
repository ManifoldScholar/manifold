import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useRevalidator } from "react-router";
import { ingestionSourcesAPI } from "api";
import loadList from "app/routes/utility/loaders/loadList";
import { useListQueryParams, useApiCallback } from "hooks";
import useConfirmation from "hooks/useConfirmation";
import Form from "global/components/form";
import Dialog from "global/components/dialog";
import OutletWithDrawers from "global/components/router/OutletWithDrawers";
import EntitiesList, {
  Button,
  Search,
  AssetRow
} from "components/backend/list/EntitiesList";
import { INIT_SEARCH_PROPS } from "./filters";
import * as Styled from "./styles";

export const loader = async ({ params, request, context }) => {
  return loadList({
    request,
    context,
    fetchFn: (filters, pagination) =>
      ingestionSourcesAPI.index(params.id, filters, pagination),
    options: { defaultPagination: { page: 1, perPage: 10 } }
  });
};

export default function TextAssetsLayout({ loaderData }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const text = useOutletContext();
  const { confirm, confirmation } = useConfirmation();
  const { revalidate } = useRevalidator();
  const { data: assets, meta } = loaderData;

  const { searchProps } = useListQueryParams({
    initSize: 10,
    initSearchProps: INIT_SEARCH_PROPS
  });

  const onEdit = id => {
    navigate(`/backend/projects/text/${text.id}/assets/${id}`);
  };

  const deleteAsset = useApiCallback(ingestionSourcesAPI.destroy);

  const onDelete = id => {
    confirm({
      heading: t("modals.delete_asset"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        try {
          await deleteAsset(id);
          revalidate();
          closeDialog();
        } catch {
          closeDialog();
        }
      }
    });
  };

  const closeUrl = `/backend/projects/text/${text.id}/assets`;

  const drawerProps = {
    lockScroll: "always",
    lockScrollClickCloses: false,
    closeUrl,
    size: "default",
    padding: "default"
  };

  return (
    <Styled.Wrapper>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <OutletWithDrawers drawerProps={drawerProps} context={text} />
      <Form.Header
        label={t("texts.assets.header")}
        instructions={t("texts.assets.instructions")}
      />
      <EntitiesList
        className="full-width"
        entityComponent={AssetRow}
        entityComponentProps={{ onEdit, onDelete }}
        entities={assets ?? []}
        buttons={[
          <Button
            path={`/backend/projects/text/${text.id}/assets/new`}
            type="add"
            text={t("texts.assets.add_button_label")}
          />
        ]}
        search={<Search {...searchProps} />}
        pagination={meta?.pagination}
        showCount
        unit={t("glossary.asset", {
          count: meta?.pagination?.totalCount
        })}
      />
    </Styled.Wrapper>
  );
}
