import React, { Component } from 'react'
import io from 'socket.io-client';

const socket = io(window.location.host + "/score");

class Body extends Component {

  constructor(props) {
    super(props);

    this.state = {
      rating: -1,
      waiting: false
    };
  }

  componentDidMount = () => {
    socket.on("receive_rating", newScore => {
      this.setScore(newScore)
    });
  }

  submit = e => {
      e.preventDefault();
      e.stopPropagation();
      // send link to backend
      this.setState({ waiting: true });

      socket.emit("get_rating", e.target.childNodes[0].value);

      // let options = {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json'},
      //   body: JSON.stringify({ litLink: e.target.childNodes[0].value})
      // }
      // fetch(window.location.origin + '/api/isFire', options)
      //   .then(response => response.json())
      //   .then(score => this.setState({ waiting: false, rating: score.rating }) )
      //   .catch(err => {
      //     console.log(err);
      //     this.setState({error: JSON.stringify(err)});
      //   });
  }

  setScore = score => {
    this.setState({ waiting: false, rating: score })
  }

  render() {
    return (
      <div className='content'>
        <h1>Hello, Esteemed Web Wander!</h1>
        <br/>
        <h3>Paste a link and I'll tell you if it's <span className='fire'>fire</span> or nah.</h3>
        { this.state.waiting ?
          <h4> Asking my crytal ball how fire af ur link is </h4> :
        <form onSubmit = { this.submit }>
          <input className="lit-link" tabIndex="0" type="text" name="litLink" placeholder="your lit ass link goes here" />
        </form>
        }
        { this.state.rating != -1 ?
          <p> Your raw rating was {this.state.rating}. Scaled, this is a rating of {this.state.rating} </p>
          : null}
        {this.state.error ? this.state.error: null}
      </div>
    )
  }
}

export default Body;