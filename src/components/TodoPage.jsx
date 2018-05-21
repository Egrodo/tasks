import React, { Component } from 'react';
import { Icon, List, Input, Form } from 'semantic-ui-react';
import axios from 'axios';
import Todo from './reuse/Todo';
import '../css/TodoPage.css';

// TODO: Restrict this page.

class TodoPage extends Component {
  // Key to keep track of item number in list.
  constructor() {
    super();
    this.state = {
      todo: '',
      items: [],
      key: 0,
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.saveEdit = this.saveEdit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  componentDidMount() {
    // This would probably work if I got the session working.
    axios.get('http://localhost:3001/todo').then(res => {
      console.log(res.body);
    }).catch(err => {
      console.error(err.response.data.error);
    });
  }

  onChange(e) {
    this.setState({ todo: e.target.value });
  }

  onSubmit(e) {
    // If the user has typed something, save it.
    if (!this.state.todo) return;
    e.preventDefault();
    this.setState({
      todo: '',
      items: [...this.state.items, {
        key: this.state.key,
        str: this.state.todo,
      }],
      key: this.state.key + 1,
    });
  }

  saveEdit(item, i) {
    const newState = Array.from(this.state.items);
    newState[i].str = item;
    this.setState({ items: newState });
  }

  deleteItem(i) {
    const newState = Array.from(this.state.items);
    newState.splice(i, 1);
    this.setState({ items: newState });
  }

  render() {
    return (
      <section>
        <header>
          Current Assignments
        </header>
        <List>
          {this.state.items.map((item, i) => (
            <List.Item key={item.key}>
              <Todo
                item={item.str}
                index={i}
                saveEdit={this.saveEdit}
                deleteItem={this.deleteItem}
              />
            </List.Item>
          ))}
          <List.Item key="new">
            <Form onSubmit={this.onSubmit}>
              <Input
                placeholder="New Todo..."
                value={this.state.todo}
                onChange={this.onChange}
                fluid
                icon={
                  <Icon
                    name="check"
                    link
                    onClick={this.onSubmit}
                  />
                }
              />
            </Form>
          </List.Item>
        </List>
      </section>
    );
  }
}

export default TodoPage;
