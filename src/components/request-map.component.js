import React, { Component, Fragment, createRef } from 'react';
import { setUp } from '../services/kmeans.service.js';

class RequestMap extends Component { 
    googleMapRef = createRef()

    constructor(props) {
        super(props);
        this.state = {
            requests: [],
            partitionedRequests: []
        };
        this.airtable_api_key=process.env.REACT_APP_AIRTABLE_API_KEY;
        this.google_api_key=process.env.REACT_APP_GOOGLE_API_KEY;
        this.markerColors = [
            ['http://maps.google.com/mapfiles/ms/icons/blue-dot.png','CornflowerBlue'],
            ['http://maps.google.com/mapfiles/ms/icons/red-dot.png', 'IndianRed'],
            ['http://maps.google.com/mapfiles/ms/micons/green-dot.png','GreenYellow'],
            ['http://maps.google.com/mapfiles/ms/micons/yellow-dot.png', 'yellow'],
            ['http://maps.google.com/mapfiles/ms/micons/purple-dot.png', 'purple'],
            ['http://maps.google.com/mapfiles/ms/micons/orange-dot.png', 'orange']
        ]
    }

 

    componentDidMount() {
        //Fetch Requests
        fetch('https://api.airtable.com/v0/appa6sKWNwbFaCvRG/delivery_requests?api_key='+this.airtable_api_key+'&view=Grid%20view')
            .then((resp) => resp.json())
            .then(data => {
                // console.log(data)
                this.setState({ requests: setUp(data.records, 4) }, () => {
                    //Load Google Map
                    const googleMapScript = document.createElement('script')
                    googleMapScript.src = 'https://maps.googleapis.com/maps/api/js?key='+this.google_api_key+'&libraries=places'
                    window.document.body.appendChild(googleMapScript)
                    googleMapScript.addEventListener('load', () => {
                        this.googleMap = this.createGoogleMap();
                        
                        //Add Delivery Requests
                        this.state.requests.forEach(request => {
                            console.log(request.fields.lat+' '+request.fields.lng);
                            this.createMarker(parseFloat(request.fields.lat), parseFloat(request.fields.lng), request.fields.name, request.assignment);
                        })
                    })

                    //Partition Requests into 2 groups
                    this.partitionDeliveryLocations(4);
                });
            }).catch(err => {
                console.log(err);
                console.log("error")
            });
    }

    partitionDeliveryLocations(k){
        let partitions = [];
        //Initialize array of arrays
        var i
        for(i = 0; i < k; i++){
            partitions.push([]);
        }
        //populate based on assignments
        this.state.requests.forEach(request => {
            partitions[request.assignment].push(request);
        })
        
        //setState;
        this.setState({partitionedRequests: partitions})
    }

    createGoogleMap = () =>
        new window.google.maps.Map(this.googleMapRef.current, {
        zoom: 13,
        center: {
            lat: 38.9072,
            lng: -77.0369,
        },
        disableDefaultUI: true,
    })

    createMarker = (latitude, longitude, name, assignment) =>
        new window.google.maps.Marker({
            position: { lat: latitude, lng: longitude},
            map: this.googleMap,
            title: name,
            icon: this.markerColors[assignment][0]
    })

    render() {
        const { places } = this.state;
        return (
            <div>
                <div class="row">
                    <div class="col-1"></div>
                    <div class="col-6">
                        <div 
                            id='google-map'
                            ref={this.googleMapRef}
                            style={{ width: '100%', height: '500px'}}
                        />
                    </div>
                    <div class="col-4">
                        { this.state.partitionedRequests.map((partition, index) => 
                            <div>
                                <div class="card">
                                        <h5 class="card-header" style={{backgroundColor: this.markerColors[index][1]}}> Partion {index} </h5>
                                        <ul class="list-group list-group-flush">{ 
                                            partition.map(request => <li class="list-group-item">{request.fields.address}</li>) 
                                        } </ul>
                                </div>
                                <br></br>
                            </div>
                        )}
                    </div>
                    <div class="col-1"></div>
                </div>
            </div>
                
        );
    }
}
  
export default RequestMap;


