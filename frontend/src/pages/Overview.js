import React, { Component} from 'react';

import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const config = require('../config');

const BACKEND_URL = config.backend.uri;

class Overview extends Component {

    constructor(){
        super();
        this.state = {
            isFetching: true,
            response: ''
        }
        this.fetchUsersWithFetchAPI = this.fetchUsersWithFetchAPI.bind();
    }

    /***
     * Take a look at backend/app (route /) to see exactly how the response is being sent 
     */
    fetchUsersWithFetchAPI =  () => {
        this.setState({isFetching: true});
        fetch(BACKEND_URL)
            //Make sure to make the request asynchronous else you will get promises/errors
            .then(async result => {
                if (result.ok){
                    const json = await result.json();
                    this.setState({response: json.message, isFetching: false})
                } else{
                    this.setState({response: "Bad", isFetching: false})
                }
            })
            .catch(e => {
                console.log(e);
                this.setState({response: "Error", isFetching: false});
            });
    };

    componentDidMount(){
        this.fetchUsersWithFetchAPI();
    }


    render (){

      return (

          <div>
              <NavBar/>
              <div style={{marginTop: "30px"}}>
                  This is the Model Overview Page.
              </div> 
              <p>{this.state.isFetching ? 'Fetching message...' : this.state.response}</p>
              <Footer/>
          </div>

      )
    }
  }
  
  export default Overview;