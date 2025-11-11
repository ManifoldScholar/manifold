import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makersAPI, requests } from "api";
import lh from "helpers/linkHandler";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import withFilteredLists, { makerFilters } from "hoc/withFilteredLists";
import { useParams } from "react-router-dom";
import { useFetch, useListQueryParams } from "hooks";
import Authorize from "hoc/Authorize";

import EntitiesList, {
  Search,
  Button,
  MakerRow
} from "backend/components/list/EntitiesList";

function MakersListContainer({
  entitiesListSearchProps,
  entitiesListSearchParams
}) {
  const { t } = useTranslation();
  const { id } = useParams();

  const { pagination, filters, searchProps } = useListQueryParams({
    initSize: 10,
    initFilters: entitiesListSearchParams.makers,
    initSearchProps: entitiesListSearchProps("makers")
  });

  const { data: makers, meta: makersMeta, refresh } = useFetch({
    request: [makersAPI.index, filters, pagination],
    options: { requestKey: requests.beMakers }
  });

  if (!makers || !makersMeta) return null;

  const drawerProps = {
    closeUrl: lh.link("backendRecordsMakers"),
    lockScroll: "always"
  };

  return (
    <Authorize
      ability="update"
      entity={["maker"]}
      failureNotification={{
        body: t("errors.access_denied.authorization_admin_type", {
          type: "makers"
        })
      }}
      failureRedirect
    >
      <OutletWithDrawer
        drawerProps={drawerProps}
        context={{ refetch: refresh }}
      />
      {makers && (
        <EntitiesList
          title={t("records.makers.header")}
          titleStyle="bar"
          buttons={[
            <Button
              path={lh.link("backendRecordsMakersNew")}
              text={t("records.makers.button_label")}
              type="add"
              authorizedFor="maker"
            />
          ]}
          search={<Search {...searchProps} />}
          entities={makers}
          entityComponent={MakerRow}
          entityComponentProps={{ active: id }}
          pagination={makersMeta.pagination}
          showCount
          unit={t("glossary.maker", {
            count: makersMeta.pagination.totalCount
          })}
        />
      )}
    </Authorize>
  );
}

MakersListContainer.displayName = "Makers.List";

MakersListContainer.propTypes = {
  entitiesListSearchProps: PropTypes.func.isRequired,
  entitiesListSearchParams: PropTypes.object.isRequired
};

export default withFilteredLists(MakersListContainer, {
  makers: makerFilters()
});
