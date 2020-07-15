import React, { Component } from 'react';

class RequestList extends Component { 
  
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
    };
    this.airtable_api_key=process.env.REACT_APP_AIRTABLE_API_KEY;
  }


  componentDidMount() {
    console.log(this.airtable_api_key);
    fetch('https://api.airtable.com/v0/appa6sKWNwbFaCvRG/delivery_requests?api_key='+this.airtable_api_key+'&view=Grid%20view')
    .then((resp) => resp.json())
    .then(data => {
      console.log(data)
       this.setState({ requests: data.records });
    }).catch(err => {
      console.log("error")
    });
  }

  render(){
    return (
        <div class="row">
          <div class="col-1"></div>
          <div class="col-10">
            <table class="table">
              <thead>
                  <th>Received</th>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Preferred Contact</th>
                  <th>Items</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th>Language</th>
                </thead>
                <tbody>
                  {this.state.requests.map(request => <Request {...request.fields} /> )}
                </tbody>
              </table>
          </div>
          <div class="col-1"></div>
        </div>
    );
  }
}
  
export default RequestList;

const Request = ({received_timestamp, contact_type, name, address, phone_number, preferred_contact, requested_items, notes, status, language}) => (
  <tr>
    <td>{received_timestamp}</td>
    <td>{contact_type}</td>
    <td>{name}</td>
    <td>{address}</td>
    <td>{phone_number}</td>
    <td>{preferred_contact}</td>
    <td>{requested_items}</td>
    <td>{notes}</td>
    <td>{status}</td>
    <td>{language}</td>
  </tr>
);

