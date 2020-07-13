import React, { Component } from 'react';

class ConfirmationReceipt extends Component { 
  
  constructor(props) {
    super(props);

    if(this.props.location.state === undefined){
        window.location = '/';
    }
  }

  render(){
    return (
    <div>
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Thanks for your order!</h5>
                <p class="card-text">Here's what we got: </p>
                <p class="card-text">{this.props.location.state.data.records[0].fields.name}</p>
                <p class="card-text">{this.props.location.state.data.records[0].fields.address}</p>
                <p class="card-text">{this.props.location.state.data.records[0].fields.requested_items}</p>
            </div>
        </div>
        <br></br>
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Your confirmation number is {this.props.location.state.data.records[0].fields.confirmation_number}</h5>
                <p class="card-text">Don't lose it!  If you would like to change anything - give us a call!</p>
            </div>
        </div>
    </div>
    );
  }
}
  
export default ConfirmationReceipt;

