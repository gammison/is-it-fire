"use strict";

import React, { Component } from "react"
import io from "socket.io-client";

const socket = io(window.location.host + "/score");

class Body extends Component {

  constructor(props) {
    super(props);

    this.state = {
      rating: -1,
      waiting: false,
      item: ""
    };
  }

  componentDidMount = () => {
    socket.on("receive_rating", newScore => {
      this.setScore(newScore)
    });
  }

  setScore = score => {
    this.setState({ waiting: false, rating: score })
  }

  handleChange = e => {
    e.preventDefault();
    this.setState({
      item: e.target.value
    });
  }

  submit = e => {
    if(/\S/.test(this.state.item)){
      this.setState({ waiting: true });

      socket.emit("get_rating", this.state.item);
    }

    e.preventDefault();

    this.setState({
      item: ""
    });
  }

  handleKeyDown = e => {
    if (e.keyCode == 13 ) {
      this.submit(e);
    }
  }

  render() {
    return (
      <div className="content">
        <h1>Hello, Esteemed Web Wander!</h1>
        <br/>
        <h3>Paste a link and I"ll tell you if it"s <span className="fire">fire</span> or nah.</h3>
        { this.state.waiting ?
          <h4> Asking my crytal ball how fire af ur link is </h4> :
          <textarea className="lit-link"
            type = "text"
            rows="1"
            placeholder = "your lit ass link goes her"
            name="litLink"
            onChange = { this.handleChange.bind(this) }
            value = { this.state.item }
            onKeyDown = { this.handleKeyDown.bind(this) }>
          </textarea>
        }
        { this.state.rating != -1 ?
          <p> Your raw rating was {this.state.rating}. Scaled, this is a rating of {this.state.rating} </p>
          : null}
        { this.state.error ? this.state.error: null }
      </div>
    )
  }
}

export default Body;