import React, { Component } from 'react';
import { Icon, List, Input, Form } from 'semantic-ui-react';
import Todo from './Todo';

class TodoContainer extends Component {
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

  onChange(e) {
    this.setState({ todo: e.target.value });
  }

  onSubmit(e) {
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
      <List>
        {this.state.items.map((item, i) => (
          <List.Item key={item.key}>
            <Todo item={item.str} index={i} saveEdit={this.saveEdit} deleteItem={this.deleteItem} />
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
    );
  }
}

export default TodoContainer;
