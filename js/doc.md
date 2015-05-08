# The USV Namespace

## Overview
The USV (Usability and Security Visualizer)

##Properties
- this.currentEnvironment: Current environment variable (see USV.environment)
- this.showExample: Flag determining whether example data is shown

##USV.constants
Metric and visualization constants

###USV.constants.metric
Metric definitions.

- METRIC_TYPES: Define metric properties.
- CATEGORY_TYPES: Define properties for each metric category, if necessary.
- DOMAIN_TYPES: Shorthand for types of domains each metric can have.

###USV.constants.colors
Color constants.

- colorbrewer: Holds color values for different scales

## USV.environment
Controls the visualizations, datasets uploaded, and metric types.

####Classes: 

- __EnvironmentInstance.__ - Holds a dataset and associated visualizations for that dataset.
  - _Properties_:
	- __createData__ : Object representing the namespace "environment.dataset." Used to create new datasets.
	- __datasets__ : Array. Holds array of Dataset objects loaded using loadData().
	- __metricSet__ : MetricSet. Holds set of metric objects. This set represents metadata for all datatypes in datasets[]. New metrics are created when loadData succeeds in loading data to the class and a datatype is not already in the MetricSet. MetricSet starts with 0 metrics until the first dataset is loaded.  
	- __visualizations__ : Array. Holds array of visualization objects for that environment instance. 
	- __datasetCount__: Number of datasets in this.datasets (see above)

  - _Methods_:
	- __addVisualization( dataLocation: String )__: adds a visualization with the data location. 
	- __loadData( thisObj: EnvironmentInstance , dataLocation: String,  callback: Function ) _( asychronous )___: loads .csv file at the specified url location. The loaded data is used to create a Dataset object. If metrics in the dataset don't exist, new metrics are created in the _metricSet_ property. Global domains of each metric are reset and data-specific domains are set using the new data.
	- __alertMessage( msg: String )__: Updates GUI header with a bootstrap alert in Yellow.
	- __parseData( name: String, file: File , callback: Function ) _( asychronous )___: Parses a file into CSV format. Creates metric objects used in the visualization
	- __processData( thisObj: EnvironmentInstance , dataLocation: String , data: Data , callback: function )__: Processes a file into CSV format and loads as a visualization. Creates metric objects used in the visualization
	- __clear()__: Empty the environment

  - _On initialization_:

	  - gui.initialize ( asychronous ) called.


####Public Methods:

- __this.create( callback: function )__ - returns EnviromentInstance class. Exececutes callback function when asynchronous functions done.


## environment.dataset
Templates and associated operations for dataset objects.

####Classes:

- __DatasetInstance__ Holds a dataset and associated methods to perform on that dataset.
	- _Properties_:
		- __dataset__ : Array. Holds data.
		- __metrics__ : List of which metrics the data has.
		
	- _Methods_:
		- __hasMetric( metricName )__ : Returns whether the dataset has that type of data.
		- __sortData( byMetricType )__ : Sorts data by passed metric type.
		- __getData()__ : Returns stored dataset.

	- _On initialization_:
		- Adds represented data in metrics[] according to dataset[0].

####Returned Methods:

- __dataset.create( data: Array )__ - Returns new DatasetInstance using passed data to create the object. 


## environment.visualization
Templates for visualization. 

####Classes:

- __VisualizationInstance.__ Holds a dataset and associated visualizations for that dataset.
	- _Properties_:
		- __key__ : String. Key for specific heatmap.
		- __container__: String. Key for the html container
		- __dataKey__ : String. Key for data heatmap is representing.
		- __tiers__ : String. Holds tiers contained in this specific heatmap.
		- __metricSet__ : Array. Holds set of metric objects representing all datatypes in containing visualization.
		- __datasets__ : Array. Datasets this visualization is representing.
		- __colorscheme__ : Array. Array of colors to be used for visualization. 
			- Normal: default color scheme
			- Highlight: color scheme used for hovering and other similar functions.

	- _Methods_:
		- __init()__ : Create and initialize visualization tiers
		- __addData( dataLocation:String , visualizationKey: String , dataset: Array )__: Add new data and revisualize tiers if necessary
		- __setMetricColorScheme()__ : Set color scheme for metricSet using the heatmap key.
		- __createTiers( whichTiers: Array, dataset: Array , mode: String )__ : Create and add tiers to this object. Each index in whichTiers array represents a new tier to create. The value of each index represents the type of tier to create.
		- __createTier( whichTiers: Array, dataset: Array , mode: String )__ : Create and add single tier to this object. 
		- __connectTiers( whichTiers: Array )__ : Connect tiers to each other. Connected tiers will be able to trigger one another when interacted with. whichTiers is an array of the indexes of this.tiers[] to be connected. whichTiers[0] is the tier to be connected to whichTiers[i].
		-__initializeTiers( deferred: Deferred )__: Initialize tiers in the visualization object (create SVG and visualize)
		-__addHTML( tiers: Array[Tiers] )__: Append html from tiers to the browser.

	- _On initialization_:
		- setMetricColorScheme(): Sets the default color scheme for metrics. 
		- setDefaultVisibility( dataKey, key ): Sets the default visibility for metrics.
		- Create and initialize tiers associated with the configuration of the heatmap.
		- Load html to the browser. 


