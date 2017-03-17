import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames';
import { Resource } from 'components/frontend';

export default class KindPicker extends PureComponent {

  static displayName = "Resource.KindPicker";

  static propTypes = {
    kind: PropTypes.string,
    setKind: PropTypes.func
  };

  render() {
    const kindList = [
      'Image',
      'Video',
      'Audio',
      'File',
      'Link',
      'PDF',
      'Document',
      'Spreadsheet',
      'Presentation',
      'Interactive',
    ];

    return (
      <div className="resource-kind-picker">
        <ul>
          {kindList.map((kind) => {
            const safeKind = kind.toLowerCase();
            const buttonClass = classNames({
              active: safeKind === this.props.kind
            });
            return (
              <li key={kind}>
                <button
                  onClick={() => { this.props.setKind(safeKind); }}
                  className={buttonClass}
                >
                  <figure>
                    <figcaption>
                      {kind}
                    </figcaption>
                    <div className={`resource-icon ${safeKind}`}>
                      <Resource.Icon.Composer kind={safeKind}/>
                    </div>
                  </figure>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

}
