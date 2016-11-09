import React, { Component, PropTypes } from 'react';
import { Project } from 'components/backend';
import { Link } from 'react-router';

export default class BackendProjectPanelTexts extends Component {

  static displayName = "BackendProjectPanel.Texts";

  // Used to hoist active state back up to parent container with navigation
  static activeNavItem = "texts";


  static propTypes = {};

  render() {
    const Texts = Project.Panel.Texts;
    return (
        <Texts.Wrapper />
    );
  }
}
