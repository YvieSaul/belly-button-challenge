// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

     // Get the metadata field
     const metadata = data.metadata;

     // Filter the metadata for the object with the desired sample number
     const result = metadata.filter(obj => obj.id === parseInt(sample))[0];
 
     // Use d3 to select the panel with id of `#sample-metadata`
     const panel = d3.select("#sample-metadata");
 
     // Clear any existing metadata
     panel.html("");
 
     // Append new tags for each key-value pair in the filtered metadata
     Object.entries(result).forEach(([key, value]) => {
       panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
     });
 
   }).catch(error => {
     console.error("Error fetching or processing data:", error);
   });
 }


// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const result = samples.filter(obj => obj.id === sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = result.otu_ids;
    const otu_labels = result.otu_labels;
    const sample_values = result.sample_values;

    // Build a Bubble Chart
    const bubbleData = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    };

    const bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: { title: 'OTU ID' },
      yaxis: { title: "Number of Bacteria Present" },
      hovermode: "closest"
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    // Build a Bar Chart
    const barData = {
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };

    const barLayout = {
      title: 'Top 10 OTUs Found',
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU ID' }
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', [barData], barLayout);

  }).catch(error => {
    console.error("Error fetching or processing data:", error);
  });
}


// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    sampleNames.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    const firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);
  }).catch(error => {
    console.error("Error initializing dashboard:", error);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();

