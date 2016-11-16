import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import filesize from 'filesize';

export default class ResourceMeta extends Component {

  static displayName = "Resource.Meta";

  static propTypes = {
    resource: PropTypes.object,
    style: PropTypes.string
  };

  constructor() {
    super();
  }

  render() {
    const attr = this.props.resource.attributes;

    return (
      <section className="resource-meta">
        <figure className="resource-type">
          <i
            className={`manicon manicon-resource-${attr.kind}`}
          >
          </i>
        </figure>
        <ul className={`meta-list-${this.props.style}`}>
          <li>
            <span className="meta-label">{'Type'}</span>
            <span className="meta-value">
              {
                attr.kind.charAt(0).toUpperCase() +
                attr.kind.slice(1)
              }
            </span>
          </li>
          {attr.attachmentFileSize ?
            <li>
              <span className="meta-label">{'File Size'}</span>
              <span className="meta-value">
                { ' ' + filesize(attr.attachmentFileSize, { round: 0 }) }
              </span>
            </li> : null
          }
          {attr.attachmentContentType ?
            <li>
              <span className="meta-label">{'File Format'}</span>
              <span className="meta-value">
                {attr.attachmentContentType}
              </span>
            </li> : null
          }
          <li>
            <span className="meta-label">{'Created On'}</span>
            <span className="meta-value">
              {
                ` ${moment().month(attr.createdMonth - 1).format("MMMM")}
                ${attr.createdDay},
                ${attr.createdYear}`
              }
            </span>
          </li>
        </ul>

        <nav className="tag-list">
          <ul>
            <li>
              <Link to="#">
                Japan
              </Link>
            </li>
            <li>
              <Link to="#">
                Brucebraun
              </Link>
            </li>
            <li>
              <Link to="#">
                Culture
              </Link>
            </li>
            <li>
              <Link to="#">
                Word
              </Link>
            </li>
          </ul>
        </nav>
      </section>
    );
  }
}
