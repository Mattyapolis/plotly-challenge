function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  
  d3.json(`/metadata/${sample}`).then(function(response) {
    console.log(response);

    var metaPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata

    metaPanel.html("");
    
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    Object.entries(response).forEach(([key,value]) => {
      metaPanel.append("p").text(`${key}: ${value}`);
      console.log(key, value);
    });
  });
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(response) {
    console.log(response)

    // @TODO: Build a Bubble Chart using the sample data
 
    var otu_ids = response.otu_ids;
    var sample_values = response.sample_values;
    var otu_labels = response.otu_labels;

    console.log(otu_ids);
    console.log(sample_values);
    console.log(otu_labels);

    var trace1 = [{
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      text: otu_labels,
      marker: {
        size:sample_values,

        color: otu_ids
      }
    }];

    var layout = {
      showlegend: false,
      autosize: false,
      height: 500,
      width: 1200,
    };

    Plotly.newPlot("bubble", trace1, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var trace2 = [{
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      hovertext: otu_labels.slice(0,10),
      type: 'pie'
    }];

    var layout = {
      autosize: false, 
      height: 600, 
      width: 600, 
      margin : {
        l: 50,
        r: 50,
        b: 0, 
        t: 100,
        pad: 0
      }
    };

    Plotly.newPlot("pie", trace2, layout);
  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
