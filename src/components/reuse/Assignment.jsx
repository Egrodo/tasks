import React, { Component } from 'react';
import { Icon, Container, Divider } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class Assignment extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      display: false,
    };
    
    this.onClick = this.onClick.bind(this);
  }
  
  onClick() {
    this.setState({ display: !this.state.display });
  }

  render() {
    // TODO: Onclicks, Loader
    return (
      <article className="assignment">
        <div onClick={this.onClick}>
          <span style={this.state.display ? {borderBottom: '1px solid white'} : {}}>
            {this.props.item.title}
          </span>
          <Icon
            name={this.state.display ? "angle up" : "angle down"}
            link
          />
        </div>
        {
          this.state.display ? 
            <Container text fluid>
              <p>{this.props.item.content}</p>
            </Container>
            : ''
        }  
      </article>
    );
  }
}

Assignment.propTypes = {
  item: PropTypes.object,
  key: PropTypes.number,
};

Assignment.defaultProps = {
  item: {},
  key: -1,
};

export default Assignment;