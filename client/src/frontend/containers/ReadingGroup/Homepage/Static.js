import { useTranslation } from "react-i18next";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  CollectionCategory,
  CollectionPlaceholder
} from "frontend/components/collecting/reading-group";
import { getEntityCollection } from "frontend/components/collecting/helpers";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import lh from "helpers/linkHandler";

function ReadingGroupHomepageStaticContainer() {
  const { readingGroup, categories, responses, refresh } =
    useOutletContext() || {};
  const { t } = useTranslation();
  const navigate = useNavigate();

  const closeUrl = lh.link(
    "frontendReadingGroupHomepageStatic",
    readingGroup.id
  );
  const closeDrawer = () => navigate(closeUrl);

  function handleUncollect(collection) {
    if (collection.id === readingGroup.id) refresh();
  }

  const collection = getEntityCollection(readingGroup);
  const uncategorizedMappings =
    collection.attributes?.categoryMappings.$uncategorized$;

  const hasPopulatedCategories = categories?.length > 0;
  const hasUncategorized = !!uncategorizedMappings;
  const showPlaceholder = !hasPopulatedCategories && !hasUncategorized;

  const uncategorized = {
    id: "$uncategorized$",
    attributes: {
      title: t("common.uncategorized_title_case")
    }
  };

  return (
    <>
      {showPlaceholder ? (
        <CollectionPlaceholder readingGroup={readingGroup} />
      ) : (
        <>
          {hasPopulatedCategories &&
            categories.map(category => (
              <CollectionCategory
                key={category.id}
                category={category}
                mappings={collection.attributes.categoryMappings}
                responses={responses}
                onUncollect={handleUncollect}
              />
            ))}
          {hasUncategorized && (
            <CollectionCategory
              category={uncategorized}
              mappings={collection.attributes.categoryMappings}
              responses={responses}
              onUncollect={handleUncollect}
            />
          )}
        </>
      )}
      <OutletWithDrawer
        context={{
          readingGroup,
          closeDrawer,
          onArchive: () => {
            refresh();
            closeDrawer();
          }
        }}
        drawerProps={{
          context: "frontend",
          size: "wide",
          position: "overlay",
          lockScroll: "always",
          closeUrl
        }}
      />
    </>
  );
}

ReadingGroupHomepageStaticContainer.displayName =
  "ReadingGroup.HomepageStaticContainer";

export default ReadingGroupHomepageStaticContainer;
