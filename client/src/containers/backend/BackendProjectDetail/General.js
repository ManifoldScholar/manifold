import React, { Component, PropTypes } from 'react';
import { Project } from 'components/backend';
import { Link } from 'react-router';

export default class BackendProjectPanelGeneral extends Component {

  static displayName = "BackendProjectPanel.General";

  static propTypes = {};

  render() {
    const General = Project.Panel.General;
    return (
      <General.Wrapper />
    );
  }
}