####Returned Methods:

- __visualization.create( dataKey: String , visualizationKey: String , dataset: dataset obj , config: String , metricSet: MetricSet )__ - Create and return HeatmapSet object with specified dataset key (dataLocation), visualization key (visualizationKey), dataset, configuration ( "default", etc. )

### (...).visualization.gui
GUI properties for the this (heatmap) visualization type. 

Accessible Constants:
	- EXTERNAL_HTML: String. Url to the heatmap html template file to be loaded.

### (...).visualization.tier
Templates for creation of tiers, or heatmap grids, which are modules of a HeatmapSet. 

####Classes:

- __TierInstance.__ Generic version of visualization tier
	
	- _Properties_:
		- __key__ : String. Key for specific tier within the heatmap it is contained in.
		- __parentKey__ : String. Key for specific visualization the tier is contained in.
		- __visualizationKey__: String. Key for specific visualization and tier. 
		- __dataKey__ : String. Key for data the tier is representing.
		- __dataset__ : String. Dataset object for the data the tier is representing.
		- __metricSet__ : String. Array. Holds MetricSet object representing all datatypes in containing visualization.
		-__svg__ : Object. Svg object for this tier. Holds dimensions of 
		-__html__ : Holds properties for the html container of this tier.
			-__parentContainer__ : String. id of container element.
			- __id__ : String. id where html of this tier is contained.
			- __url__ : String. url location of where the html of this tier is contained.
			- __markup__: String. Once loadHTML() is used, stores HTML markup of this tier.
		-__grid__ : Properties for the grid visual of this tier
			- __size__ : 
				- width : Integer. Width of grid block
				- height : Integer. Height of grid block
		-__margin__ : Global margin of this tier
			- top
		- __type__ : String. Type of tier.
		- __connectedTiers__ : Array. Connected tiers. Can be triggered via interactions with this tier. 
		- __hiddenRows__: Object. Lists rows that are hidden along with their d3 selections for editing. 
		- __totalGutterCount__ : Tracks the total count of gutters ( spaces between column categories ). Counted in this.countGutters();


	- _Methods_:
		- __loadHTML() _( asychronous )___ :  Loads html into this.html. Returns deferred promise object.
		- __countGutters()__ : Counts the total count of gutters ( spaces between column categories )
		- __visualize()__ : Establishes the visuals of the tier. Needs to be implemented by a subclass. 
		- __createsvg__ : Defines svg properties and creates svg objects for the tier. Needs to be implemented by a subclass. 
		- __initialize()__ : Starts up the visualization of the tier. Initializes all properties.
		- __getHTML()__ : Returns the HTML markup of this tier. 
		- __draw(drawFunction: Function, selector: String)__ : Loops through all non-string metrics and executes the passed draw function
		- __drawFunction( thisObj:TierInstance , gutterCount:Integer , metricIndex:Integer , metricName:String , currentMetricIndex:Integer , categoryIndex:Integer , nonPermutedMetricCount:Integer , selector:String , x:Float )__ : Template for what a draw function passed to draw() could look like.
		- __connect( tier:TierInstance )__: Connect tiers. Connected tiers will respond to events generated by other tiers.
		- __filterPasswords( metricName: String, values: Array )__ : Set filter min and max values for passed metric. Determines which metrics have been filtered. 
		- __hideRows()__: Hide rows of passwords indicated in this.hiddenRows

- __Svg__ Represents svg properties and functions
	
	- _Properties_:
		- __height__ : Float. Desired height of the svg. Usually set to the container height.
		- __width__ : Float. Desired width of the svg. Usually set to the container width.
		- __id__: String. HTML id of the resutling svg 
		- __parentContainer__ : String. Key (HTML id) for data the tier is representing.
		
	- _Methods_:
		- __init()___ :  Creates svg at specified width and height and attatches it to specified parent container id. 

- __Parcoords__ Parallel coordinates.

- __HeatmapTier1__ Heatmap small sidebar view.

- __HeatmapTier2__ Heatmap close up view.

- __Controls__ Visualization controls.


####Returned Methods:

- __tier.create()__ - create tier. 

## environment.metric

####Classes:

- __MetricSet__ - Set of metrics and associated specifications for all metrics.
- __MetricInstance__ - A metric and associated specifications for that metric.
- __Category__ - Categories of metric types.

## environment.gui
GUI operations for the environment

####Properties:
- __EXTERNAL_HTML__ - HTML to be loaded
- __activeType__ - Current viz type selected on the visualization navbar
- __activeData__ - Current dataset being displayed

####Methods:

- __gui.initialize( callback: function )__ - set up initial screen properties for the tool. Execute callback when done
- __gui.addVisualization( visualizationKey: String )__ - Add another visualization item to the navbar.
- __gui.showVisualization( visualizationKey: String )__ - Hide all visualizations except for the passed visualizationKey
- __gui.showAllOverviewVisualizations( callback: Function )__ - Show all visualizations

