import React, { PureComponent, PropTypes } from 'react';
import { Annotation } from 'components/reader';
import { connect } from 'react-redux';
import { annotationsAPI, requests } from 'api';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { Utility } from 'components/frontend';
const { request, flush } = entityStoreActions;
const { select, meta } = entityUtils;
import { hash } from 'utils/string';

class AnnotationList extends PureComponent {

  static displayName = "Annotation.List";

  static propTypes = {
    annotations: PropTypes.array,
    annotationIds: PropTypes.array.isRequired,
    createAnnotation: PropTypes.func.isRequired
  }

  static defaultProps = {
    annotations: []
  }

  static mapStateToProps(state, ownProps) {
    const newState = {
      annotations: select(requests.rDrawerAnnotations, state.entityStore) || [],
    };
    return Object.assign({}, newState, ownProps);
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.fetchAnnotations(this.props);
  }

  annotationsGroupedBySubject() {
    const grouped = this.props.annotations.reduce((memo, annotation) => {
      const key = hash(annotation.attributes.subject.trim());
      if (!memo.hasOwnProperty(key)) {
        memo[key] = {
          annotations: [],
          selection: {
            hash: key,
            subject: annotation.attributes.subject,
            startNode: annotation.attributes.startNode,
            startChar: annotation.attributes.startChar,
            endNode: annotation.attributes.endNode,
            endChar: annotation.attributes.endChar
          }
        }
      }
      memo[key].annotations.push(annotation);
      return memo;
    }, {});
    return Object.values(grouped);
  }

  fetchAnnotations(props) {
    const sId = this.props.sectionId;
    const annotationsCall = annotationsAPI.forSection(sId, {ids: this.props.annotationIds});
    props.dispatch(request(annotationsCall, requests.rDrawerAnnotations));
  }

