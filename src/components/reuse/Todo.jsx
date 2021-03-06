import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Form, Icon } from 'semantic-ui-react';

class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todo: props.item,
      editing: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onChange(e) {
    this.setState({ todo: e.target.value, editing: true });
  }

  onSubmit(e) {
    // If the item has been changed, save it.
    e.preventDefault();
    if (this.state.todo !== this.props.item) this.props.saveEdit(this.state.todo, this.props.index);
    this.setState({ editing: false });
  }

  onDelete() {
    this.props.deleteItem(this.props.index);
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        <Input
          value={this.state.todo}
          onChange={this.onChange}
          fluid
          icon={this.state.editing ?
            <Icon
              name="check"
              link
              onClick={this.onSubmit}
            />
            :
            <Icon
              name="delete"
              link
              onClick={this.onDelete}
            />
          }
        />
      </Form>
    );
  }
}

Todo.propTypes = {
  item: PropTypes.string,
  index: PropTypes.number,
  saveEdit: PropTypes.func,
  deleteItem: PropTypes.func,
};

Todo.defaultProps = {
  item: '',
  index: -1,
  saveEdit: Function,
  deleteItem: Function,
};

export default Todo;
