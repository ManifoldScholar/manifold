import { Component, PropTypes } from 'react';
import nodeTreeIterator from './bodyNodes/helpers/nodeTreeIterator';

export default class SectionBody extends Component {

  static propTypes = {
    section: PropTypes.object,
  };

  render() {
    const node = this.props.section.attributes.bodyJson;
    const elements = nodeTreeIterator.visit(node);
    return elements;
  }
}
