import React, { Component, Fragment, createRef } from 'react';
  
class RequestMap extends Component { 
    googleMapRef = createRef()

    constructor(props) {
        super(props);
        this.state = {
            requests: [],
        };
        this.airtable_api_key=process.env.REACT_APP_AIRTABLE_API_KEY;
        this.google_api_key=process.env.REACT_APP_GOOGLE_API_KEY;
    }

    componentDidMount() {
        //Fetch Requests
        fetch('https://api.airtable.com/v0/appa6sKWNwbFaCvRG/delivery_requests?api_key='+this.airtable_api_key+'&view=Grid%20view')
            .then((resp) => resp.json())
            .then(data => {
                console.log(data)
                this.setState({ requests: data.records }, () => {
                    //Load Google Map
                    const googleMapScript = document.createElement('script')
                    googleMapScript.src = 'https://maps.googleapis.com/maps/api/js?key='+this.google_api_key+'&libraries=places'
                    window.document.body.appendChild(googleMapScript)

                    googleMapScript.addEventListener('load', () => {
                        this.googleMap = this.createGoogleMap();
                        
                        this.state.requests.forEach(request => {
                            console.log(request.fields.lat+' '+request.fields.lng);
                            this.createMarker(parseFloat(request.fields.lat), parseFloat(request.fields.lng), request.fields.name);
                        })
                    })
                });
            }).catch(err => {
                console.log("error")
            });
    }

    createGoogleMap = () =>
        new window.google.maps.Map(this.googleMapRef.current, {
        zoom: 12,
        center: {
            lat: 38.9072,
            lng: -77.0369,
        },
        disableDefaultUI: true,
    })

    createMarker = (latitude, longitude, name) =>
        new window.google.maps.Marker({
            position: { lat: latitude, lng: longitude},
            map: this.googleMap,
            title: name
    })

    render() {
        const { places } = this.state;
        return (
            <div class="row">
                <div class="col-8">
                    <div 
                        id='google-map'
                        ref={this.googleMapRef}
                        style={{ width: '100%', height: '500px'}}
                    />
                </div>
                <div class="col-4">
                    <ul>
                        {this.state.requests.map(request => <li> {request.fields.name }, {request.fields.address }</li>  )}
                    </ul>
                </div>
            </div>

                
        );
    }
}
  
export default RequestMap;


