import React, { Component } from 'react';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
// import { BrowserRouter as Router, Route} from "react-router-dom";
import history from "../history";
import { v4 as uuidv4 } from 'uuid';
import {geocode } from '../services/address.service.js';

const AddressCandidate = props => (
    <p onClick={() => { props.chooseAddressFromCandidates(props.result.formatted_address) }}>{props.result.formatted_address}</p>
);

class RequestEntry extends Component { 
  
  constructor(props) {
    super(props);

    this.airtable_api_key=process.env.REACT_APP_AIRTABLE_API_KEY;
    console.log(this.airtable_api_key);

    this.onContactTypeChange = this.onContactTypeChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onAddressChange = this.onAddressChange.bind(this);
    this.onPhoneNumberChange = this.onPhoneNumberChange.bind(this);
    this.onPreferredContactChange = this.onPreferredContactChange.bind(this);
    this.onRequestedItemsChange = this.onRequestedItemsChange.bind(this);
    this.onNotesChange = this.onNotesChange.bind(this);
    this.onLanguageChange = this.onLanguageChange.bind(this);

    this.onAddressBlurFindAddress = this.onAddressBlurFindAddress.bind(this);
    this.chooseAddressFromCandidates = this.chooseAddressFromCandidates.bind(this);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
        received_timestamp: new Date(),
        contact_type: '',
        name: '',

        address: '',
        googleResp: {
            results: [
            ]
        },

        phone_number: '',
        preferred_contact: '',
        requested_items: '',
        notes: '',
        status: '',
        language:'',

        is_contact_type_valid: true,
        is_name_valid: true,
        
        is_address_valid: true,
        address_error_message: '',

        is_phone_number_valid: true,
        is_preferred_contact_valid: true,
        is_requested_items_valid: true,
        is_notes_valid: true,
        is_language_valid: true,
    };
}
    
getAddressCandidates() {
    if(this.state.googleResp.results.length > 1){
        return <div>
        <p>Did you mean?</p>
        {this.state.googleResp.results.map(result => {
            return <AddressCandidate result={result} chooseAddressFromCandidates={this.chooseAddressFromCandidates}/>;
        })}
        </div>
    }
    return null;
}

getAddressErrorMessage(){
    if(this.state.address_error_message.length > 0){
        return <div class="alert alert-danger" role="alert">
            {this.state.address_error_message}
        </div>
    }
    return null;
}

isDCPremiseAddress(result){
    if(!(result.types.includes('premise') || result.types.includes('subpremise') || result.types.includes('establishment'))){
        console.log('Not a residential address');
        return "Not a residential address or establishment";
    }
    let addressComponentsList = [];
    result.address_components.forEach(addressComponent => {
        addressComponentsList.push(addressComponent.long_name);
    })
    if(addressComponentsList.includes('District of Columbia')){
        return "";
    }else{
        console.log('Address not located in DC');
        return "Address not located in DC";
    }
}

onAddressBlurFindAddress(e){
    console.log('processlocation')
    geocode(e.target.value).then(
        resp =>{
            console.log(resp.data);
            resp.data.results.forEach(result =>{
                console.log(result.formatted_address);
            });
            if(resp.data.results.length === 1){
                let addressError = this.isDCPremiseAddress(resp.data.results[0]);
                this.setState({
                    is_address_valid: addressError.length === 0,
                    address_error_message: addressError,
                    address: resp.data.results[0].formatted_address,
                    googleResp: resp.data
                })
            }else{
                this.setState({
                    googleResp: resp.data
                })
            }
        }
    );
}

chooseAddressFromCandidates(address){
    geocode(address).then(
        resp =>{
            resp.data.results.forEach(result =>{
                console.log(result.formatted_address);
            });
            let addressError = this.isDCPremiseAddress(resp.data.results[0]);
            if(resp.data.results.length === 1){
                this.setState({
                    is_address_valid: addressError.length === 0,
                    address_error_message: addressError,
                    address: resp.data.results[0].formatted_address,
                    googleResp: resp.data
                })
            }else{
                this.setState({
                    googleResp: resp.data
                })
            }
        }
    );
}

getTodaysDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '-' + dd + '-' + yyyy;
    return today;
}

onContactTypeChange(e) {
    this.setState({
        contact_type: e.target.value,
        is_contact_type_valid: e.target.value.length > 0 ? true : false
    })
}

onNameChange(e) {
    this.setState({
        name: e.target.value,
        is_name_valid: e.target.value.length > 0 ? true : false
    })
}

onAddressChange(e) {
    this.setState({
        address_error_message: '',
        address: e.target.value,
        is_address_valid: e.target.value.length > 0 ? true : false
    })
}

onPhoneNumberChange(e) {
    this.setState({
        phone_number: e.target.value,
        is_phone_number_valid: e.target.value.length > 0 ? true : false
    })
}

onPreferredContactChange(e) {
    this.setState({
        preferred_contact: e.target.value,
        is_preferred_contact_valid: e.target.value.length > 0 ? true : false
    })
}

onRequestedItemsChange(e) {
    this.setState({
        requested_items: e.target.value,
        is_requested_items_valid: e.target.value.length > 0 ? true : false
    })
}

onNotesChange(e) {
    this.setState({
        notes: e.target.value,
        is_notes_valid: e.target.value.length > 0 ? true : false
    })
}

