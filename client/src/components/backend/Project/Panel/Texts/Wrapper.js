import React, { Component, PropTypes } from 'react';
import { Form, Text } from 'components/backend';
import { Text as globalText } from 'components/global';
import { Link } from 'react-router';

export default class ProjcetPanelTexts extends Component {

  static displayName = "Project.Panel.Texts";

  static propTypes = {
    project: PropTypes.object
  };

  render() {
    const texts = this.props.project.relationships.texts;

    return (
      <section>
        <section className="text-category-list-secondary">
          <div className="text-category">
            <header>
              {/*
                NB: A span tag can be used inside category title to get a darker gray
                "Category:" color
                optional .highlight and .warning classes can be added to change the color
                to teal or pink, respectively
              */}
              <h4 className="category-title">Published</h4>
            </header>
            <ul className="texts-group">
              {/*
                This is a sample list of projects using real data,
                but eventually it should loop through categories and
                then texts
              */}
              {texts.map((text)=> {
                return (
                  <li>
                    <Text.ListItem text={text} />
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </section>
    );
  }
}
