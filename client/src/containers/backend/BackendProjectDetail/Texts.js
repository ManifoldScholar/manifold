import React, { Component, PropTypes } from 'react';
import { Project } from 'components/backend';
import { Link } from 'react-router';

export default class BackendProjectPanelTexts extends Component {

  static displayName = "BackendProjectPanel.Texts";

  static propTypes = {};

  render() {
    const Texts = Project.Panel.Texts;
    return (
        <Texts.Wrapper />
    );
  }
}
