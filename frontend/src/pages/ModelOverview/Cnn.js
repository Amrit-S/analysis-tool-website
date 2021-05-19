import React, { Component} from 'react';

class CNN extends Component {

    render (){

        async function download() {
            const res = {

                // dummy data 
                "data": 
                    {
                        "stats": {
                             "size": [1,2,3,4,5],
                            "shape": [10,20,30,40,50],
                            "pointiness":  [100,200,300,400,500]
                        },
                        "totalCells": 5
                    }
            };
              return await fetch('/segmentation/download', {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  responseType: 'text/csv',
                  body: JSON.stringify(res)
              }).then(async (res) => {
                  // successful response
                  if(res.status === 200){
                    
                    // get csv file, and make it browser readable 
                    var data = new Blob([await res.blob()], {type: 'text/csv'});
                    var csvURL = window.URL.createObjectURL(data);
                    // auto-download it on browser 
                    window.open(csvURL);
                  }
              })
          }

      return (

          <div>
              <div style={{marginTop: "30px"}}>
                  This is the CNN Page.
              </div>
              <button onClick={download}> Download </button>
          </div>

      )
    }
  }
  
  export default CNN;