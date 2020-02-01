// Get a reference to the page tags
//##################################
// var get_set = d3.select("#selDataset");


const url = ("samples.json");

var listTestIds = [];
var listMetaData = [];
var listSamples = [];
var myMetaData = [];
var mySampleData = [];
var outputMetaData = [];

function buildLists() {
    d3.json(url).then(function(data) {
        
      // Grab values from the data json object to build the plots
      listTestIds = data.names;
      listMetaData = data.metadata;
      listSamples = data.samples;

      loadDropDown("#selDataset",listTestIds);    
    });
  }
  
  buildLists(); 

function getMetaData (selectId) {
    var returnMetaData = listMetaData.filter(listMetaData => {return listMetaData.id == selectId});
    // debugger;
    // console.log(returnMetaData[0].id);
    // console.log(returnMetaData[0].ethnicity);
    return returnMetaData[0];
    };

function getSampleData (selectId) {
    var returnSampleData = listSamples.filter(listSamples => {return listSamples.id == selectId});
    // debugger;
    // console.log(returnSampleData[0].id);
    // console.log(returnSampleData[0].otu_ids);
    // console.log(returnSampleData[0].otu_labels);

    return returnSampleData[0];
    };
 
function loadDropDown(myId, myList) {
        // var tbody = d3.select("tbody");
        var inputField = d3.select(myId) 
       
        inputField.html(" ");
      
        console.log(myList);
        
        myList.forEach((f) => {
          console.log(f);
          var cell = inputField.append("option")
          cell.text(f);
      
          });
        };

function optionChanged() {
    let choosenId = d3.select("#selDataset").property("value");
    console.log(choosenId);

    outputMetaData = getMetaData(choosenId);
    console.log("MetaData");
    console.log(outputMetaData);
    outputSampleData = getSampleData(choosenId);
    console.log("Sample Data");
    console.log(outputSampleData);

    loadSampleMetadata(outputMetaData);
    createBar(outputSampleData);
    }

function loadSampleMetadata(data) {

        var tbody = d3.select("#sample-metadata");

        tbody.html(" ");
          console.log(data);

          for (let [key, value] of Object.entries(data)) {
        //    console.log(key, value);
            var row = tbody.append("tr");         
            var cell1 = row.append("td");
            var cell2 = row.append("td");
                    
            cell1.text(key);
            cell2.text(value);
        }

};  

function createBar(data) {
    // Sort the data by sample_values results

    console.log("Data Used for Bar Chart");
    console.log(data);
    console.log(data.id);
    console.log(data.sample_values);
    console.log(data.otu_ids);
    console.log(data.otu_labels);

    var indices = [...data.sample_values.keys()];
   
    indices.sort((a, b) => data.sample_values[b] - data.sample_values[a]);
    indices = indices.slice(0,10).reverse();
    console.log(indices);


    data.otu_ids = indices.map(i => ("UFO " + data.otu_ids[i]));
    data.sample_values = indices.map(i => data.sample_values[i]);
    data.otu_labels = indices.map(i => data.otu_labels[i]);

    console.log(data.otu_ids);
    console.log(data.sample_values);
    console.log(data.otu_labels);
    
    // Trace1 for Sample Data
    var trace1 = {
    x: data.sample_values,
    y: data.otu_ids,
    text: data.otu_labels,
    name: "OTU",
    type: "bar",
    orientation: "h"
    };

    // data
    var bar_data = [trace1];

    // Apply the group bar mode to the layout
    var layout = {
    title: "OTU Results for selected ID",
    margin: {
        l: 150,
        r: 100,
        t: 100,
        b: 25
    }
    };

// Render the plot to the div tag with id "bar"
    Plotly.newPlot("bar", bar_data, layout);
}

// get_set.on("change", function() {optionChanged()});

