import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router';
import { EventList, PublishedText, GroupedTexts, MetaAttributes, ProjectDetailHero } from '../../components/frontend';
import { fetchOneProject } from '../../actions/shared/collections';
import connectData from '../../decorators/connectData';

function fetchData(getState, dispatch, location, params) {
  return Promise.all([
    fetchOneProject(params.id)(dispatch, getState)
  ]);
}

function mapStateToProps(state) {
  const fetchOneProjectResult = state.collections.results.fetchOneProject.entities;
  const projects = state.collections.entities.projects;
  const project = projects[fetchOneProjectResult];

  return {
    project: project,
    makers: state.collections.entities.makers
  };
}

@connectData(fetchData)
@connect(mapStateToProps)
export default class ProjectDetail extends Component {

  static propTypes = {
    project: PropTypes.object,
    makers: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  // TODO: Remove this at some future point
  state = {
    activity: [
      {
        type: 'text',
        action: 'add',
        title: 'Japanese Documentary Film',
        subtitle: 'The Meiji Era Through Hiroshima',
        date: 'October 9, 2015'
      },
      {
        type: 'twitter',
        user: 'UMNews',
        content: 'Aenean lacinia bibendum nulla sed consectetur. Lorem ipsum dolor sit amet.',
        date: 'September 29, 2015'
      },
      {
        type: 'comment',
        content: 'Sed posuere consectetur est at lobortis, Integer posuere erat a ante venenatis dapibus posuere velit aliquet.',
        date: 'July 30, 2015',
        user: {
          id: 27,
          display_name: 'Zach Davis'
        }
      },
      {
        type: 'file',
        title: 'Image File Name',
        date: 'March 13, 2015'
      },
      {
        type: 'comment',
        content: 'Cras mattis consectetur purus sit amet fermentum. Maecenas sed diam eget risus varius blandit sit amet non magna.',
        date: 'December 21, 2014',
        user: {
          id: 27,
          display_name: 'Alberto Gutiérrez'
        }
      },
      {
        type: 'init',
        date: 'November 6, 2014'
      }
    ],
    categories: [
      {
        title: 'Drafts',
        id: 276
      },
      {
        title: 'Research',
        id: 313
      }
    ],
    texts: [
      {
        id: '1',
        type: 'texts',
        attributes: {
          title: 'Japanese Documentary Film',
          subtitle: 'The Meiji Era through Hiroshima',
          cover_url: '/placeholder/browse-pCover-nornes01.jpg',
          created_at: 'September 29, 2015',
          published: true,
        },
        relationships: {
          category: {}
        }
      },
      {
        id: '2',
        type: 'texts',
        attributes: {
          title: 'Healing the Watershed of the Coaster Brook Trout',
          subtitle: 'The Meiji Era through Hiroshima',
          cover_url: null,
          created_at: 'October 2, 2015',
          published: false
        },
        relationships: {
          category: {
            id: 276
          }
        }
      },
      {
        id: '3',
        type: 'texts',
        attributes: {
          title: 'The Women of Bakken',
          subtitle: 'Lorem ipsum dolor sit amet',
          cover_url: null,
          created_at: 'June 30, 2014',
          published: false
        },
        relationships: {
          category: {
            id: 276
          }
        }
      },
      {
        id: '4',
        type: 'texts',
        attributes: {
          title: 'Chapter One',
          subtitle: 'Bodies, Subjects, and Struggles in the Bakken Oil Boom',
          cover_url: null,
          created_at: 'February 17, 2015',
          published: false
        },
        relationships: {
          category: {
            id: 276
          }
        }
      },
      {
        id: '5',
        type: 'texts',
        attributes: {
          title: 'Sustainability and North Dakota\'s oil boom',
          subtitle: null,
          cover_url: null,
          created_at: 'August 2, 1976',
          published: false
        },
        relationships: {
          category: {
            id: 313
          }
        }
      }
    ],
    meta: [
      {
        key: 'Publisher',
        value: 'University of Minnesota Press'
      },
      {
        key: 'Editor',
        value: 'Jason Weidemann'
      }
    ]
  };

  lookupMaker = (id) => {
    return this.props.makers[id];
  };

  listActivity = () => {
    if (this.state.activity.length > 0) {
      return (
          <section>
            <div className="container">
              <header className="rel">
                <h4 className="section-heading">
                  <i className="manicon manicon-pulse"></i>
                  {'Recent Activity'}
                </h4>
                <div className="section-heading-utility-right">
                  <Link to={`#`} className="button-primary">
                    See all Activity
                  </Link>
                </div>
              </header>
              <EventList events={this.state.activity} />
            </div>
          </section>
      );
    }
  };

  listMeta = () => {
    if (this.state.meta.length > 0) {
      return (
        <section>
          <div className="container">
            <header className="rel">
              <h4 className="section-heading">
                <i className="manicon manicon-tag"></i>
                  {'Metadata'}
              </h4>
            </header>
            <MetaAttributes data={this.state.meta} />
          </div>
        </section>
      );
    }
  };

  render = () => {
    const project = this.props.project;
    const makers = [];

    // Fill makers array with available makers
    if (project.relationships.creators.data.length) {
      project.relationships.creators.data.forEach((makerRel) => {
        makers.push(this.lookupMaker(makerRel.id));
      });
    }

    return (
        <div>
          <section className="neutral20">
            <div className="container">
              <ProjectDetailHero project={project} makers={makers} />
            </div>
          </section>
          {/*
            Logic to output lists conditionally here is not necessarily final, but
            it simulates how this section could be made optional based on a flag and/or
            a minimum number of activity updates
          */}
          {this.listActivity()}
          <section>
            <div className="container">
              <header className="rel">
                <h4 className="section-heading">
                  <i className="manicon manicon-books-stack"></i>
                  {'Texts'}
                </h4>
              </header>
              <PublishedText texts={this.state.texts} />
              <GroupedTexts categories={this.state.categories} texts={this.state.texts} />
            </div>
          </section>
          {this.listMeta()}
        </div>
    );
  };
}
