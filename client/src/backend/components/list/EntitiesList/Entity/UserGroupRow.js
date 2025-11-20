import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import EntityRow from "./Row";

export default function UserGroupRow({ entity }) {
  const { attributes, id } = entity;

  const additionalProps = {
    title: attributes.name,
    rowClickMode: "block",
    onRowClick: lh.link("backendRecordsUserGroup", id)
  };
  return <EntityRow entity={entity} {...additionalProps} />;
}

UserGroupRow.displayName = "EntitiesList.Entity.UserGroupRow";

UserGroupRow.propTypes = {
  entity: PropTypes.object
};
