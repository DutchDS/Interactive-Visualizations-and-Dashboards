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
    createBubble(outputSampleData);
    createGauge(outputMetaData)
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

    data.otu_ids = indices.map(i => ("UFO " + data.otu_ids[i] + " "));
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
    orientation: "h",
    marker: {color: "#023b55"} 
   };

    // data
    var bar_data = [trace1];

    // Apply the group bar mode to the layout
    var layout = {
    title: "Test Subject ID: " + data.id,
    xaxis: {title:"Sample Value"},
    // paper_bgcolor: "rgb(208, 244, 253)",
    // yaxis: {title:"UTO label"},
    height: 0.6,
    margin: {
        l: 100
    },
    font: {family: "Lucida Handwriting"}
    };

// Render the plot to the div tag with id "bar"
    Plotly.newPlot("bar", bar_data, layout);

    
};

function createBubble(data) {

    console.log("Data Used for Bubble Chart");
    console.log(data);
    console.log(data.id);
    var myId = data.id;
    console.log(data.sample_values);
    console.log(data.otu_ids);
    console.log(data.otu_labels);

    var trace1 = {
        x: data.otu_ids,
        y: data.sample_values,
        text: data.otu_labels,
        paper_bgcolor: "rgb(208, 244, 253)",
        mode: 'markers',
        marker: {
          size: data.sample_values,
          color: data.otu_ids
        }
      };
      
      var data = [trace1];

      myHeight = Math.max(data.otu_ids)*1.2;
      console.log(myHeight);

      var layout = {
        title: ("Test Subject ID: " + myId),
        xaxis: {title:"Sample Value"},
        showlegend: false,
        height: myHeight,
        width: 1140,
        font: {family: "Lucida Handwriting"}    
      };
      
      Plotly.newPlot("bubble", data, layout);
};

function createGauge(data) {
    
    var myFreq = data.wfreq;
    console.log(myFreq);

    var data = [
        {
            type: "indicator",
            mode: "gauge+number",
            value: myFreq,
            title: { text: "Washing Frequency"},
            // delta: { reference: 400, increasing: { color: "RebeccaPurple" } },
            gauge: {
              axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
              bar: { color: "#023b55" },
            //   bgcolor: "rgb(208, 244, 253)",
              borderwidth: 2,
              bordercolor: "gray",
              steps: [
                // color: rgb(67, 94, 73);
                { range: [0,1], color: "rgb(0, 100, 0)"},
                { range: [1,2], color: "rgb(20, 125, 16)" },
                { range: [2,3], color: "rgb(40, 150, 32)" },
                { range: [3,4], color: "rgb(60, 175, 48)" },
                { range: [4,5], color: "rgb(80, 190, 64)" },
                { range: [5,6], color: "rgb(100, 200, 90)" },
                { range: [6,7], color: "rgb(125, 210, 120)" },
                { range: [7,8], color: "rgb(150, 220, 150)" },
                { range: [8,9], color: "rgb(175, 230, 175)" },
                { range: [9,10], color: "rgb(208, 238, 207)" }
              ],
            //   threshold: {
            //     line: { color: "green", width: 4 },
            //     thickness: 0.75,
            //     value: 10
            //   }
            }
          }
 
        // {   
        //     values: [1,2,3,4,5,6,7,8,9,10],
        //     domain: { x: [0, 1], y: [0, 10] },
        //     value: myFreq,
        //     steps: [
        //         { range: [0, 250], color: "cyan" },
        //         { range: [250, 400], color: "royalblue" }
        //       ],
        //     title: { text: "Washing Frequency" },
        //     type: "indicator",
        //     mode: "gauge+number"
        // }
    ];
    
    var layout = { 
            width: 455, 
            height: 300, 
            margin: { t: 0, b: 0 } ,
            font: {family: "Lucida Handwriting"}
        };

    Plotly.newPlot('gauge', data, layout);
};

// get_set.on("change", function() {optionChanged()});

