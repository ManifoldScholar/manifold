import { Component, PropTypes } from 'react';
import BodyNodes from './BodyNodes';
export default class Body extends Component {

  static propTypes = {
    section: PropTypes.object,
  };

  render() {
    const iterator = new BodyNodes.Helpers.NodeTreeIterator;
    const node = this.props.section.attributes.bodyJson;
    const elements = iterator.visit(node);
    return elements;
  }
}