onLanguageChange(e) {
    this.setState({
        language: e.target.value,
        is_language_valid: e.target.value.length > 0 ? true : false
    })
}

onSubmit(e) {
    e.preventDefault();

    console.log(this.state.googleResp.results[0].geometry.location.lat.toString());
    console.log(this.state.googleResp.results[0].geometry.location.lng.toString());

    const createRequest = {
        records: [
            {
                fields:{
                    received_timestamp: this.getTodaysDate(),
                    contact_type: this.state.contact_type,
                    name: this.state.name,
                    address: this.state.address,
                    phone_number: this.state.phone_number,
                    preferred_contact: this.state.preferred_contact,
                    requested_items: this.state.requested_items,
                    notes: this.state.notes,
                    status: this.state.status,
                    language: this.state.language,
                    confirmation_number: uuidv4(),
                    lat: this.state.googleResp.results[0].geometry.location.lat.toString(),
                    lng: this.state.googleResp.results[0].geometry.location.lng.toString()
                }
            }
        ]
    }

    console.log(createRequest);

    this.setState({
        is_contact_type_valid: this.state.contact_type.length > 0,
        is_name_valid: this.state.name.length > 0,
        is_address_valid: this.state.googleResp.results.length === 1 && this.state.address_error_message.length === 0 ,
        is_phone_number_valid: this.state.phone_number.replace(/\D/g,'').length >= 10,
        is_requested_items_valid: this.state.requested_items.length > 0,
        is_language_valid: this.state.language.length > 0
    }, () => {
            let is_valid = this.state.is_address_valid && this.state.is_contact_type_valid && this.state.is_language_valid && this.state.is_name_valid && this.state.is_phone_number_valid && this.state.is_preferred_contact_valid && this.state.is_requested_items_valid;
            console.log(is_valid);
            if(is_valid){
                const config = {
                    headers: { Authorization: 'Bearer '+ this.airtable_api_key,
                                    'content-type': 'application/json' }
                };
                axios.post('https://api.airtable.com/v0/appa6sKWNwbFaCvRG/delivery_requests', createRequest, config)
                .then(res => {
                    console.log('air table response')
                    console.log(res.data)
                    history.push({
                        pathname: '/receipt',
                        state: {data: res.data}
                    })
                });
            }
        }
    )
}

render(){
return (
    <div class="row">
        <div class="col-1"></div>
        <div class="col-10">
        <h3>Submit Request</h3>
        <form onSubmit={this.onSubmit}>
            <div className="row">
                <div className="form-group col-6">
                    <label>Name: </label>
                    <input 
                        type="text" 
                        className={`form-control ${this.state.is_name_valid ? "" : "is-invalid"}`}
                        onChange={this.onNameChange}
                        />
                </div>
                <div className="form-group col-4">
                    <label>Phone Number: </label>
                    <input 
                        type="tel" 
                        className={`form-control ${this.state.is_phone_number_valid ? "" : "is-invalid"}`}
                        value={this.state.phone_number}
                        onChange={this.onPhoneNumberChange}
                        />
                </div>
                <div className="form-group col-2">
                    <label>Contact Type: </label>
                    <select 
                    type="text" 
                    className={`form-control ${this.state.is_contact_type_valid ? "" : "is-invalid"}`}
                    value={this.state.contact_type}
                    onChange={this.onContactTypeChange}>
                        <option></option>
                        <option>Call</option>
                        <option>Text</option>
                    </select>
                </div>
            </div>
            <div className="form-group">
                <label>Delivery Location: (Address, Shelter, Place of Worship, etc.)</label>
                <input 
                    type="text" 
                    className={`form-control ${this.state.is_address_valid ? "" : "is-invalid"}`}
                    value={this.state.address}
                    onChange={this.onAddressChange}
                    onBlur={this.onAddressBlurFindAddress}
                    />
            </div>

            {/* check if multiple addresses found */}
            { this.getAddressErrorMessage() }
            { this.getAddressCandidates() }

            <div className="row">
                <div className="form-group col-6">
                    <label>Preferred Contact: </label>
                    <input 
                        type="text" 
                        className={`form-control ${this.state.is_preferred_contact_valid ? "" : "is-invalid"}`}
                        value={this.state.preferred_contact}
                        onChange={this.onPreferredContactChange}
                        />
                </div>
                <div className="form-group col-6">
                    <label>Language: </label>
                    <input 
                        type="text" 
                        className={`form-control ${this.state.is_language_valid ? "" : "is-invalid"}`}
                        value={this.state.language}
                        onChange={this.onLanguageChange}
                        />
                </div>
            </div>
            <div className="form-group">
                <label>Requested Items: </label>
                <input 
                    type="text" 
                    className={`form-control ${this.state.is_requested_items_valid ? "" : "is-invalid"}`}
                    onChange={this.onRequestedItemsChange}
                    />
            </div>
            <div className="form-group">
                <label>Notes: </label>
                <textarea 
                    type="text" 
                    className="form-control"
                    value={this.state.notes}
                    onChange={this.onNotesChange}></textarea>
            </div>
            <div className="form-group">
                <input type="submit" value="Submit Request" className="btn btn-primary" />
            </div>
        </form>
        </div>
        <div class="col-1"></div>
    </div>
    );
  }
}
  
export default RequestEntry;

