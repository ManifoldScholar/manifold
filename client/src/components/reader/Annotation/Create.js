import React, { PureComponent, PropTypes } from 'react';
import { Annotation } from 'components/reader';

export default class AnnotationCreate extends PureComponent {

  static displayName = "Annotation.Create";

  static propTypes = {
    annotation: PropTypes.object,
    selection: PropTypes.object,
    closeDrawer: PropTypes.func
  }

  render() {
    return (
      <Annotation.Selection.Wrapper {...this.props} annotating />
    );
  }

}
