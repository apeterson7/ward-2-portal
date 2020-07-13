
  import axios from 'axios';
  
  //   export const isWard2 = (formattedAddress) => {
//     // console.log('isWard2 was called');
//     // var apiUrl = new String('https://citizenatlas.dc.gov/newwebservices/locationverifier.asmx/findLocation2?str=');
//     // var addressTokens = formattedAddress.split(' ');
//     // addressTokens.forEach(token =>{
//     //     apiUrl = apiUrl+token+'%20';
//     // });
//     // apiUrl = apiUrl.substring(0,apiUrl.length-1);
//     // apiUrl = apiUrl.concat('&f=json');
//     // console.log(apiUrl);

//     // axios.get(apiUrl).then(res => {
//     //     res.data.returnDataset.Table1.forEach(table =>{
//     //         console.log(formattedAddress+' is in '+table.WARD);
//     //     })
//     // });

//     axios.get(`https://citizenatlas.dc.gov/newwebservices/locationverifier.asmx?op=getDCAddresses2`,
//     {
//         headers: {
//             'Access-Control-Allow-Origin': '*'
//         },
//         proxy: {
//             host: '104.236.174.88',
//             port: 3128
//           }
//     })
//     .then(resp =>{
//         console.log('hey');
//     }
//     );
//   }

  export const geocode = (address) => {
    let google_api_key = process.env.REACT_APP_GOOGLE_API_KEY
    console.log(google_api_key);
    let apiUrl = new String('https://maps.googleapis.com/maps/api/geocode/json?address=');
    let addressTokens = address.split(' ');
    addressTokens.forEach(token =>{
        apiUrl = apiUrl+token+'+';
    });
    apiUrl = apiUrl.substring(0,apiUrl.length-1);
    apiUrl = apiUrl.concat('&key='+google_api_key);
    console.log(apiUrl);

    return axios.post(apiUrl);
    
    // .then(res => {
    //     res.data.results.forEach(result =>{
    //         // this.state.candidate_addresses.push(result.formatted_address);
    //         console.log(result.formatted_address);
    //         console.log('here');
    //         // isWard2(result.formatted_address);
    //     })
        
    // });
  }