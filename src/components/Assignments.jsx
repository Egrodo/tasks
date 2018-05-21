import React, { Component } from 'react';
import { Icon, List, Input, Form } from 'semantic-ui-react';
import Assignment from './reuse/Assignment';
import '../css/Assignments.css';

class Assignments extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      content: '',
      items: [
        {
          title: 'Love Letter',
          content: "I need to write a love letter to my Marin by this Wednesday to show her that I'm a decent guy",
        },
        {
          title: 'Loreum Ipsum',
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        }
      ],
      key: 0,
    };
  }

  render() {
    // TODO: Handle rich text via Draftjs.
    // Handle bool if no assignments yet.
    return (
      <section className="assignments">
        <header>
          {this.state.items.length > 0 ? "Current Assignments" : "New Assignment"}
        </header>
        <List>
          {this.state.items.map((item, i) => (
            <List.Item>
              <Assignment
                item={item}
                index={i}
              />
            </List.Item>
          ))}
        </List>
      </section>
    );
  }
}

export default Assignments;