  render() {

    const grouped = this.annotationsGroupedBySubject();

    return (
      <div>
        <ul className="selection-list">
          {grouped.map((group) => {
            return (
              <li key={group.selection.hash} className="annotation-detail">
                <Annotation.Selection.Wrapper
                  {...group.selection}
                  truncate={250}
                  createAnnotation={this.props.createAnnotation}
                />
                <div className="container">
                  <ul className="annotation-list">
                    {group.annotations.map((annotation) => {
                      const creator = annotation.relationships.creator;
                      return (
                        <Annotation.Annotation
                          key={annotation.id}
                          creator={creator}
                          annotation={annotation}
                        />
                      );
                    })}
                  </ul>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    );
  }
}

export default connect(
  AnnotationList.mapStateToProps
)(AnnotationList);


const banana = (
  <div>
    <li className="annotation-detail">
      <Annotation.Selection.Wrapper annotation={{
        subject: "Selection with multiple annotations, Maecenas sed diam eget risus" +
        " varius blandit sit amet non magna."
      }}/>

      <div className="container">
        <ul className="annotation-list">
          <li className="annotation-annotation">
            <section className="meta">
              <div>
                <figure className="author-avatar">
                  <i className="manicon manicon-person"></i>
                </figure>
                <h4 className="author-name">
                  Me
                </h4>
                <datetime>
                  1 day ago
                </datetime>
              </div>
            </section>
            <section className="body">
              {'Etiam porta sem malesuada magna mollis euismod. Aenean lacinia ' +
              'bibendum nulla sed consectetur. Curabitur blandit tempus porttitor.'}
            </section>
            <nav className="utility">
              <ul>
                <li>
                  <button>{'Reply'}</button>
                </li>
                <li>
                  <button>{'Edit'}</button>
                </li>
                <li>
                  <Utility.ShareBar url="#"/>
                </li>
                <li>
                  <button>{'Delete'}</button>
                </li>
              </ul>
            </nav>
            <div className="annotation-comment-thread">
              <ul className="comment-list">
                <li className="annotation-comment">
                  <section className="meta">
                    <div>
                      <figure className="author-avatar dull">
                        <i className="manicon manicon-person"></i>
                      </figure>
                      <h4 className="author-name">
                        Zach Davis
                        <span className="reply-to">
                                <i className="manicon manicon-arrow-curved-right"></i>
                                Reply to Me
                              </span>
                      </h4>
                      <datetime>
                        1 day ago
                      </datetime>
                    </div>
                  </section>
                  <section className="body">
                    {'Nullam id dolor id nibh ultricies vehicula ut id elit. Aenean eu' +
                    ' leo quam. Pellentesque ornare sem lacinia quam venenatis ' +
                    'vestibulum. Vestibulum id ligula porta felis euismod semper.'}
                  </section>
                  <nav className="utility">
                    <ul>
                      <li>
                        <button>{'Reply'}</button>
                      </li>
                      <li>
                        <Utility.ShareBar url="#"/>
                      </li>
                      <li>
                        <button>{'Flag'}</button>
                      </li>
                    </ul>
                  </nav>
                  {/*
                   NB: Nested comment thread would go here with the exact
                   same markup as this one, starting with
                   <div className="annotation-comment-thread">
                   */}
                </li>
                <li className="annotation-comment">
                  <section className="meta">
                    <div>
                      <figure className="author-avatar dull">
                        <i className="manicon manicon-person"></i>
                      </figure>
                      <h4 className="author-name">
                        Lucas Thurston
                        <span className="reply-to">
                                <i className="manicon manicon-arrow-curved-right"></i>
                                Reply to Zach Davis
                              </span>
                      </h4>
                      <datetime>
                        1 day ago
                      </datetime>
                    </div>
                  </section>
                  <section className="body">
                    {'Praesent commodo cursus magna, vel scelerisque nisl consectetur et.'}
                  </section>
                  <nav className="utility">
                    <ul>
                      <li>
                        <button>{'Reply'}</button>
                      </li>
                      <li>
                        <Utility.ShareBar url="#"/>
                      </li>
                      <li>
                        <button>{'Flag'}</button>
                      </li>
                    </ul>
                  </nav>
                </li>
              </ul>
            </div>
          </li>
          <li className="annotation-annotation">
            <section className="meta">
              <div>
                <figure className="author-avatar dull">
                  <i className="manicon manicon-person"></i>
                </figure>
                <h4 className="author-name">
                  Davide Panagia
                </h4>
                <datetime>
                  1 day ago
                </datetime>
              </div>
              <div className="marker">
                Author
              </div>
            </section>
            <section className="body">
              {'Nulla vitae elit libero, a pharetra augue. Maecenas faucibus ' +
              'mollis interdum. Maecenas sed diam eget risus varius blandit sit.'}
            </section>
            <nav className="utility">
              <ul>
                <li>
                  <button>{'Reply'}</button>
                </li>
                <li>
                  <Utility.ShareBar url="#"/>
                </li>
                <li>
                  <button>{'Flag'}</button>
                </li>
              </ul>
            </nav>
          </li>
        </ul>
      </div>
    </li>
    <li className="annotation-detail">
      <Annotation.Selection.Wrapper annotation={{
        subject: "Selection with a very large number of  annotations, Vivamus " +
        "sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Praesent " +
        "commodo cursus magna,"
      }}/>

      <div className="container">
        <ul className="annotation-list">
          <li className="annotation-annotation">
            <section className="meta">
              <div>
                <figure className="author-avatar dull">
                  <i className="manicon manicon-person"></i>
                </figure>
                <h4 className="author-name">
                  Shannon Mattern
                </h4>
                <datetime>
                  1 day ago
                </datetime>
              </div>
            </section>
            <section className="body">
              {'Aenean lacinia bibendum nulla sed consectetur. Cras justo odio, dapibus' +
              ' ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis' +
              ' euismod semper. Maecenas sed diam eget risus varius blandit sit amet non ' +
              'magna.'}
            </section>
            <nav className="utility">
              <ul>
                <li>
                  <button>{'Reply'}</button>
                </li>
                <li>
                  <Utility.ShareBar url="#"/>
                </li>
                <li>
                  <button>{'Flag'}</button>
                </li>
              </ul>
            </nav>
          </li>
          <li className="annotation-annotation">
            <section className="meta">
              <div>
                <figure className="author-avatar dull">
                  <i className="manicon manicon-person"></i>
                </figure>
                <h4 className="author-name">
                  Hugo Gernsback
                </h4>
                <datetime>
                  1 day ago
                </datetime>
              </div>
            </section>
            <section className="body">
              {'Nullam quis risus eget urna mollis ornare vel eu leo. Nullam id dolor id ' +
              'nibh ultricies vehicula ut id elit.'}
            </section>
            <nav className="utility">
              <ul>
                <li>
                  <button>{'Reply'}</button>
                </li>
                <li>
                  <Utility.ShareBar url="#"/>
                </li>
                <li>
                  <button>{'Flag'}</button>
                </li>
              </ul>
            </nav>
            <div className="annotation-comment-thread">
              <ul className="comment-list">
                <li className="annotation-comment">
                  <section className="meta">
                    <div>
                      <figure className="author-avatar dull">
                        <i className="manicon manicon-person"></i>
                      </figure>
                      <h4 className="author-name">
                        {'Gabe Blair'}
                        <span className="reply-to">
                                <i className="manicon manicon-arrow-curved-right"></i>
                                Reply to Hugo Gernsback
                              </span>
                      </h4>
                      <datetime>
                        1 day ago
                      </datetime>
                    </div>
                  </section>
                  <section className="body">
                    {'Mollis Venenatis Tellus Consectetur Sem'}
                  </section>
                  <nav className="utility">
                    <ul>
                      <li>
                        <button>{'Reply'}</button>
                      </li>
                      <li>
                        <Utility.ShareBar url="#"/>
                      </li>
                      <li>
                        <button>{'Flag'}</button>
                      </li>
                    </ul>
                  </nav>
                  {/*
                   NB: Nested comment thread would go here with the exact
                   same markup as this one, starting with
                   <div className="annotation-comment-thread">
                   */}
                </li>
                <li className="annotation-comment">
                  <section className="meta">
                    <div>
                      <figure className="author-avatar dull">
                        <i className="manicon manicon-person"></i>
                      </figure>
                      <h4 className="author-name">
                        {'Max Ono'}
                        <span className="reply-to">
                                <i className="manicon manicon-arrow-curved-right"></i>
                                Reply to Gabe Blair
                              </span>
                      </h4>
                      <datetime>
                        1 day ago
                      </datetime>
                    </div>
                  </section>
                  <section className="body">
                    {'Sed posuere consectetur est at lobortis. Lorem ipsum dolor sit ' +
                    'amet, consectetur adipiscing elit. Nulla vitae elit libero, a ' +
                    'pharetra augue. Integer posuere erat a ante venenatis dapibus ' +
                    'posuere velit aliquet.'}
                  </section>
                  <nav className="utility">
                    <ul>
                      <li>
                        <button>{'Reply'}</button>
                      </li>
                      <li>
                        <Utility.ShareBar url="#"/>
                      </li>
                      <li>
                        <button>{'Flag'}</button>
                      </li>
                    </ul>
                  </nav>
                </li>
                <li className="annotation-comment">
                  <section className="meta">
                    <div>
                      <figure className="author-avatar dull">
                        <i className="manicon manicon-person"></i>
                      </figure>
                      <h4 className="author-name">
                        {'Alexa Grey'}
                        <span className="reply-to">
                                <i className="manicon manicon-arrow-curved-right"></i>
                                Reply to Max Ono
                              </span>
                      </h4>
                      <datetime>
                        1 day ago
                      </datetime>
                    </div>
                  </section>
                  <section className="body">
                    {'Cras justo odio, dapibus ac facilisis in, egestas eget quam. Aenean ' +
                    'eu leo quam. Pellentesque ornare sem lacinia quam venenatis ' +
                    'vestibulum. Sed posuere consectetur est at lobortis. Lorem ipsum ' +
                    'dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit ' +
                    'amet, consectetur adipiscing elit. Donec id elit non mi porta gravida ' +
                    'at eget metus. Cras mattis consectetur purus sit amet fermentum.'}
                  </section>
                  <nav className="utility">
                    <ul>
                      <li>
                        <button>{'Reply'}</button>
                      </li>
                      <li>
                        <Utility.ShareBar url="#"/>
                      </li>
                      <li>
                        <button>{'Flag'}</button>
                      </li>
                    </ul>
                  </nav>
                </li>
              </ul>

              <div className="comment-more">
                <div className="button-trim-primary">
                  See all 17 comments
                </div>
              </div>
            </div>
          </li>
          <li className="annotation-annotation">
            <section className="meta">
              <div>
                <figure className="author-avatar dull">
                  <i className="manicon manicon-person"></i>
                </figure>
                <h4 className="author-name">
                  Zach Davis
                </h4>
                <datetime>
                  1 day ago
                </datetime>
              </div>
            </section>
            <section className="body">
              {'Cum sociis natoque penatibus et magnis dis parturient montes, ' +
              'nascetur ridiculus mus. Etiam porta sem malesuada magna mollis euismod.'}
            </section>
            <nav className="utility">
              <ul>
                <li>
                  <button>{'Reply'}</button>
                </li>
                <li>
                  <Utility.ShareBar url="#"/>
                </li>
                <li>
                  <button>{'Flag'}</button>
                </li>
              </ul>
            </nav>
          </li>
          <li className="annotation-more">
            {/*
             NB: The dom naturally stacks elements from first (bottom)
             to last (top) on the z-axis. So the cleanest way of doing the
             opposite is to assign a relative zIndex position to each listing
             that is equal to the length of the list - the position of the listing
             in the list.
             */}
            <a href="#">
              <ul className="avatar-list">
                <li className="avatar dull" style={{ zIndex: 5 }}>
                  <i className="manicon manicon-person"></i>
                  <span className="screen-reader-text">
                          {'Also annotated by: First Name, Last Name'}
                        </span>
                </li>
                <li className="avatar dull" style={{ zIndex: 4 }}>
                  <i className="manicon manicon-person"></i>
                  <span className="screen-reader-text">
                          {'Also annotated by: First Name, Last Name'}
                        </span>
                </li>
                <li className="avatar dull" style={{ zIndex: 3 }}>
                  <i className="manicon manicon-person"></i>
                  <span className="screen-reader-text">
                          {'Also annotated by: First Name, Last Name'}
                        </span>
                </li>
                <li className="avatar dull" style={{ zIndex: 2 }}>
                  <i className="manicon manicon-person"></i>
                  <span className="screen-reader-text">
                          {'Also annotated by: First Name, Last Name'}
                        </span>
                </li>
                <li className="avatar dull" style={{ zIndex: 1 }}>
                  <i className="manicon manicon-person"></i>
                  <span className="screen-reader-text">
                          {'Also annotated by: First Name, Last Name'}
                        </span>
                </li>
              </ul>
              <span className="label">
                      36 Others have annotated this passage
                    </span>
              <div className="button-trim-primary">
                See All
              </div>
            </a>
          </li>
        </ul>
      </div>
    </li>
  </div>
)
