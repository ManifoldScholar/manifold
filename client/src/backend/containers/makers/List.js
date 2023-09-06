import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { makersAPI, requests } from "api";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import withFilteredLists, { makerFilters } from "hoc/withFilteredLists";
import { useParams } from "react-router-dom";
import { usePaginationState, useSetLocation, useFetch } from "hooks";

import EntitiesList, {
  Search,
  Button,
  MakerRow
} from "backend/components/list/EntitiesList";

function MakersListContainer({
  entitiesListSearchProps,
  entitiesListSearchParams,
  route
}) {
  const { t } = useTranslation();
  const { id } = useParams();

  const [pagination, setPageNumber] = usePaginationState(1, 10);

  const { data: makers, meta: makersMeta, refresh } = useFetch({
    request: [makersAPI.index, entitiesListSearchParams.makers, pagination],
    options: { requestKey: requests.beMakers }
  });

  useSetLocation({
    filters: entitiesListSearchParams.makers,
    page: pagination.number
  });

  if (!makers || !makersMeta) return null;

  const drawerProps = {
    closeUrl: lh.link("backendRecordsMakers"),
    lockScroll: "always"
  };

  return (
    <>
      {childRoutes(route, {
        drawer: true,
        drawerProps,
        childProps: { refetch: refresh }
      })}
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
          search={<Search {...entitiesListSearchProps("makers")} />}
          entities={makers}
          entityComponent={MakerRow}
          entityComponentProps={{ active: id }}
          pagination={makersMeta.pagination}
          showCount
          unit={t("glossary.maker", {
            count: makersMeta.pagination.totalCount
          })}
          callbacks={{
            onPageClick: page => e => {
              e.preventDefault();
              setPageNumber(page);
            }
          }}
          usesQueryParams
        />
      )}
    </>
  );
}

MakersListContainer.displayName = "Makers.List";

MakersListContainer.propTypes = {
  entitiesListSearchProps: PropTypes.func.isRequired,
  entitiesListSearchParams: PropTypes.object.isRequired,
  route: PropTypes.object
};

export default withFilteredLists(MakersListContainer, {
  makers: makerFilters()
});
