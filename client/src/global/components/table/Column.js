import React from "react";
import PropTypes from "prop-types";

export default class TableColumn extends React.PureComponent {
  static displayName = "GenericTable.Column";

  static propTypes = {
    children: PropTypes.func.isRequired
  };
}
