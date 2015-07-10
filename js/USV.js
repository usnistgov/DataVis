/*

*/
// Declare the USV namespace
var USV = USV || {};
/**
 * The USV namespace.
 */ 
(function(){
	/** Metric and visualization constants */
	var constants = (function(){
			/** Metric definitions */
			var metric = (function() {
				/** Shorthand for types of domains each metric can have. */
				var DOMAIN_TYPES = {
							ZERO_MAX: {
								min: 0,
								max: "max"
							},
							ZERO_ONE: {
								min: 0,
								max: 1
							},
							MIN_MAX: {
								min: "min",
								max: "max"
							}
				}
				/** Define properties for each metric category, if necessary. */
				var CATEGORY_TYPES = {
					"password": {
						allString: true
					}
				}
				/**  Define metric properties. */
				var METRIC_TYPES = {
					"datasetIndex" : {
						label: "Dataset",
						dataType:  "int",
						domainType : DOMAIN_TYPES.MIN_MAX,
						category: {name:"Dataset"},
						permuted: false
					},
					"originalPassword" : {
						label: "Original Password",
						dataType: "String",
						domainType: null,
						category: {name:"password"},
						permuted: false
					},
					"permutedPassword" : {
						label: "Permuted Password",
						dataType: "String",
						domainType : null,
						category: {name:"password"},
						permuted: false
					},
					"symbolStart" : {
						label: "Starts w/ Symbol",
						dataType:  "int",
						domainType : DOMAIN_TYPES.ZERO_ONE,
						category: {
							name: "lpd",
							index: 0
						},
						permuted: true
					},
					"chunks" : {
						label: "Number of Chunks",
						dataType:  "int",
						domainType : DOMAIN_TYPES.ZERO_MAX,
						category: {
							name: "lpd",
							index: 1
						},
						permuted: true
					},
					"characters" : {
						label: "Size of Chunks",
						dataType:  "int",
						domainType :{
								min: 0,
								max: 5
							},
						category: {
							name: "lpd",
							index: 2
						},
						permuted: true
					},
					"unsentenceLikeCaps" : {
						label: "Unsent.-like Capitlztn",
						dataType:  "int",
						domainType : DOMAIN_TYPES.ZERO_MAX,
						category: {
							name: "lpd",
							index: 3
						},
						permuted: true
					},
					"mixedCharacterString" : {
						label: "Mixed Character String",
						dataType:  "int",
						domainType : DOMAIN_TYPES.ZERO_ONE,
						category: {
							name: "lpd",
							index: 4
						},
						permuted: true
					},
					"pronounceable" : {
						label: "Pronounceable",
						dataType:  "int",
						domainType : {
							min: "min",
							max: 0
						},
						category: {
							name: "lpd",
							index: 5
						},
						permuted: true
					},
					"lpd" : {
						label: "Total LPD Score",
						dataType:  "int",
						domainType : DOMAIN_TYPES.MIN_MAX,
						category: {
							name: "lpd",
							index: 6
						},
						permuted: true
					},
					"desktopkeystrokes" : {
						label: "Desktop Keystrokes",
						dataType:  "int",
						domainType : DOMAIN_TYPES.MIN_MAX,
						category: {
							name: "keystrokes",
							index: 0
						},
						permuted: true
					},
					"androidkeystrokes" : {
						label: "Android Keystrokes",
						dataType:  "int",
						domainType : DOMAIN_TYPES.MIN_MAX,
						category: {
							name: "keystrokes",
							index: 1
						},
						permuted: true
					},
					"ipadkeystrokes" : {
						label: "iPad Keystrokes",
						dataType:  "int",
						domainType : DOMAIN_TYPES.MIN_MAX,
						category: {
							name: "keystrokes",
							index: 2
						},
						permuted: true
					},
					"entropy" : {
						label: "Entropy",
						dataType:  "int",
						domainType : DOMAIN_TYPES.MIN_MAX,
						category: {
							name: "entropy",
							index: 0
						},
						permuted: true
					},
					"lostEntropy" : {
						label: "Entropy Lost",
						dataType:  "int",
						domainType : DOMAIN_TYPES.MIN_MAX,
						visualizationType : {
							grid: false
						},
						category: {
							name: "entropySummary",
							index: 1
						},
						permuted: false
					},
					"percentEntropyLoss" : {
						label: "Percent Entropy Lost",
						dataType:  "int",
						domainType : DOMAIN_TYPES.MIN_MAX,
						category: {
							name: "entropySummary",
							index: 2
						},
						permuted: false
					},
					"passwordlength" : {
						label: "Password Length",
						dataType:  "int",
						domainType : DOMAIN_TYPES.MIN_MAX,
						category: {
							name: "passwordStructure"
						},
						permuted: false
					},
					"numLetters" : {
						label: "Number of Letters",
						dataType:  "int",
						domainType : DOMAIN_TYPES.MIN_MAX,
						category: {
							name: "passwordStructure"
						},
						permuted: false
					},
					"numNumbers" : {
						label: "Number of Digits",
						dataType:  "int",
						domainType : DOMAIN_TYPES.MIN_MAX,
						category: {
							name: "passwordStructure"
						},
						permuted: false
					},
					"numSymbols" : {
						label: "Number of Symbols",
						dataType:  "int",
						domainType : DOMAIN_TYPES.MIN_MAX,
						category: {
							name: "passwordStructure"
						},
						permuted: false
					},
				};
				return {
					METRIC_TYPES: METRIC_TYPES, 
					DOMAIN_TYPES: DOMAIN_TYPES,
					CATEGORY_TYPES: CATEGORY_TYPES
				}
			})();
			/** Color constants */
			var colors = (function() {
						
				/** Holds color values for different scales */
				var colorbrewer = {
				    Greys: {
				    	2: ["#ffffff","#AA00FF"],
				        9: ["#ffffff","#f0f0f0","#d9d9d9","#bdbdbd","#969696","#737373","#525252","#252525","#000000"]},
				    GnYlRd: {
				        9: ["#081d58","#225ea8", "#41b6c4", "#c7e9b4","#ffffd9", "#ffeda0","#feb24c","#fc4e2a","#bd0026"],
				        18: ["#081d58", "#253494","#225ea8", "#1d91c0", "#41b6c4", "#7fcdbb", "#c7e9b4","#edf8b1","#ffffd9", "#ffffcc","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"]},
				    YlGnBu: {
				        3: ["#edf8b1","#7fcdbb","#2c7fb8"],
				        9: ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]}, 
				    PuRd: {
				    	2: ["#f7f4f9","#67001f"],
				        9: ["#f7f4f9","#e7e1ef","#d4b9da","#c994c7","#df65b0","#e7298a","#ce1256","#980043","#67001f"]}, 
				    BlWt: {
				        9: ["#08306b","#08519c","#2171b5","#4292c6","#6baed6","#9ecae1","#c6dbef","#deebf7","#f7fbff"]},
				    WtRd: {
				    	2: ["#ffffff", "#ff0000"],
				        9: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"]},
				    WtBl: {
				        9: ["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"]}
				    };
				
				return {
					colorbrewer: colorbrewer
					
				}
			})();
			return {
				colors: colors,
				metric: metric
			}
	})( );
	
	/** Current environment variable */
	var currentEnvironment; 
	/** Flag determining whether example data is shown */
	var showExample = false;
	/** Controls the visualizations, datasets uploaded, and metric types. */
	var environment = ( function(){
		/* Private Methods */
		
		/** Holds datasets and associated visualizations for that dataset. */
		var EnvironmentInstance = function( ){
			var thisObj = this;
			this.createData = dataset;
			this.datasets = []; // Array of dataset objects stored here ( loadData(); )
			this.datasetCount = 0;
			this.metricSet = metric.createSet( ); // Set of all metrics used in this environment 
			this.visualizations = []; // Array of visualization objects for this environment ( heatmap, etc. )
			gui.initialize( thisObj.loadData , this , "example.csv" ); // Set up gui (Asychronous) then execute callback
		};
		EnvironmentInstance.prototype = {
			alertMessage: function ( msg ) {
				$("#USV-information").prepend('<div class="USV-alert alert alert-warning" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> ' + msg + '</div>');
			},
			/** 
			* Adds a visualization to the environment
			* @param {string} dataLocation - Key representing where the dataFile is located ( no .csv ) */
			addVisualization: function ( dataLocation ){
				var thisObj = this;
				var visualize = function(){
					// If the dataset exists, visualize
					if( thisObj.datasets[ dataLocation ] ){
						var updateOverview = function () {
							visualizationKey = "heatmap-overview";
							// Add data to the heatmap overview
							if( !thisObj.visualizations[ "heatmap-overview" ] && !thisObj.visualizations[ "parcoords-overview" ] ){
								
								thisObj.visualizations[ "heatmap-overview" ] = visualization.create( dataLocation , visualizationKey , [thisObj.datasets[ dataLocation ]] , "heatmap-overview" , thisObj.metricSet );
								gui.addVisualization( "heatmap-overview" );
								
								visualizationKey = "parcoords-overview";
								thisObj.visualizations[ "parcoords-overview" ] = visualization.create( dataLocation , visualizationKey , [thisObj.datasets[ dataLocation ]] , "parcoords-overview" , thisObj.metricSet );
								gui.addVisualization( "parcoords-overview" );
								$.when( thisObj.visualizations[ "parcoords-overview" ].init() , thisObj.visualizations[ "heatmap-overview" ].init() ).done(function () {
									gui.showVisualization( dataLocation );
								});
							} else {
								$.when( thisObj.visualizations[ "heatmap-overview" ].addData( dataLocation , "heatmap-overview" , thisObj.datasets[ dataLocation ] ), thisObj.visualizations[ "parcoords-overview" ].addData( dataLocation , "parcoords-overview" , thisObj.datasets[ dataLocation ] ) ).done(function () {
									gui.showVisualization( dataLocation );
								});
							}
						};
						
						/** 
						* Create heatmap in visualizations[] with "heatmap-[dataLocation] as a key"
						* @param {string} dataLocation - where data is located
						* @param {string} visualizationKey - unique identifier for thisObj visualization 
						* @param {Dataset} dataset - dataset object corresponding with the dataLocation identifier
						* @param {string} config - type of configuration the heatmap is using
						* @param {MetricSet} metricSet - metricSet object
						 */
						var visualizationKey = "heatmap-" + dataLocation;
						thisObj.visualizations[visualizationKey] = visualization.create( dataLocation , visualizationKey , [thisObj.datasets[ dataLocation ]] , "heatmap" , thisObj.metricSet );
						gui.addVisualization( dataLocation );
						visualizationKey = "parcoords-" + dataLocation;
						thisObj.visualizations[visualizationKey] = visualization.create( dataLocation , visualizationKey , [thisObj.datasets[ dataLocation ]] , "parcoords" , thisObj.metricSet );
						// gui.addVisualization( visualizationKey );
						$.when( thisObj.visualizations[ "parcoords-" + dataLocation ].init() , thisObj.visualizations[ "heatmap-" + dataLocation ].init() ).done(function () {
							console.log("Create visualization")
							updateOverview();
							
						});				
					} else {
						console.log("No data found. Try loading " + dataLocation + " using environment.loadData( \"fileLocation\" )")
					}
				};
				gui.showAllOverviewVisualizations( visualize );
			},
			/** 
			* Loads specified .csv file. Creates metric objects used in the visualization
			* @param {string} dataLocation - Url of releative location of csv file
			* @param {function} callback - Optional. 
			*/
			loadData: function( thisObj , dataLocation,  callback ){
				
				var thisObj = thisObj,
					url = "./data/" + dataLocation,
					index = thisObj.datasetCount;
				// Load data using d3.js
				d3.csv( url , function parseRows ( d ) {
		        	for ( var prop in d ) { // For each property in a data row ( d )
	            		thisObj.metricSet.addMetric( prop ); // Add metric to the metric set
	            		if( !thisObj.metricSet.isString( prop ) ) { // if datatype is not a string
	            			d[prop] = +d[ prop ]; // All unidentified metrics will be assumed to be Strings
	            		}
		            }
		            d.datasetIndex = index;
		            thisObj.metricSet.addMetric( "datasetIndex" );
		            return d;
		        }, function done ( error, data ) {
					
		        	var rReplace = /\.csv/g;
					dataLocation = dataLocation.replace(rReplace, "");
					if ( error ){
						console.log( error.stack );
						thisObj.alertMessage( "Error loading data." );
					}
					thisObj.processData( thisObj , dataLocation , data , callback );
				});
			}, 
			/** 
			* Parses a file into CSV format. Creates metric objects used in the visualization
			* @param {string} name - name of csv file
			* @param {File} file - File to be parsed into CSV
			* @param {function} callback - Optional. 
			*/
			parseData: function( name, file , callback ){
				
				var thisObj = this,
					index = thisObj.datasetCount;
				if(!thisObj.datasets[ name ]){
					
					data = d3.csv.parse( file ); // Parse data using d3.js
		        	for( var i = 0; i < data.length ; i++ ){ // For each property in a data row ( data ) 
			        	for ( var prop in data[i] ) {
		        			// Add metric to the metric set
		            		thisObj.metricSet.addMetric( prop );
		            		// if datatype is not a string
		            		// All unidentified metrics will be assumed to be Strings
		            		if( !thisObj.metricSet.isString( prop ) ) {
		            			data[i][prop] = +(data[i][ prop ]);
		            		}
			            }
			            data[i].datasetIndex = index;
		            	thisObj.metricSet.addMetric( "datasetIndex" );
		        	}
		        	
		        	thisObj.processData( thisObj , name , data , callback );
				} else {
					console.log("Dataset by that name already exists");
					this.alertMessage( "Dataset by that name already exists" );
				}	
			},
			/** 
			* Processes a file into CSV format and loads as a visualization. Creates metric objects used in the visualization
			* @param {thisObj} name - name of csv file
			* @param {dataLocation} File - File to be parsed into CSV
			* @param {Data} Data - Data to be parsed.
			* @param {function} callback - Optional. 
			*/
			processData: function ( thisObj , dataLocation , data , callback ) {
				thisObj.datasetCount++;
				// console.log( "Metrics created:");
				// console.log( thisObj.metricSet );
				// console.log( "Data Loaded:");
				// console.log( data );
				// Add dataset
				thisObj.datasets[ dataLocation ] = thisObj.createData.create( data , dataLocation );
				// Initialize metric domains
				thisObj.metricSet.setDomains( thisObj.datasets[ dataLocation ], dataLocation );
				if( !callback ) {
						thisObj.addVisualization( dataLocation );
					} else {
						callback( dataLocation );
						
				}
			},
			/**  Empty the environment */
			clear: function ( ) {
				$("#vizualizations-holder").html(''); 
				$("#navbar-displayed-visualization").html('');
				this.metricSet = metric.createSet( );
				this.visualizations[ "heatmap-overview" ] = null;
				this.visualizations[ "parcoords-overview" ] = null;
				this.datasetCount = 0;
			}
		};
		/* Public Methods */
		/** Create and return environmentInstance */
		var create = function( callback ){
			return new EnvironmentInstance( callback );
		};
		/** Templates and associated operations for dataset objects. */
		var dataset = ( function(){
			
			var DatasetInstance = function ( data , name ) {
				this.dataset = data; // Holds data 
				this.metrics = []; // List of which metrics the data has
				this.dataName = name;
				for( prop in this.dataset[0]){
					this.metrics[prop] =  true;
				}
			};
			DatasetInstance.prototype = {
				hasMetric: function ( metricName ) {
					
					if(this.metrics[metricName]){
						return true;
					
					} 
					return false;
				},
				sortData: function ( byMetricType ){
					var metricName = byMetricType;
					var sortDataset = function ( a , b ) {
						if (a[ metricName ] < b[ metricName ])
						   return -1;
						if (a[ metricName ] > b[ metricName ])
						   return 1;
						// a must be equal to b
						return 0;
					};
					this.dataset.sort( sortDataset );
				},
				getData: function () {
					return this.dataset;
				},
				getName: function ( ) {
					return this.dataName;
				}
			};
			var create = function( data , name ){
				if( data ){
					return new DatasetInstance( data , name );
				
				} else {
				
					console.log("No data found. Cannot create Dataset");
				
				}
				
			};
			return {
				create: create
			};
		})();
		/** Templates for visualization. */
		var visualization = ( function(){
			var thisObj = this;

			/** Holds a dataset and associated visualizations for that dataset */
			var VisualizationInstance = function ( dataKey , visualizationKey , datasets , config , metricSet ){
				
				this.key = visualizationKey; 
				this.visualizationKey = visualizationKey; // Key for specific heatmap
				this.mode = config;
				this.container = this.key + "-container";
				this.dataKey = dataKey; // Key for data heatmap is representing
				this.tiers = [];
				this.metricSet = metricSet;
				this.datasets = datasets;
				this.colorscheme = {
					normal: constants.colors.colorbrewer.Greys[2],
					highlight: constants.colors.colorbrewer.WtRd[2]
				}
				
			};
			VisualizationInstance.prototype = {
				/** Create and initialize visualization tiers */
				init: function ( ) {	
					var thisObj = this;	
					var deferred = $.Deferred();			
					thisObj.setMetricColorScheme();
					
					thisObj.metricSet.setDefaultVisibility( thisObj.dataKey , thisObj.visualizationKey );
					// default config	
					if( thisObj.mode == "heatmap" ){
						console.log("Create heatmap with default config");
						// Create new tier1, tier2, tier3
						var defTiersCreated = $.Deferred();
						thisObj.createTiers(["HeatmapTier2" , "HeatmapTier1" , "Controls"] , thisObj.datasets[0], thisObj.mode);
						thisObj.connectTiers([0,1,2]);
						thisObj.connectTiers([1,0,2]);
						thisObj.connectTiers([2,0,1]);
						defTiersCreated.resolve(thisObj.tiers);
						// Load html for tiers
						defTiersCreated.done(function(tiers){
							$.when( tiers[0].loadHTML() , tiers[1].loadHTML() , tiers[2].loadHTML() ).done(function () {
								thisObj.addTierHTML( tiers );
								thisObj.initializeTiers( deferred);
							}); 
						});
						
					} else if ( thisObj.mode == "heatmap-overview" ) {
						console.log("Create heatmap with global config");
						thisObj.key = "heatmap-overview";
						thisObj.container = "heatmap-overview-container";
						thisObj.setMetricColorScheme( thisObj.mode );
						thisObj.metricSet.setDefaultVisibility( thisObj.dataKey , "global" );
						// Create new tier1, tier3
						var defTiersCreated = $.Deferred();
						thisObj.createTier("Controls" , thisObj.datasets , thisObj.mode);
						thisObj.createTier("HeatmapTier1" , thisObj.datasets[0] , thisObj.mode);
						thisObj.connectTiers([0,1]);
						thisObj.connectTiers([1,0]);
						defTiersCreated.resolve(thisObj.tiers);
						// Load html for tiers
						defTiersCreated.done(function(tiers){
							$.when( tiers[0].loadHTML() , tiers[1].loadHTML() ).done(function () {
								thisObj.addTierHTML( tiers );								
								thisObj.initializeTiers( deferred );
							}); 
						});
					} else if( thisObj.mode == "parcoords" ){
						console.log("Create parallel coordinates with default config");
						thisObj.setMetricColorScheme( "parcoords" );
						thisObj.metricSet.setDefaultVisibility( thisObj.dataKey , thisObj.visualizationKey , "parcoords");
						// Create new tier1, tier2, tier3
						var defTiersCreated = $.Deferred();
						thisObj.createTier("Parcoords" , thisObj.datasets);
						thisObj.createTier("Controls" , thisObj.datasets , "parcoords");
						thisObj.connectTiers([1,0]);
						defTiersCreated.resolve(thisObj.tiers);
						// Load html for tiers
						defTiersCreated.done(function(tiers){
							$.when( tiers[0].loadHTML(), tiers[1].loadHTML() ).done(function () {
								thisObj.addTierHTML( tiers );
								thisObj.initializeTiers( deferred);
							}); 
						});	
					} else if ( thisObj.mode == "parcoords-overview" ){
						console.log("Create parallel coordinates with overview config");
						thisObj.setMetricColorScheme( );
						thisObj.metricSet.setDefaultVisibility( thisObj.dataKey , "parcoords-overview" );
						// Create new tier1, tier2, tier3
						var defTiersCreated = $.Deferred();
						thisObj.createTier("Parcoords" , thisObj.datasets , thisObj.mode);
						thisObj.createTier("Controls" , thisObj.datasets , "parcoords-overview");
						thisObj.connectTiers([1,0]);
						defTiersCreated.resolve(thisObj.tiers);
						// Load html for tiers
						defTiersCreated.done(function(tiers){
							$.when( tiers[0].loadHTML(), tiers[1].loadHTML() ).done(function () {
								thisObj.addTierHTML( tiers );
								thisObj.initializeTiers( deferred );
							}); 
						});
					}
					return deferred.promise(); 
				},
				/** Add new data and revisualize tiers if necessary  */
				addData: function ( dataLocation , visualizationKey , dataset ) {
					var thisObj = this,
						deferred = $.Deferred();
					thisObj.setMetricColorScheme( thisObj.mode );
					
					thisObj.datasets.push( dataset );
					var index = thisObj.datasets.length;
					
					if( thisObj.mode == "heatmap-overview" ){
						var defTiersCreated = $.Deferred();
						thisObj.createTier("HeatmapTier1" , dataset , thisObj.mode);
						thisObj.connectTiers([0,index]);
						thisObj.connectTiers([index,0]);
						defTiersCreated.resolve(thisObj.tiers);
						// Load html for tiers
						defTiersCreated.done(function(tiers){
							$.when( tiers[index].loadHTML() ).done(function () {
								thisObj.appendTierHTML( tiers[index] );
								tiers[index].initialize();
								for(var i = 1; i < tiers.length-1; i++){
									tiers[i].visualize();
								}
								deferred.resolve();
							}); 
						});
					} else if ( thisObj.key == "parcoords-overview" ) {
						console.log()
						index--;
						for(var i = 0; i < thisObj.tiers.length; i++){
							if(thisObj.tiers[i].type == "Parcoords"){
								thisObj.tiers[i].addData( dataset , index );
							} else if (thisObj.tiers[i].type == "Controls") {
								thisObj.tiers[i].refreshControls();
							}
						}
					}
					
					return deferred.promise(); 
				},
				// hide: function ( ) {
				// 	var classname = "#" + thisObj.container;
				// 	$( classname ).hide();
				// },
				// Set the color scheme for the metrics using this heatmap's key
				setMetricColorScheme: function ( mode ) {
					var visualization;
					if( mode == "heatmap-overview" || mode == "parcoords"){
						visualization = "global";
					} else {
						visualization = this.key;
					}
					this.metricSet.setColorScheme( this.dataKey , visualization , this.colorscheme );
				}, 
				/** Create and add tiers with the same dataset to this object.
				* @param {array} whichTiers - Each index in the array represents a new tier to create. The value of each index represents the type of tier to create. 
				* @param {array} dataset - The dataset to visualize.
				* @param {String} mode - mode in which to create the tier */
				createTiers: function ( whichTiers , dataset , mode ) {
					var thisObj = this;
					for (var i = 0; i < whichTiers.length; i++) {
						var index = thisObj.tiers.length; // Represents the unique identifier of the new tier
						// Ensure the type is accounted for
						if( whichTiers[i] == "HeatmapTier1" || whichTiers[i] == "HeatmapTier2" || whichTiers[i] == "Controls" ){
							// Will append html to the heatmap container
							// type , dataKey , key , datasets , visualizationKey , metricSet , parentKey
							thisObj.tiers.push ( tier.create( whichTiers[i], thisObj.dataKey , index , dataset , thisObj.key , thisObj.metricSet , thisObj.key , thisObj.mode ) );
						}
						
						
					}
				},
				/** 
				* Create and add single tier to this object. 
				*/
				createTier: function ( whichTier , dataset , mode ) {
					var thisObj = this,
					index = thisObj.tiers.length; // Represents the unique identifier of the new tier
					// Ensure the type is accounted for
					if( whichTier == "HeatmapTier1" || whichTier == "HeatmapTier2" || whichTier == "Controls" || whichTier == "Parcoords"){
						// Will append html to the heatmap container
						// type , dataKey , key , datasets , visualizationKey , metricSet , parentKey
						thisObj.tiers.push ( tier.create( whichTier , thisObj.dataKey , index , dataset , thisObj.key , thisObj.metricSet , thisObj.key , mode ) );
					}		
				},
				/** Initialize tiers in the visualization object (create SVG and visualize) */
				initializeTiers: function( deferred ) {
					
					var thisObj = this;
					if ( thisObj.tiers ) {
						
						for (var i = 0; i < thisObj.tiers.length; i++) {
							thisObj.tiers[i].initialize();
						};
						deferred.resolve();
					}
				},
				appendTierHTML: function ( tier ) {
					
					var tierHTML = tier.getHTML(),
					classname = "#heatmap-overview";
					$( classname ).append( tierHTML );
				},
				addTierHTML: function( tiers ) {
					
					var thisObj = this,
					tierHTML = "";
					
					for(var i = 0; i < tiers.length; i++){
						tierHTML += '' + tiers[i].getHTML();
					}
					var html = ('<div class="col-sm-12 full-height visualization-instance" id="' + thisObj.container + '" ><div class="container-fluid full-height"><div class ="row heatmap" id=' + thisObj.key + '>' + tierHTML + '</div></div></div>');
						
					// Append a container and contents for the heatmap
					$( "#vizualizations-holder" ).append( html );
					$(function () { // Opt in bootstrap tooltips ( hint callouts )
					  $('[data-toggle="tooltip"]').tooltip();
					});
				},
				/** Connect tiers to each other.
				* @param {Array} whichTiers - Array of the indexes of this.tiers[] to be connected. whichTiers[0] is the tier to be connected to whichTiers[i] */
				connectTiers: function ( whichTiers ) {
					for(var i = 1; i < whichTiers.length; i++) {
						var tier = this.tiers[ whichTiers[i] ];
						this.tiers[ whichTiers[0] ].connect( tier );
					
					}
				}
			};
			/** Visualization tiers (modules) */
			var tier = ( function(){
				/* Private Methods */

				/** Generic version of visualization tier (module). */
				var TierInstance = function( type , dataKey , key , dataset , visualizationKey , metricSet , parentKey , mode ){
					var thisObj = this;
					this.key = key;
					this.parentKey = parentKey;
					
					this.dataKey = dataKey;
					this.dataset = dataset;
					this.metricSet = metricSet;
					if( mode == "heatmap-overview" ){
						this.mode = mode;
						this.visualizationKey = "global";
					} else if (mode == "parcoords-overview"){
						this.mode = mode;
						this.visualizationKey = "parcoords-overview";
					} else if ( mode == "parcoords") {
						this.mode = mode;
						this.visualizationKey = visualizationKey;
					} else {
						this.mode = "default";
						this.visualizationKey = visualizationKey;
					}
					
					this.orderedMetrics = metricSet.orderCategories( dataKey , this.visualizationKey );
					this.orderedMetricsList = metricSet.getOrderedMetrics( dataKey , this.visualizationKey );
					this.orderedPairedMetricsList = metricSet.getOrderedPairedMetrics( dataKey , this.visualizationKey );
					this.html = {
						parentContainer: parentKey,
						id: "",
						url: "html/" + type + ".html",
						markup: {}
					};
					this.grid = {
						size: {
							width: 5,
							height: 5
						}
					}
					this.margin = {
						top: 0
					};
					this.type = type;						
					this.connectedTiers = [];
					this.hiddenRows = {};
					this.totalGutterCount = 0;
				};
				TierInstance.prototype = {
					/** Loads html into this.html. Returns deferred promise object. */
					loadHTML: function () {
						var deferred = $.Deferred(); // Create deferred object
						var thisObj = this; 
						// Load HTML
						var request = $.ajax({
							url: this.html.url,
							dataType: 'html'
						});
						// Process loaded HTML
						$.when(request).done(function( data ){
							var rId = "id=\"" + thisObj.type;
							var rId = new RegExp( rId , "g" );
							// Add specialized id for this tier
							var rReplace = "id=\"" + thisObj.type + "-" + ( thisObj.html.parentContainer ) + "-" + thisObj.key; 
							data = data.replace( rId , rReplace );
							if(thisObj.mode == "parcoords-overview" || thisObj.mode == "parcoords"){
								if( thisObj.type == "Controls" ){
									rReplace = "class=\"col-sm-2";
									rId = "class=\"col-sm-3";
									rId = new RegExp( rId , "g" );
									data = data.replace( rId , rReplace );
								} 
							}

							thisObj.html.markup = data;
							thisObj.html.id = thisObj.type + "-" + thisObj.html.parentContainer + "-" + thisObj.key;
							deferred.resolve(); 
						});
							
						return deferred.promise();
					},
					/** Counts the total count of gutters ( spaces between column categories ) */
					countGutters: function () { 
						var gutterFlag = false;
						var thisObj = this;
						this.gutterCount = 0;
						for(var categoryIndex = 0; categoryIndex < thisObj.orderedMetrics.length ; categoryIndex++ ){
							
							var categoryName = thisObj.orderedMetrics[categoryIndex].name;
							if(!thisObj.metricSet.categories[categoryName].allString){
								for(var metricIndex = 0; metricIndex < thisObj.orderedMetrics[categoryIndex].metrics.length; metricIndex++ ){
									
									var metricName = thisObj.orderedMetrics[categoryIndex].metrics[metricIndex];
									
									if( (!thisObj.metricSet.isString( metricName )) ){
										if( thisObj.metricSet.isVisible( metricName , thisObj.dataKey , thisObj.visualizationKey ) ){
											thisObj.visibleColumnCount++;
											gutterFlag = true;
										}
									}
								} // End metric loop
								if ( gutterFlag ) {
									thisObj.gutterCount++;
									gutterFlag = false;
								}
							}
						
						} //End category Loop
						this.totalGutterCount = thisObj.gutterCount;
					},
					/** Establishes the visuals of the tier. Needs to be implemented by a subclass. */
					visualize: function () { 
						var nameclass = this.html.id;
							
						$(nameclass).html('');
					},
					/** Defines svg properties and creates svg objects for the tier. Needs to be implemented by a subclass. */
					createsvg: function () { 
						console.log( " Implement this method. " );
					},
					/** Starts up the visualization of the tier. Initializes all properties. */
					initialize: function ( ) {
						this.createsvg();
						this.visualize();
							
					},
					/** Returns the HTML markup of this tier. */
					getHTML: function (  ) {
						return this.html.markup;
					}, 
					/** Loops through all non-string metrics and executes the passed draw function */
					draw: function ( drawFunction, selector ) {
						var currentMetricIndex = 0,
							thisObj = this;
							nonPermutedMetricCount = 0,
							gutterFlag = false;
						
						// thisObj.countGutters();
						this.gutterCount = 0;
						thisObj.visibleColumnCount = 0;
						for(var categoryIndex = 0; categoryIndex < thisObj.orderedMetrics.length ; categoryIndex++ ){
							
							var categoryName = thisObj.orderedMetrics[categoryIndex].name;
							if(!thisObj.metricSet.categories[categoryName].allString){
								for(var metricIndex = 0; metricIndex < thisObj.orderedMetrics[categoryIndex].metrics.length; metricIndex++ ){
									
									var metricName = thisObj.orderedMetrics[categoryIndex].metrics[metricIndex];
									
									if( (!thisObj.metricSet.isString( metricName )) ){
										if( thisObj.metricSet.isPermuted( metricName ) ){
											var currentMetricCount = currentMetricIndex - nonPermutedMetricCount;
										} else {
											var currentMetricCount = currentMetricIndex;
										}
										// Determine column x value
										var totalColumns = thisObj.visibleColumnCount + thisObj.gutterCount;
										var totalIndex = ((thisObj.metricSet.getCount( thisObj.dataKey , thisObj.visualizationKey , "visible" ) + (thisObj.totalGutterCount))/2); // total columns + gutters / 2
										var offsetIndex =  totalColumns - totalIndex;
										var offset = (offsetIndex * (thisObj.grid.size.width - .2));
										var x = offset + thisObj.svg.dimensions.widthMidpoint + (thisObj.grid.size.width/2);
										if( drawFunction ){
											drawFunction( thisObj , thisObj.gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x );
										}
										
										currentMetricIndex++;
										if( thisObj.metricSet.metrics[metricName].permuted.type != "permuted"  ){
											nonPermutedMetricCount++;
										}
										if( thisObj.metricSet.isVisible( metricName , thisObj.dataKey , thisObj.visualizationKey ) ){
											thisObj.visibleColumnCount++;
											gutterFlag = true;
										}
									}
								} // End metric loop
							}
							if ( gutterFlag ) {
								thisObj.gutterCount++;
								gutterFlag = false;
							}
						
						} //End category Loop
						this.totalGutterCount = thisObj.gutterCount;
					},
					/** Template for what a draw function could look like */
					drawFunction: function ( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x ) {
						console.log("Implement this method");
					},
					drawGrid: function ( ) {
							var thisObj = this;
							
							var gutter = thisObj.totalGutterCount;
							var offsetIndex =  (thisObj.metricSet.getCount( thisObj.dataKey , thisObj.visualizationKey , "visible" ) + gutter)/2;
									
							var offset = -1 * thisObj.grid.size.width * offsetIndex;
							var x = offset + thisObj.svg.dimensions.widthMidpoint;
							// this.svg.obj.append("circle")
							// 	.attr("x" , function(){
							// 		return x;
							// 	})
							// 	.attr("r", (thisObj.grid.size.width/4))
							// 	.attr("transform", function(d, i) {
									
							// 		return "translate(" + x + ", " + ((thisObj.grid.size.height/2) + thisObj.margin.top) + ")";
							
							// 	})
							// 	.attr("style", "fill: #FF2525")
							// 	.attr("fill-opacity", 0.2)
							// 	.attr("class", "rowSelector");
							// this.svg.obj.append("circle")
							// 	.attr("r", (thisObj.grid.size.width/4))
							// 	.attr("transform", function(d, i) {
									
							// 		var gutter = thisObj.totalGutterCount;
							// 		var offsetIndex =  (thisObj.metricSet.getCount( thisObj.dataKey , thisObj.parentKey , "visible" ) + gutter)/2;
											
							// 		var offset = (-1 * thisObj.grid.size.width * offsetIndex) + thisObj.grid.size.width;
							// 		var x = offset + thisObj.svg.dimensions.widthMidpoint ;
									
							// 		return "translate(" + x + ", " + (thisObj.margin.top/2) + ")";
							
							// 	})
							// 	.attr("y", function(){ 
							// 		return (thisObj.margin.top/2);
							// 	})
							// 	.attr("style", "fill: #FF2525")
							// 	.attr("fill-opacity", 0.2)
							// 	.attr("class", "columnSelector");
							this.draw( thisObj.initializeBlocks );
							this.draw( thisObj.drawBlocks );
							var thisObj = this;
							var dataset = thisObj.dataset.getData();
							var length = (dataset.length + 8) * thisObj.grid.size.height;
							
							
							// this.svg.obj.append("line")
							// 	.attr("x1", thisObj.svg.dimensions.widthMidpoint)
							// 	.attr("x2", thisObj.svg.dimensions.widthMidpoint)
							// 	.attr("y1", 0)
							// 	.attr("y2", length)
							// 	.attr("stroke-opacity" , 0.2)
							// 	.attr("style", "stroke: #FF2525");
							
					},
					initializeBlocks: function ( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x ) {
						var gridsvg = thisObj.svg.obj;
						var nameClass = "." + metricName;
						var dataset = thisObj.dataset.getData();
						// Initialize this block
						// Draw large grid
						var columnObj = gridsvg.selectAll(nameClass);
						columnObj
							.data(dataset)
							.enter()
							.append("rect")
							.attr("class", function(d, i){
								return i + " "+metricName+" "+ metricName + i + " " + d['originalPassword']+" "+ d['permutedPassword']+" block hiderow";
							})
							.attr("id", function(d){return d['originalPassword'] + metricName;})
							.on("mouseover", function(d, i){ 
								return thisObj.hoverTrigger( d, metricName , this , "mouseover" ) 
							})
							.on("mouseout", function(d, i){
								return thisObj.hoverTrigger( d, metricName , this , "mouseout" ) 
							});
					
					},
					drawBlocks: function ( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x ) {
						var svg = thisObj.svg.obj;
						
						var nameClass = "." + metricName;	
						
						var colorScale = thisObj.metricSet.getNormalColorScale( metricName , thisObj.dataKey , thisObj.visualizationKey );
						// Initialize this block
						// Draw large grid
						var columnObj = svg.selectAll(nameClass);
						columnObj
							.attr("width", thisObj.grid.size.width)
      						.attr("height", thisObj.grid.size.height)
      						.style("fill", function(d) { return colorScale(d[metricName]); });
      					thisObj.shiftColumns( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x );
      					thisObj.hideRows();
			
					},
					/** Connect tiers. Connected tiers will respond to events generated by other tiers.
					* @param {Tier} TierInstance - Tier object to connect 
					*/
					connect: function ( tier ) {
						this.connectedTiers.push( tier );
					}, 
					/** Color the hovered row and column. If entering a block, row and column will be highlighted. Otherwise, they will be recolored the default color. */
					colorColumnRow: function ( metricName , type , selector , row ) {
						var thisObj = this,
					    svg = thisObj.svg.obj;
					    thisObj.hoverType = type; // Temporarily stores the type of hover
						var columnClass = "." + metricName, // Class selector for the column
						blocks = svg.selectAll(".block");

						// Determine hover type and choose normal or highlight colorscale
						if(thisObj.hoverType == "mouseover") {
							var colorScale = thisObj.metricSet.getHighlightColorScale( metricName , thisObj.dataKey , thisObj.visualizationKey );
							// Dim all blocks 
							blocks.style("fill-opacity", .25);
							var rowClass = "." + metricName + row;
							var position = $(rowClass).position();
								
				    	} else {
				    		// Choose normal colorscale
				    		var colorScale = thisObj.metricSet.getNormalColorScale( metricName , thisObj.dataKey , thisObj.visualizationKey );
				    		// Dim non-highlighted blocks 
							blocks.style("fill-opacity", 1);
				    	
				    	}
					    // Color column 
					    // Set style
				    	var columnObj = svg.selectAll(columnClass);
						columnObj.style("fill", function(d) { return colorScale(d[ metricName ]); })
							.style("fill-opacity", 1);
						// Color row 
						var colorRow = function ( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x ) {
							
							var rowClass = "." + metricName + row ; // Class representing row hovered
							var rowObj = svg.selectAll(rowClass); 
					    	
					    	// Color with highlight color
					    	if(thisObj.hoverType == "mouseover") {
								var colorScale = thisObj.metricSet.getHighlightColorScale( metricName , thisObj.dataKey , thisObj.visualizationKey );
					    	
					    	// Recolor default color
					    	} else {
					    		var colorScale = thisObj.metricSet.getNormalColorScale( metricName , thisObj.dataKey , thisObj.visualizationKey );
					    	
					    	}
					    	// Set style
							rowObj.style( "fill", function( d , i ){ return colorScale( d[ metricName ]) })
								.style("fill-opacity", 1);
						};

						thisObj.draw( colorRow , row );
					},
					/** Trigger hover function for this tier and connected tiers */
					hoverTrigger: function (dataObj , name , obj , type) { 
					    
					    var thisObj = this,
					    svg = thisObj.svg.obj;
					    thisObj.hoverType = type;
					    // Get name of current block 
					    var element = d3.select(obj).attr("class"),
					    className = element.split(" "),
					    row = className[0], // Row number 
					    metricName = className[1], // Name of metric
					    selector = className[2]; 
					    // Color hovered column and row
					    thisObj.colorColumnRow( metricName , type , selector , row );
					    
					    // Color blocks for connected tiers
					    for(var i = 0; i < thisObj.connectedTiers.length; i++){
					    	
					    	if( thisObj.connectedTiers[i].hover ) {
					    		thisObj.connectedTiers[i].hover( metricName , type , selector , row , (thisObj.key - 1) );
					    	}
					    }
				
					},
					/** Activates same hover function as hoverTrigger. If a tier is connected to this tier, it will activate this function on hover. */
					hover: function ( metricName , type , selector , row ) {
						if( type === "mouseover" || type === "mouseout" ){
							this.colorColumnRow( metricName , type , selector , row );
						} 
	
					},
					/**  
					* Set filter min and max values for passed metric.
					* Determines which metrics have been filtered. 
					*/
					filterPasswords: function ( metricName, values ) {
						
						this.hiddenRows[metricName] = {
							range: {
								min: values[0],
								max: values[1]
							},
							obj: [] 
						};
						this.hideRows();
					},
					/** Hide rows of passwords indicated in this.hiddenRows */
					hideRows: function ( ) {
						var svg = this.svg.obj;
						svg.selectAll(".hiderow").style("opacity", 1);
						for(var prop in this.hiddenRows){
							
							var max = this.hiddenRows[ prop ].range.max;
							var min = this.hiddenRows[ prop ].range.min;
							
							this.hiddenRows[ prop ].obj = svg.selectAll(".hiderow").filter(function(d) { return (d[prop] < min || d[prop] > max); })
							this.hiddenRows[ prop ].obj.style("opacity", 0);
						
						}
					
					},
					/** Hide column as named by metricName */
					hideColumns: function ( metricName ) {
						var thisObj = this;
						thisObj.draw( thisObj.shiftColumns );
					},
					/**  Determine x position of columns */
					shiftColumns: function ( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x ) {
						var visible = thisObj.metricSet.isVisible( metricName , thisObj.dataKey , thisObj.visualizationKey );
						var svg = thisObj.svg.obj;
						
						var nameClass = "." + metricName;	
						var obj = svg.selectAll(nameClass);
						if( visible ){
							obj
								.attr("width", thisObj.grid.size.width)
								.attr("transform", function(d, i) {
									var y = thisObj.grid.size.height * i + thisObj.margin.top
									return "translate(" + x + ", " + y + ")";
							
								});
							
						} else {
							obj.attr("width", 0);
							
						}
						
					}
				};

				/** Represents svg properties and functions
				* @param {integer} height - Float. Desired height of the svg. Usually set to the container height.
				* @param {integer} width - Float. Desired width of the svg. Usually set to the container width. 
				* @param {String} id - HTML id of the resutling svg
				* @param {String} parentContainer - HTML container where the resulting svg element will reside 
				*/
				var Svg = function ( height, width, id, parentContainer ) {
					
					this.html = {
						container: {
							id: parentContainer
						},
						id: id
					};
					this.obj = {};
					this.viewBox = {};
					this.dimensions = {
						height: height,
						width: width
					};
					var init = function (thisObj) {
						var svgSelector = "#" + thisObj.html.container.id + " " + thisObj.html.id;
						svgSelector = $(svgSelector).toArray();
						// Determine size of SVG viewBox using parent container dimensions
						thisObj.viewBox = "0 0 " + $( thisObj.html.id ).width() + " " + (thisObj.dimensions.height);
						// SVG
						thisObj.obj = d3.selectAll(svgSelector).append("svg")
							.attr("viewBox", thisObj.viewBox)
							// .attr("overflow", "scroll")
							.attr("height", thisObj.dimensions.height)
							.attr("id" , thisObj.html.id)
				 			// .attr("width", thisObj.dimensions.width)
							// .attr("preserveAspectRatio", "xMidYMin meet")
							;
						// Determine mid point of height and width 
						thisObj.dimensions.heightMidpoint = thisObj.dimensions.height / 2;
						thisObj.dimensions.widthMidpoint = thisObj.dimensions.width / 2;
					};
					init(this);
				};
				Svg.prototype = {
					updateViewboxY: function ( yVal ) {
						var thisObj = this;
						var svgSelector = "#" + thisObj.html.container.id + " " + thisObj.html.id;
						svgSelector = $(svgSelector).toArray();
						thisObj.viewBox = "0 " + yVal + " " + $( thisObj.html.id ).width() + " " + (thisObj.dimensions.height);
						
						// SVG
						thisObj.obj.attr("viewBox", thisObj.viewBox);
					}
				};

				/** Parallel coordinates */
				var Parcoords = function (type , dataKey , key , dataset , visualizationKey , metricSet , parentKey , mode ) {
					// Call superclass
					TierInstance.call( this ,type , dataKey , key , dataset , visualizationKey , metricSet , parentKey , mode );
					
					this.currentBundledDimension = this.orderedMetricsList[0];
					this.totalData = [];
					this.totalDataList = [];
					this.visibleDatasets = [];
				};
				Parcoords.prototype = Object.create( TierInstance.prototype, {
					initialize: {
						value: function ( ) {
							this.createsvg();
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					visualize: {
						value: function ( ) {
							var thisObj = this,
								id = "#" + this.html.id, 
								color = thisObj.colorBy();
							$(id).html('');
							thisObj.parcoords = null;
							thisObj.parcoords = d3.parcoords({
								data: thisObj.totalData,
								metricSet: thisObj.metricSet,
								dataKey: thisObj.dataKey,
								visualizationKey: thisObj.visualizationKey,
								orderedMetrics: thisObj.orderedMetricsList,
							})(id);
							thisObj.parcoords
								
								.width(thisObj.width)
								.detectDimensions( )
								.dimensions( thisObj.orderedMetricsList )
								.height(thisObj.height)
								.createAxes()
								.bundlingStrength(.5) // set bundling strength
								.smoothness(.2)
								.bundleDimension(thisObj.currentBundledDimension)
								.showControlPoints(false)
								.render()
								
								.reorderable()
								.interactive()
								.brushMode("1D-axes")
								.hideAxis("datasetIndex")
								.color()
							;
							for(var i = 0; i < thisObj.orderedMetricsList.length; i++){
								// thisObj.hideMultiColumn( thisObj.orderedMetricsList[i] );
							}
							thisObj.parcoords.updateAxes().bundleDimension(thisObj.currentBundledDimension).render();
						
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					createsvg: {
						value: function () {
							var id = "#" + this.html.id,
							data = this.totalData,
							thisObj = this;
							var orderedMetricsList = this.orderedMetricsList;
							var id = "#" + this.html.id;
							thisObj.height = $( "#vizualizations-holder" ).height();
							thisObj.width = $( id ).width();

							thisObj.addData( thisObj.dataset[0] , 0);

						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					// Add data to the visualization
					addData: {
						value: function ( dataset , index ) {
							var thisObj = this,
								data = dataset.getData(),
								name = dataset.getName();
							data.forEach(function(d){
								thisObj.totalData.push(d);
							});
							thisObj.totalDataList.push( name );
							thisObj.visibleDatasets[index] = true;
							thisObj.visualize();
							// thisObj.parcoords.autoscale().updateAxes().bundleDimension(thisObj.currentBundledDimension).render();
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					// Change which data is being viewed
					viewData: {
						value: function () {
							
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					hideColumns: {
						value: function ( metricName ) {
							var thisObj = this;
							var visible = thisObj.metricSet.isVisible( metricName , thisObj.dataKey , thisObj.visualizationKey );
							
							if( visible ){ 
								thisObj.parcoords.showAxis( metricName ).updateAxes().bundleDimension( thisObj.currentBundledDimension ).render(); 	
							} else {
								thisObj.parcoords.hideAxis( metricName ).updateAxes().bundleDimension( thisObj.currentBundledDimension ).render();
							}
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					hideMultiColumn: {
						value: function ( metricName ) {
							var thisObj = this,
								visible = thisObj.metricSet.isVisible( metricName , thisObj.dataKey , thisObj.visualizationKey );
							
							if( visible ){ 
								thisObj.parcoords.showAxis( metricName ); 	
							} else {
								thisObj.parcoords.hideAxis( metricName );
							}
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					bundleBy: {
						value: function ( metricName ) {
							this.parcoords.bundleDimension( metricName ).render(); 
							this.currentBundledDimension = metricName;
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					colorBy: {
						value: function ( metricName ) {
							var thisObj = this;
								
							// return color function based on plot and dimension
							function zcolor(col, dimension) {
								var z = zscore(_(col).pluck(dimension).map(parseFloat)),
							  		zcolorscale = thisObj.metricSet.getZscoreColorScale( metricName , thisObj.dataKey , thisObj.visualizationKey );
								return function(d) { return zcolorscale(z(d[dimension])) }
							};
							// color by zscore
							function zscore(col) {
							  var n = col.length,
							      mean = _(col).mean(),
							      sigma = _(col).stdDeviation();
							  return function(d) {
							    return (d-mean)/sigma;
							  };
							};
							if( metricName == "datasetIndex" || !metricName){ // color categorically
								var colors = d3.scale.category10();
								colorFunction = function(d) { return colors(d.datasetIndex); };
								console.log(colorFunction)
								console.log(colorFunction(0));
								if( !metricName ){
									return colorFunction;
								}
							} else { // color statistically
								colorFunction = zcolor(thisObj.parcoords.data(), metricName);
							}
							
							this.parcoords.color( colorFunction ).render(); 
							this.currentColor = metricName;
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					updateSmoothness : {
						value: function ( value ) {
							this.parcoords.smoothness( value ).render(); 
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					updateBundling : {
						value: function ( value ) {
							this.parcoords.bundlingStrength( value ).render(); 
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					}, 
					brushData : {
						value: function ( dataIndex ) {
							var data = [],
								thisObj = this;
							console.log(thisObj.visibleDatasets)
							if( thisObj.visibleDatasets[dataIndex] ){ // make invisible
								thisObj.visibleDatasets[dataIndex] = false;
							} else { // make visible
								thisObj.visibleDatasets[dataIndex] = true;
							}
							console.log(thisObj.visibleDatasets);
							
							data = thisObj.totalData.filter(function (d, i){
								console.log(thisObj.visibleDatasets[d.datasetIndex])
								console.log(d.datasetIndex)
								return thisObj.visibleDatasets[d.datasetIndex];
							});
							console.log(data);
							console.log(thisObj.totalData)
							thisObj.parcoords.brushUpdated( data );
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					}
				}); 
				Parcoords.prototype.constructor = Parcoords;

				/** Heatmap small sidebar view */
				var HeatmapTier1 = function (type , dataKey , key , dataset , visualizationKey , metricSet , parentKey , mode ) {
					// Call superclass
					TierInstance.call( this ,type , dataKey , key , dataset , visualizationKey , metricSet , parentKey , mode );
					
					// Custom grid size
					this.grid = {
						size: {
							width: 2,
							height: 2
						}
					};
					
				};
				HeatmapTier1.prototype = Object.create( TierInstance.prototype, {
					visualize: {
						value: function ( ) {
							this.draw();
							var nameclass = this.html.id;
							
							$(nameclass).html('');
							this.drawGrid();
							this.draw( this.addFunctionality );
							
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					getGridSize: {
						value: function ( ) {
							
							return this.grid.size;
							
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					calculateGridSize: {
						value: function () {
							var height = this.svg.dimensions.height,
							width = this.svg.dimensions.width;
							// Calculate grid size 
							var numMetrics = this.metricSet.getCount( this.dataKey , this.visualizationKey ),
							data = this.dataset.getData(),
							numRows = data.length,
							gridSizeWidth = width / numMetrics,
							gridSizeHeight = height / numRows,
							min = d3.min([ gridSizeWidth , gridSizeHeight ]);
							
							if( gridSizeHeight >  min ){
								var gridSizeHeight = min;
							}
							 
							this.grid = {
								size: {
									width: gridSizeWidth,
									height: gridSizeHeight
								}
							};
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					createsvg: {
						value: function () {
							var id = "#" + this.html.id,
							height = $( "#vizualizations-holder" ).height(),
							width = $( id ).width();
							console.log(id)
							console.log(width)
							if(this.mode == "heatmap-overview"){
								$(id).append('<button class="btn btn-default navbar-btn btn-sm overview-view-btn" id="' + this.dataset.getName() + '" type="submit" ><span class="glyphicon glyphicon-eye-open" aria-hidden="true" ></span></button>');
								var buttonHeight = $(".overview-view-btn").outerHeight();
								height -= buttonHeight;
								$(".overview-view-btn").click( function(e) {
									
									var id = "#view-" + $(this).attr("id");
									$(id).click();
									
								});
							}
							this.svg = new Svg(height, width, id, this.html.parentContainer);
							this.calculateGridSize();
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					scrollTo: {
						value: function ( row ) {
							var thisObj = this;
							// Color blocks for connected tiers
						    for(var i = 0; i < thisObj.connectedTiers.length; i++){
						    	if( thisObj.connectedTiers[i].scrollTo ) {
						    		thisObj.connectedTiers[i].scrollTo( row );
						    	}
						    }
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					addFunctionality: {
						value: function ( thisObj, categoryIndex , metricIndex , metricName , currentMetricIndex ) {
							var gridsvg = thisObj.svg.obj;
							var nameClass = "." + metricName;
							var dataset = thisObj.dataset.getData();
							// Initialize this block
							// Draw large grid
							var columnObj = gridsvg.selectAll(nameClass);
							columnObj
								.on("click", function(d, i){
									return thisObj.scrollTo( i ); 
								});
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					}
				}); 
				HeatmapTier1.prototype.constructor = HeatmapTier1;

				/** Heatmap medium view */
				var HeatmapTier2 = function (type , dataKey , key , dataset , visualizationKey , metricSet , parentKey , mode ) {
					TierInstance.call( this , type , dataKey , key , dataset , visualizationKey , metricSet , parentKey , mode );
					
					this.grid = {
						size: {
							width: 17,
							height: 17
						},
						margin: {
							top: 0,
							column: 10 
						}
					}
					this.labels = {
						password: {
							margin: {
								left: 15
							}
							
						}, 
						column: {
							margin: {
								bottom: 10
							},
							size: {
								line: 5
							}
						}
					}
				
				};
				HeatmapTier2.prototype = Object.create( TierInstance.prototype, {
					visualize: {
						value: function ( ) {
							this.draw();
							var nameclass = this.columnsSvg.html.id + " svg";
							$(nameclass).html('');
							var nameclass = this.svg.html.id + " svg";
							$(nameclass).html('');
							this.drawGrid();
							this.drawLabels();

						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					}, 
					createsvg: {
						value: function () {
							var id = "#" + this.html.id + "-columns-svg-container";
							var height = 250;
							var width = $( id ).width();
							this.columnsSvg = new Svg( height, width, id, this.html.parentContainer );
							
							id = "#" + this.html.id + "-grid-svg-container";
							height = $( "#vizualizations-holder" ).height() - this.columnsSvg.dimensions.height
							
							width = $( id ).width();
							this.svg = new Svg( height, width, id, this.html.parentContainer );
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					hideColumns: {
						value: function ( metricName ) {
							var thisObj = this;
							thisObj.draw();
							thisObj.draw( thisObj.shiftColumns );
							thisObj.draw( thisObj.shiftColumnLabels );
							thisObj.shiftPasswordLabels();
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					drawLabels:{
						value: function ( ) {
							var thisObj = this;
							this.drawPasswordLabels();
							this.draw( thisObj.drawColumnLabels );
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					drawPasswordLabels: {
						value: function ( ) {
							var thisObj = this;
							var dataset = thisObj.dataset.getData();
							var gridsvg = thisObj.svg.obj;
							var columnssvg = thisObj.columnsSvg.obj ;
							// Create password labels for main diagram
							var passwordLabels = gridsvg.selectAll(".passwordLabels")
								.data(dataset)
								.enter().append("text")
								.text(function (d) { return d['originalPassword']; })
								.style("text-anchor", "end")
								.attr("transform", function (d, i) { 
									return "translate(" + (( -1 * thisObj.grid.size.width * ( (thisObj.metricSet.getCount( thisObj.dataKey , thisObj.visualizationKey , "visible" ) +  thisObj.orderedMetrics.length - 1)/2)) - thisObj.labels.password.margin.left + thisObj.svg.dimensions.widthMidpoint) + "," +  ((i * thisObj.grid.size.height) + thisObj.grid.margin.top + (thisObj.grid.size.height * .8)) + ")";
								})
								.attr("class", function (d, i) { return "password mono hiderow passwordLabels" })
								.attr("id", function (d, i) { return "labelpassword"+i; });

							// Create password labels for main diagram
							var passwordLabelsPermuted = gridsvg.selectAll(".passwordLabelsPermuted")
								.data(dataset)
								.enter().append("text")
								.text(function (d) { return d['permutedPassword']; })
								.style("text-anchor", "start")
								.attr("transform", function (d, i) { return "translate(" + (( thisObj.grid.size.width * ( (thisObj.metricSet.getCount( thisObj.dataKey , thisObj.visualizationKey , "visible" ) +  thisObj.orderedMetrics.length - 1)/2)) + thisObj.labels.password.margin.left + thisObj.svg.dimensions.widthMidpoint) + "," +  ((i * thisObj.grid.size.height) + thisObj.grid.margin.top + (thisObj.grid.size.height * .8)) + ")";
								})
								.attr("class", function (d, i) { return "password mono hiderow passwordLabelsPermuted" })
								.attr("id", function (d, i) { return "labelpassword"+i; });	
							thisObj.shiftPasswordLabels();
							
							// Create labels for columns
							var labels = columnssvg.selectAll(".metricLabel")
								.data(thisObj.orderedMetrics)
								.enter().append("g")
								.attr("class", function(d, i){
									return (d.name + i + "");
								});
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					shiftPasswordLabels: {
						value: function ( ) {
							var thisObj = this;
							var gridsvg = this.svg.obj;
							var x = 0;
							var offset = 0;
							var gutter = thisObj.totalGutterCount;
							var offsetIndex =  (thisObj.metricSet.getCount( thisObj.dataKey , thisObj.visualizationKey , "visible" ) + gutter)/2;
							
							// Create password labels for main diagram
							var passwordLabels = gridsvg.selectAll(".passwordLabels")
							
								.attr("transform", function (d, i) { 
									
									offset = -1 * thisObj.grid.size.width * offsetIndex;
									x = offset - thisObj.labels.password.margin.left + thisObj.svg.dimensions.widthMidpoint ;
									return "translate(" + x + "," +  ((i * thisObj.grid.size.height) + thisObj.margin.top + (thisObj.grid.size.height * .8)) + ")";
								});
							// Create password labels for main diagram
							var passwordLabelsPermuted = gridsvg.selectAll(".passwordLabelsPermuted")
								.attr("transform", function (d, i) { 
									offset = ( thisObj.grid.size.width * (offsetIndex));
									x = offset + thisObj.labels.password.margin.left + thisObj.svg.dimensions.widthMidpoint;
									return "translate(" + x + "," +  ((i * thisObj.grid.size.height) + thisObj.margin.top + (thisObj.grid.size.height * .8)) + ")";
								});
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					drawColumnLabels: {
						value: function ( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x ) {
							var columnssvg = thisObj.columnsSvg.obj ;
						
							var id = "." + thisObj.orderedMetrics[categoryIndex].name + categoryIndex + "";
							var labels = columnssvg.selectAll(id);
							labels.append("text")
								.text(function(d, i){
									return thisObj.metricSet.metrics[metricName].label;
								})
								.style("text-anchor", "start")
								.attr("class", function(){return "label"+ metricName +" columnLabel mono axis step "+ metricName});

							// labels.append("line")
							// 	.attr("x1", 0)
							// 	.attr("x2", thisObj.labels.column.size.line)
							// 	.attr("y1", 0)
							// 	.attr("y2", 0)
							// 	.attr("style", "stroke: #000")
							// 	.attr("class", function(){return metricName + "Line" });

							thisObj.shiftColumnLabels( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x );
						
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					shiftColumnLabels: {
						value: function ( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x ) {
							var svg = thisObj.columnsSvg.obj,
								nameClass = "." + metricName,
								obj = svg.selectAll( nameClass ),
								isVisible = thisObj.metricSet.isVisible( metricName , thisObj.dataKey , thisObj.visualizationKey ),
								nameClassLine = "." + metricName + "Line"
								lineObj = svg.selectAll(nameClassLine);
							if( isVisible ){
								obj
									.attr("fill-opacity", 1)
									.attr("transform", function(d, i) {
										return "translate(" + (x + (thisObj.grid.size.width * .5)) + ", " + (thisObj.columnsSvg.dimensions.height) + "), rotate(-70)";
								
									});
								lineObj
									.attr("stroke-opacity", 0.2)
									.attr("transform", function(d, i) {
										return "translate(" + (x + (thisObj.grid.size.width * .5)) + ", " + thisObj.columnsSvg.dimensions.height + "), rotate(-90)";
								
									});
								
							} else {
								obj.attr("fill-opacity", 0);
								lineObj.attr("stroke-opacity", 0);
								
							}
						
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					scrollTo: {
						value: function ( row ) {
							thisObj = this; 
							var svg = thisObj.svg.obj;
							var classname = "." + row;
							var position = $(classname).position();
							var yVal = thisObj.grid.size.height * row;
							if(yVal > this.svg.dimensions.heightMidpoint){
								yVal -= this.svg.dimensions.heightMidpoint; 
							} else {
								yVal = 0;
							}
							
							this.svg.updateViewboxY( yVal );
						
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					}
				}); 
				HeatmapTier2.prototype.constructor = HeatmapTier2;

				/** Visualization controls */  
				var Controls = function (type , dataKey , key , dataset , visualizationKey , metricSet , parentKey , mode) {
					TierInstance.call( this , type , dataKey , key , dataset , visualizationKey , metricSet , parentKey , mode);
					// Size and margin information for grid
					this.grid = {
						size: {
							width: 15,
							height: 15
						},
						margin: {
							top: 80,
							right: 0,
							left: 10
						}
					};
					this.datasetIndex = 0;
				};
				Controls.prototype = Object.create( TierInstance.prototype, {
					visualize: {
						value: function ( ) {
							if( this.mode == "heatmap" || this.mode == "default" || this.mode == "heatmap-overview" ){
								this.drawLabels();
								this.drawBlocks();
							}
							
							this.initializeControls();
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					createsvg: {
						value: function () {
							var thisObj = this;
							var id = "#" + thisObj.html.id + "-svg-container",
							width = $( id ).width(),
							height = (thisObj.grid.size.height * thisObj.metricSet.getCount( thisObj.dataKey , thisObj.visualizationKey )) + 50 ;
							this.svg = new Svg( height, width, id, this.html.parentContainer )
							this.grid.margin.left = this.svg.dimensions.width - (this.grid.size.width * 10) + 5;
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					}, 
					initializeControls: {
						value: function () {
							this.createPanels();
							this.refreshControls();
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					refreshControls: {
						value: function () {
							var parent = "#" + thisObj.parentKey;
							// Clear panels if they exist
							$( parent + ' .filter-holder').html('');
							$( parent + ' .rank-holder').html('');
							$( parent + ' #bundleBy-menu').html('');
							$( parent + ' .hide-columns-holder' ).html('');
							$( parent + ' .about-dataset-toggle-group').html('');
							if(this.mode == "parcoords-overview"){
								this.addHideDataControl();
							} else if ( this.mode == "heatmap-overview" ) {
								this.addDataControl();
							}
							this.draw( this.addControls );
							
							this.createEventHandlers();
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					addControls: {
						value: function( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x ) {
							var metricObj = thisObj.metricSet.metrics[metricName],
								categoryName = thisObj.orderedMetrics[categoryIndex].name
								metricLabel = metricObj.label,
								parent = "#" + thisObj.parentKey;
								
							if( thisObj.mode == "heatmap" || thisObj.mode == "heatmap-overview" || thisObj.mode == "default"){
								if( metricIndex == 0 ){
									// Filter: Append category title
									$( parent + ' .filter-holder').append('<h4>' + categoryName + '</h4>');
									// Rank by: Append category title 
									$( parent + ' .rank-holder').append('<br><h4 class="rank-category-label" >' + categoryName + '</h4>');
								}
								
								thisObj.addFilterSliders( metricName , thisObj );
								thisObj.addRankByButton( metricName , thisObj );
							} else if ( thisObj.mode == "parcoords" || thisObj.mode == "parcoords-overview" ) {
								thisObj.addBundleByControl( metricName , thisObj );
							} 
							if( metricIndex == 0 ){
								// Show/hide: Append category title
								$( parent + ' .hide-columns-holder').append('<br><h4 class="hide-columns-label" >' + categoryName + '</h4>');
							}
							thisObj.addShowHideControl( metricName , thisObj );
						},
						enumerable: true,
						configurable: true, 
						writable: true
					},
					addData: {
						value: function() {
							this.refreshControls();
						},
						enumerable: true,
						configurable: true, 
						writable: true
					},
					createPanels: {
						value: function( thisObj ) {
							var thisObj = this,
								parent = "#" + thisObj.parentKey;
							
							thisObj.createAboutPanel(); // Append panels
							if( thisObj.mode == "heatmap" || thisObj.mode == "heatmap-overview" || thisObj.mode == "default" ){
								thisObj.createFilterRankPanels();
							} else if ( thisObj.mode == "parcoords" || thisObj.mode == "parcoords-overview") {
								thisObj.createAppearancePanels();
							}
								
							thisObj.createShowHidePanel();
						},
						enumerable: true,
						configurable: true, 
						writable: true
					},
					createEventHandlers: {
						value: function( thisObj ) {
							var thisObj = this,
								parent = "#" + thisObj.parentKey;
							
							$(parent + " .sortBtn").click(function(){ // Rank by
							    var id = $(this).children().attr("id");
							    $( parent + ' .display-btn').addClass('active');
							    thisObj.sortPasswords( id );
							});
							$( parent + " .hide-column-btn").click(function(){ // Show/hide columns
								var id = $(this).attr("id");
								id = id.replace("-hide-column", "");
								thisObj.triggerHideColumns( id );
							});
							$( parent + " .show-hide-data-btn").click(function(){ // Show/hide dataset
								var id = $(this).attr("id");
								id = id.replace("-show-hide-data-btn", "");
								console.log(id)
								thisObj.triggerHideData( id );
							});
						},
						enumerable: true,
						configurable: true, 
						writable: true
					},
					createAboutPanel: {
						value: function() {
							var thisObj = this;
							var parent = "#" + thisObj.parentKey;
							// About this dataset panel
							$( parent + ' .controls-filedata' ).append('<div class="panel-group controls-filedata" id="accordion"><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" data-parent="" class="about-dataset-' + thisObj.parentKey + '" href="#about-dataset-' + thisObj.parentKey + '"></a></h4></div><div id="about-dataset-' + thisObj.parentKey + '" class="panel-collapse collapse in"><div class="panel-body about-dataset-container"><table class="table table-hover about-dataset-holder"></table></div></div></div></div>');
							var classname = '.about-dataset-' + thisObj.parentKey;
							if( thisObj.mode == "default") {
								var dataset = thisObj.dataset.getData();
								
								$( classname ).html('About this dataset');
								// File displayed 
								$( parent + ' .about-dataset-holder').append('<tr><th>File displayed:<td id="fileDisplayed">' + thisObj.dataKey + '</td></tr>');
								// Number of passwords
								$( parent + ' .about-dataset-holder').append('<tr><th>Number of passwords:<td id="numPasswords">' + dataset.length + '</td></tr>');
							} else if ( thisObj.mode == "parcoords" ) {
								
								var data = thisObj.dataset[0].getData();
								
								$( classname ).html('About this dataset');
								// File displayed 
								$( parent + ' .about-dataset-holder').append('<tr><th>File displayed:<td id="fileDisplayed">' + thisObj.dataKey + '</td></tr>');
								// Number of passwords
								$( parent + ' .about-dataset-holder').append('<tr><th>Number of passwords:<td id="numPasswords">' + data.length + '</td></tr>');
							} else if ( thisObj.mode == "parcoords-overview" ) {								
								$( classname ).html('About dataset(s)');
								classname = '#about-dataset-' + thisObj.parentKey;
							} else {
								$( classname ).html('About dataset(s)');
							}
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					createFilterRankPanels: {
						value: function( thisObj ) {
							var thisObj = this;
							var parent = "#" + thisObj.parentKey; 
							
							// Filter
							$( parent + ' .controls-controls' ).prepend('<div class="panel panel-default" data-toggle="tooltip" title="Click and drag the sliders left and right to filter rows of passwords based on their metric value." data-placement="top"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" data-parent="" href="#filter-dataset-' + thisObj.parentKey + '" > Filter </a></h4></div><div id="filter-dataset-' + thisObj.parentKey + '" class="panel-collapse collapse"><div class="panel-body"><div class="container-fluid filter-holder" ></div></div></div></div>');
							// Rank
							$( parent + ' .controls-controls' ).prepend('<div class="panel panel-default" data-toggle="tooltip" title="Click any metric name to rank rows of passwords by that metric" data-placement="top"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" data-parent="" href="#rank-dataset-' + thisObj.parentKey + '">Rank by</a></h4></div><div id="rank-dataset-' + thisObj.parentKey + '" class="panel-collapse collapse"><div class="panel-body"><div class="button-group rank-holder" data-toggle="buttons"></div></div></div></div>');
						},
						enumerable: true,
						configurable: true, 
						writable: true
					},
					createAppearancePanels: {
						value: function() {
							var thisObj = this;
							var parent = "#" + thisObj.parentKey; 
							
							//Bundling and Smoothness controls
							$( parent + ' .controls-controls' ).prepend('<div class="panel panel-default" data-toggle="tooltip" title="Click and drag the sliders left and right to adjust bundling and smoothness of lines." data-placement="top"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" data-parent="" href="#bundling-dataset-' + thisObj.parentKey + '" > Appearance </a></h4></div><div id="bundling-dataset-' + thisObj.parentKey + '" class="panel-collapse collapse"><div class="panel-body"><div class="container-fluid bundling-holder" ></div></div></div></div>');
							$( parent + ' .bundling-holder').append('<h5>Smoothness <span id="smoothness-value">0.2</span></h5><div id="smoothness"></div><br>');
							$( parent + ' .bundling-holder').append('<h5>Bundling <span id="bundling-value">0.5</span></h5><div id="bundling"></div><br>');
							// Bundling/smoothness: Activate sliders
							$(parent + " #smoothness").empty().slider({
								orientation: "horizontal",
								value: 0.2,
								min: 0,
								max: 0.25,
								step: 0.01,
								range: "min",
								animate: true,
								slide: function( event, ui ) {
									thisObj.updateSmoothness( ui.value );
									var labelID = "#smoothness-value";
									$( parent + " " + labelID).html(ui.value);
								}
							});
							// Bundling/smoothness: Activate sliders
							$(parent + " #bundling").empty().slider({
								orientation: "horizontal",
								value: 0.5,
								min: 0,
								max: 1,
								step: 0.05,
								range: "min",
								animate: true,
								slide: function( event, ui ) {
									thisObj.updateBundling( ui.value );
									var labelID = "#bundling-value";
									$( parent + " " + labelID).html(ui.value);
								}
							});
							// Bundle by 
							$( parent + ' .bundling-holder').append('<h5>Bundle by</h5><div class="btn-group-vertical navbar-btn" id="bundleBy-menu" role="group" aria-label="..."></div>');
							// Color by 
							$( parent + ' .bundling-holder').append('<h5>Color by</h5><div class="btn-group-vertical navbar-btn" id="colorBy-menu" role="group" aria-label="..."></div>');
						},
						enumerable: true,
						configurable: true, 
						writable: true
					},
					createShowHidePanel: {
						value: function( thisObj ) {
							var thisObj = this;
							var parent = "#" + thisObj.parentKey; 
							
							// Show / hide columns
							$( parent + ' .controls-controls' ).prepend('<div class="panel panel-default" data-toggle="tooltip" title="Click any metric name to hide that metric column" data-placement="top"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" data-parent="" href="#show-dataset-' + thisObj.parentKey + '"> Show/Hide Columns </a></h4></div><div id="show-dataset-' + thisObj.parentKey + '" class="panel-collapse collapse"><div class="panel-body"><div class="button-group hide-columns-holder showHide-input-holder" data-toggle="buttons"></div></div></div></div></div>');
							$( parent + ' .controls-controls' ).prepend('<h3>Controls</h3>');
						},
						enumerable: true,
						configurable: true, 
						writable: true
					},
					addFilterSliders: {
						value: function( metricName, thisObj ) {
							var thisObj = this,
								parent = "#" + thisObj.parentKey,
								metricObj = thisObj.metricSet.metrics[metricName],
								metricLabel = metricObj.label,
								sliderlabelid =  metricName + '-sliderRange'
								sliderid = metricName;;
							// Filter 
							var html = '<div class="row"><div class="col-sm-12"><h5>' +  metricLabel + ':  <span id="' + sliderlabelid + '" ></h5></div><div class="col-sm-12"><div id="' + sliderid + '" style="" class="slider"></div></div></div>';
							$( parent + ' .filter-holder').append(html);
							// Retrieve min and max of metric domain
							if(thisObj.mode == "heatmap-overview"){
								var min = Math.round(metricObj.domainVal["global"].min * 100)/100,
								max = Math.round(metricObj.domainVal["global"].max * 100)/100;
							} else {
								var min = Math.round(metricObj.domainVal[thisObj.dataKey].min * 100)/100,
								max = Math.round(metricObj.domainVal[thisObj.dataKey].max * 100)/100;
							}
							
							var id = "#"+sliderlabelid;
							$( parent + " " + id).append( min + " - " + max);
							id = parent + " " + '#' + sliderid;
							 // Filter: Activate sliders
							$(id).empty().slider({
								orientation: "horizontal",
								range: true,
								min: min,
								max: max,
								values: [min,max],
								animate: true,
								slide: function( event, ui ) {
									
									var metricName = $(event.target).attr("id");
									
									thisObj.filterPasswords( metricName, ui.values );
									var labelID = "#" + metricName + "-sliderRange";
									$( parent + " " + labelID).html(ui.values[0] + " - " + ui.values[1]);
								}
							});
						},
						enumerable: true,
						configurable: true, 
						writable: true
					},
					addRankByButton: {
						value: function( metricName, thisObj ) {
							var parent = "#" + thisObj.parentKey,
								metricObj = thisObj.metricSet.metrics[metricName],
								metricLabel = metricObj.label;
							// Rank by 
							$( parent + ' .rank-holder').append('<label class="sortBtn btn btn-xs btn-default btn-block"><input type="radio" name="options" id="' + metricName + '">' + metricLabel + '</label>');
						},
						enumerable: true,
						configurable: true, 
						writable: true
					},
					addBundleByControl: {
						value: function( metricName, thisObj ) {
							var parent = "#" + thisObj.parentKey,
								metricObj = thisObj.metricSet.metrics[metricName],
								metricLabel = metricObj.label;
							// Bundle by
							$( parent + ' #bundleBy-menu').append('<button class="btn btn-default btn-sm" href="#" role="button" data="' + metricName + '" id="bundle-' + metricName + '" href="bundle-' + metricName + '">' + thisObj.metricSet.metrics[metricName].label + '</button>')
							// Color by
							$( parent + ' #colorBy-menu').append('<button class="btn btn-default btn-sm" href="#" role="button" data="' + metricName + '" id="color-' + metricName + '" href="view-' + metricName + '">' + thisObj.metricSet.metrics[metricName].label + '</button>')
							var name = parent + " #bundle-" + metricName;
							$( name ).on("click", function(e){
								e.preventDefault();
								var metricName = $(e.target).attr("data");
								thisObj.bundleBy( metricName );
							});
							name = parent + " #color-" + metricName;
							$( name ).on("click", function(e){
								e.preventDefault();
								var metricName = $(e.target).attr("data");
								thisObj.colorBy( metricName );
							});
						},
						enumerable: true,
						configurable: true, 
						writable: true
					},
					addShowHideControl: {
						value: function( metricName , thisObj ) {
							var parent = "#" + thisObj.parentKey,
								metricObj = thisObj.metricSet.metrics[metricName],
								metricLabel = metricObj.label;
								var activeVal = "";
								if( thisObj.metricSet.isVisible( metricName , thisObj.dataKey , thisObj.visualizationKey ) ) { activeVal = "active"; }
								$( parent + ' .hide-columns-holder' ).append( '<label class="btn btn-xs btn-block btn-default ' + activeVal + ' hide-column-btn" id="' + metricName + '-hide-column" style="margin:0px;"><input type="checkbox">' + metricLabel + '</label>' );
						},
						enumerable: true,
						configurable: true, 
						writable: true
					},
					addHideDataControl: {
						value: function () {
							var parent = "#" + this.parentKey;
							$(parent + ' .about-dataset-holder').html('');
							for(var i  = 0; i < this.dataset.length; i++){
								$( parent + ' .about-dataset-holder').append('<tr><th>'+ this.dataset[i].getName() +'<td><div class="btn-group about-dataset-toggle-group" data-toggle="buttons"><label class="btn btn-default btn-xs active show-hide-data-btn" id="' + i + '-show-hide-data-btn"><input type="checkbox" autocomplete="off" checked> toggle view </label></div></td></tr>');
							}
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					addDataControl : {
						value: function() {
							var parent = "#" + this.parentKey;
							console.log(this);
							$(parent + ' .about-dataset-holder').html('');
							for(var i  = 0; i < this.dataset.length; i++){
								var data = this.dataset[i].getData();
								$( parent + ' .about-dataset-holder').append('<tr><th>'+ this.dataset[i].getName() +'<td><b># passwords:</b> ' + data.length + '</td></tr>');
							}
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					drawLabels: {
						value: function () {
							var thisObj = this;
							var svg = thisObj.svg.obj;
							var x = thisObj.grid.margin.left;
							var parent = "#" + thisObj.parentKey;
							$( parent + "#Controls-svg-container").append('<h3>Breakdown</h3>');
							// Create labels for columns
							// Each category has <g> 
							var breakdownLabel = svg.selectAll(".breakdownLabel")
								.data(thisObj.orderedMetrics)
								.enter().append("g").attr("class", function(d, i){
									return d.name + i + " breakdownLabel";
								});
							svg.append("text")
								.text("Original")
								.attr("transform", function(){
									return "translate(" + (x + (thisObj.grid.size.width * .5)) + ", " + (thisObj.grid.margin.top - 25) + ")rotate(-70)";
								})
								.attr("class", function(){
									return "mono";
								});
							svg.append("text")
								.text("Permuted")
								.attr("transform", function(){
									return "translate(" + (x + (thisObj.grid.size.width * 4)) + ", " + (thisObj.grid.margin.top - 25) + ")rotate(-70)";
								})
								.attr("class", function(){
									return "mono";
								});
							svg.append("text")
								.text("Permuted")
								.attr("font-weight", "bolder")
								.attr("transform", function(){
									return "translate(" + (x + (thisObj.grid.size.width * 3) - (thisObj.grid.size.width/2)) + ", " + (thisObj.grid.margin.top - 7) + ")";
								})
								.attr("class", function(){
									return "mono permuted";
								});
							svg.append("text")
								.style("text-anchor", "end")
								.text("Original")
								.attr("font-weight", "bolder")
								.attr("transform", function(){
									return "translate(" + (x + (thisObj.grid.size.width * 1.8) - (thisObj.grid.size.width/2)) + ", " + (thisObj.grid.margin.top - 7) + ")";
								})
								.attr("class", function(){
									return "mono original";
								});
							// svg.append("text")
							// 	.text("Change")
							// 	.attr("transform", function(){
							// 		return "translate(" + (x + (thisObj.grid.size.width * 6)) + ", " + (thisObj.grid.margin.top - 5) + ")rotate(-70)";
							// 	})
							// 	.attr("class", function(){
							// 		return "mono";
							// 	});
							var draw = function (  thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x ) {
								var svg = thisObj.svg.obj; 
								var leftMargin = thisObj.grid.margin.left;
								var topMargin = thisObj.grid.margin.top;
								var name = metricName;
								var className = "." + thisObj.orderedMetrics[categoryIndex].name + categoryIndex;
								var label = svg.selectAll(className);
								if(thisObj.metricSet.metrics[name].permuted.type != "permuted"){
		
									label.append("text")
									.text(function() { 
	
										return thisObj.metricSet.metrics[name].label;
								 
									})
									.style("text-anchor", "end")
									.attr("transform", function() {
										
										return "translate(" + (leftMargin - 20) + ", " + ((thisObj.grid.size.height * (currentMetricIndex + categoryIndex))+ topMargin + (thisObj.grid.size.height * .75)) + "), rotate(0)";
									
									})
									.attr("class", function(d, i){return "breakdownlabel-"+ name +" mono  "+ name + " new"+name + " breakdownlabel-new"+ name });
									label.append("text")
									.text(function() { 
	
										return " 0 ";
								 
									})
									.style("text-anchor", "middle")
									.attr("transform", function() {
										
										return "translate(" + ((leftMargin - 1) ) + ", " + ((thisObj.grid.size.height * (currentMetricIndex+ categoryIndex))+ topMargin + (thisObj.grid.size.height * .75)) + "), rotate(0)";
									
									})
									.attr("class", function(){return "breakdown-holder-"+name+" mono "+name});
								} else {
									label.append("text")
										.text(function() { 
		
											return " 0 ";
									 
										})
										.style("text-anchor", "middle")
										.attr("transform", function(d , i) {
											
											var x = ((leftMargin - 1) + (thisObj.grid.size.width * 4))
											
											var padding = (thisObj.grid.size.height * .75);
											var gridHeight = thisObj.grid.size.height;
											var offsetIndex = (nonPermutedMetricCount) - ( ( currentMetricIndex - nonPermutedMetricCount ) + ( categoryIndex) );
											var offset = gridHeight * offsetIndex;
																						
											var y = (offset + topMargin + padding);
											return "translate(" + x + ", " + y + "), rotate(0)";
										})
										.attr("class", function(){return "breakdown-holder-"+name+" mono "+name});
								}
							};
								
							thisObj.draw( draw );	
		
							thisObj.draw( thisObj.populateValues , 1 , 0 );
							
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					drawBlocks: {
						value: function () {
							var thisObj = this;
							var svg = thisObj.svg.obj;
							var leftMargin = thisObj.grid.margin.left;
							var topMargin = thisObj.grid.margin.top;

							// Create labels for blocks
							var breakdownBlocks = svg.selectAll(".breakdownBlock")
								.data(thisObj.orderedMetrics)
								.enter().append("g").attr("class", function(d, i){
									return d.name + i + "-block";
								});
							
								
							var draw = function ( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x ) {
										
								var className = "." + thisObj.orderedMetrics[categoryIndex].name + categoryIndex + "-block";
								var block = svg.selectAll(className);
								var permutedFlag = false;
						
								if(thisObj.metricSet.metrics[metricName].permuted.type != "permuted"){
									
									block.append("rect").text(function(d,i){
										return
									})
									.attr( "width", thisObj.grid.size.width )
									.attr( "height", thisObj.grid.size.height )
									.attr("transform", function(){
										return "translate(" + ((leftMargin - 1) + thisObj.grid.size.width) + ", " + ((thisObj.grid.size.height * (currentMetricIndex+ categoryIndex))+ topMargin) + "), rotate(0)";
									})
									.attr("class", function(){return "block-"+ metricName});
									
								// Draw permuted block
								} else {
									block.append("rect").text(function(d,i){
										return
									})
									.attr( "width", thisObj.grid.size.width )
									.attr( "height", thisObj.grid.size.height )
									.attr("transform", function(){
											var x = ((leftMargin - 1) + (thisObj.grid.size.width * 2))
											
											var padding = 0;
											var gridHeight = thisObj.grid.size.height;
											
											// Nonpermuted - ( current Permuted index + gutter )
											var offsetIndex = (nonPermutedMetricCount) - ( ( currentMetricIndex - nonPermutedMetricCount ) + ( (categoryIndex) ) );
											var offset = gridHeight * offsetIndex;
																						
											var y = (offset + topMargin + padding);
											return "translate(" + x + ", " + y + "), rotate(0)";
									})
									.attr("class", function(){return "block-"+metricName});
								}
							}
							thisObj.draw( draw );
							thisObj.draw( thisObj.colorBlocks , 1 );
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					hover: {
						value: function ( metricName , type , selector , row , datasetIndex ) {
							this.datasetIndex = datasetIndex;
							if( row ){
								this.draw( this.populateValues , row );
								this.draw( this.colorBlocks , row );
								this.boldLabels( metricName , type );
							
								if ( thisObj.mode == "heatmap-overview" ) {
									$().html();
								} 
							}
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					populateValues: {
						value: function ( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x ) {
							
							var svg = thisObj.svg.obj;
							if ( thisObj.mode == "heatmap-overview" ) {
								var dataset = thisObj.dataset[thisObj.datasetIndex].getData();
							} else {
								var dataset = thisObj.dataset.getData();
							}
							var data = dataset[selector];
							
							var rowClass = ".breakdown-holder-" + metricName ;
							var rowObj = svg.selectAll(rowClass);
					    	
							rowObj.text( function( ){ return Math.floor(data[ metricName ]); });
							var password = svg.selectAll(".original");
							password.text( function( ){ return data[ "originalPassword" ]; } );
							password = svg.selectAll(".permuted");
							password.text( function( ){ return data[ "permutedPassword" ]; } );
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					boldLabels: {
						value: function ( metricName , type ) {
							var thisObj = this;
							var svg = this.svg.obj;
							var columnClass = "." + metricName ;
							var svgObj = svg.selectAll(columnClass);
							var allObj = svg.selectAll("text");
							
							var labelClass = ".breakdownlabel-" + metricName;
							var labelObj = svg.selectAll(labelClass);
							if( type == "mouseover" ) {
								svgObj.attr("font-weight" , "900").style("fill", "#F00");
								var text = labelObj.text();
								labelObj.text(" ");
								labelObj.text(function(){
									return " ☞ " + text;
								});
							} else {
								svgObj.attr("font-weight" , "lighter").style("fill", "#000");;
								
								var text = labelObj.text();
								
								text = text.substring(3, text.length);
								labelObj.text(" ");
								labelObj.text(function(){
									return text;
								});
							}
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					colorBlocks: {
						value: function ( thisObj , gutterCount , metricIndex , metricName, currentMetricIndex , categoryIndex , nonPermutedMetricCount , selector , x ) {
							var svg = thisObj.svg.obj;
							if ( thisObj.mode == "heatmap-overview" ) {
								var dataset = thisObj.dataset[thisObj.datasetIndex].getData();
								var dataKey = thisObj.dataset[thisObj.datasetIndex].getName();
							} else {
								var dataset = thisObj.dataset.getData();
								var dataKey = thisObj.dataKey;
							}
							var data = dataset[selector];
							
							var rowClass = ".block-" + metricName ;
							var rowObj = svg.selectAll(rowClass);
					    	var colorScale = thisObj.metricSet.getNormalColorScale( metricName , dataKey , thisObj.visualizationKey );
							rowObj.style( "fill", function( d , i ){ return colorScale( data[ metricName ]) });
							rowClass = "." + metricName ;
							rowObj = svg.selectAll(rowClass);
							rowObj.attr()
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					filterPasswords: {
						value: function ( metricName, values ) {
						    for(var i = 0; i < this.connectedTiers.length; i++){
						    	if( this.connectedTiers[i].filterPasswords ) {
						    		this.connectedTiers[i].filterPasswords( metricName, values );
						    	}
						    }
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					sortPasswords: {
						value: function ( metricName ) {
							if(this.mode == "heatmap-overview"){
								for(var i = 0; i < (this.dataset.length); i++){
									this.dataset[i].sortData( metricName );
								}
							} else {
								this.dataset.sortData( metricName );
							}
									
							// Color blocks for connected tiers
						    for(var i = 0; i < this.connectedTiers.length; i++){
						    	if( this.connectedTiers[i].visualize ) {
						    		this.connectedTiers[i].visualize();
						    		console.log("visualize " + i);
						    	}
						    }
							
						},
						enumerable: true,
					    configurable: true, 
					    writable: true	
					},
					hideColumns: {
						value: function ( metricName ) {

								
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					triggerHideData: {
						value: function ( dataIndex ) {
							console.log("triggerHideData")
							console.log( dataIndex )
							for(var i = 0; i < this.connectedTiers.length; i++){
						    	if( this.connectedTiers[i].brushData ) {
						    		this.connectedTiers[i].brushData( dataIndex );
						    	}
						    }
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					triggerHideColumns: {
						value: function ( metricName ) {
							var thisObj = this,
							visible;
							if( this.metricSet.isVisible (metricName ,  this.dataKey , this.visualizationKey ) ){
								visible = false;
							} else {
								visible = true;
							}
							thisObj.metricSet.setVisibility( metricName , this.dataKey , this.visualizationKey  , visible );
							thisObj.hideColumns( metricName );
							// Color blocks for connected tiers
						    for(var i = 0; i < thisObj.connectedTiers.length; i++){
						    	if( thisObj.connectedTiers[i].hideColumns ) {
						    		thisObj.connectedTiers[i].hideColumns( metricName );
						    	}
						    }
								
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					updateSmoothness: {
						value: function ( value ) {
							// Color blocks for connected tiers
						    for(var i = 0; i < this.connectedTiers.length; i++){
						    	if( this.connectedTiers[i].updateSmoothness ) {
						    		this.connectedTiers[i].updateSmoothness( value );
						    	}
						    }
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					updateBundling: {
						value: function ( value ) {
							// Color blocks for connected tiers
						    for(var i = 0; i < this.connectedTiers.length; i++){
						    	if( this.connectedTiers[i].updateBundling ) {
						    		this.connectedTiers[i].updateBundling( value );
						    	}
						    }
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					bundleBy: {
						value: function ( metricName ) {
							// Color blocks for connected tiers
						    for(var i = 0; i < this.connectedTiers.length; i++){
						    	if( this.connectedTiers[i].bundleBy ) {
						    		this.connectedTiers[i].bundleBy( metricName );
						    	}
						    }
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					},
					colorBy: {
						value: function ( metricName ) {
							// Color blocks for connected tiers
						    for(var i = 0; i < this.connectedTiers.length; i++){
						    	if( this.connectedTiers[i].colorBy ) {
						    		this.connectedTiers[i].colorBy( metricName );
						    	}
						    }
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					}
				} ); 
				Controls.prototype.constructor = Controls;
				var types = {
					"HeatmapTier1": HeatmapTier1,	 
					"HeatmapTier2": HeatmapTier2, 
					"Controls": Controls,
					"Parcoords": Parcoords 
				};

				/** Create visualization tier (module) */
				var create = function( type , dataKey , key , dataset , visualizationKey , metricSet , parentKey , mode ){
					if( types[type] ){
						var tier = types[type];						
						if( mode ) {
							return new tier(type , dataKey , key , dataset , visualizationKey , metricSet , parentKey , mode );
						} else {
							return new tier(type , dataKey , key , dataset , visualizationKey , metricSet , parentKey );
						}
					
					}
					
				};
			
				return {
					create: create
				};
			 
			})();

			/* Public Methods */
			/** Create visualization instance */
			var create = function( dataKey , visualizationKey , dataset, config , metricSet ){
				return new VisualizationInstance( dataKey , visualizationKey , dataset , config , metricSet );
			};
			return {
				create: create
			};
		})();
		/** Templates for metric operations */
		var metric = ( function(){
			
			/* Private Methods */
			// Holds metric type data
			// Defined in USV-constants file
			// USV.constants.metric
			var METRIC_PROP = constants.metric;
			
			/** Class MetricSet: Holds a set of metrics and associated specifications for all metrics. */
			var MetricSet = function(  ){
				this.metrics = {};
				this.metricList = [];
				this.categories = [];
				this.orderedMetricsList; // All metrics in symmetrical order
				this.orderedPairedMetricsList; // All metrics with pairs in symmetrical order
				this.singleMetricsList; // All singleton metrics ( not ordered )
				this.count = {};
				var init = function (thisObj) {
					thisObj.categories[ "uncategorized" ] = new Category ( "uncategorized" );
				};
				init(this);
			};
			MetricSet.prototype = {
				addMetric: function ( type ) {
					thisObj = this;
					// Check if metric exists 
					if ( !this.metrics[ type ] ) {
						
						// Create metric
						var thisMetric = this.metrics[ type ] = new MetricInstance( type );
						thisObj.metricList.push( thisMetric );
						// If has category type, add to that category
						if ( thisMetric.category && thisMetric.category.name ) {
							
							// Create a category, if doesn't exist
							if( !thisObj.categories[ thisMetric.category.name ] ){
								thisObj.categories[ thisMetric.category.name ] = new Category( thisMetric.category.name , thisMetric.permuted );
							}
							// Add metric to that category
							thisObj.categories[ thisMetric.category.name ].add( thisMetric );
						// Add to "uncategorized" 
						} else {
							console.log("uncategorized")
							thisObj.categories[ "uncategorized" ].add( thisMetric );
						}
					}
				},
				// Set domain for all metrics
				setDomains: function ( dataset , dataLocation ) {
					thisObj = this;
					for( var prop in thisObj.metrics ){
						// Set domain for specific dataset
						thisObj.metrics[ prop ].setDomain( dataset , dataLocation );
					}
				},
				setDefaultVisibility: function ( key , visualizationKey , mode) {
					var thisObj = this;
					for( var prop in thisObj.metrics ){
						// Set domain for specific dataset
						thisObj.metrics[ prop ].setVisibility( key , visualizationKey , true );
					}
					if( !mode && mode != "parcoords" && visualizationKey != "parcoords-overview" ){
						thisObj.setCategoryVisibility( "lpd" , key , visualizationKey , false );
						thisObj.setCategoryVisibility( "passwordStructure" , key , visualizationKey , false );
						thisObj.setCategoryVisibility( "entropySummary" , key , visualizationKey , false );
						thisObj.setCategoryVisibility( "Dataset" , key , visualizationKey , false );
						thisObj.setVisibility( "lpd" , key , visualizationKey , true );
						thisObj.setVisibility( "newlpd" , key , visualizationKey , true );
					}
					
				},
				setCategoryVisibility: function ( categoryName , key , visualizationKey , visible ) {
					var thisObj = this;
					if( thisObj.categories[ categoryName ] ){
						var category = thisObj.categories[ categoryName ];
						for( var prop in category.metrics ){
							// Set domain for specific dataset
							category.metrics[ prop ].setVisibility( key , visualizationKey , visible );
							
						}
					}
					
				},
				hasMetric: function ( type ) {
					
					if(this.metrics[ type ]){
					
						return true;
					
					}
					return false;
					
				},
				getExtent: function ( key , visualizationKey , type  ){
					return this.metrics[ type ].getDomain( key , visualizationKey );
				},
				getCount: function ( key , visualizationKey, type ) {
					if( visualizationKey == "global" || visualizationKey == "parcoords-overview" ) {
						if( this.count[ visualizationKey ] ) {
							if( type == "visible" ){
								return this.count[ visualizationKey ].visible;
							} else {
		
								return this.count[ visualizationKey ].total;
							}
							
						}
					} else {
						if( this.count[ key ][ visualizationKey ] ) {
							if( type == "visible" ){
								return this.count[ key ][ visualizationKey ].visible;
							} else {
		
								return this.count[ key ][ visualizationKey ].total;
							}
							
						}
						
					}

					console.log("Count for " + visualizationKey + ", " + type + " not set.")
				},
				changeCount: function ( key , visualizationKey , type , increase ) {
					
					if( increase ) {
						var increment = 1;
					} else {
						var increment = -1;
					}
					if( this.count[ key ][ visualizationKey ] ) {
						if( type == "visible" ){
							this.count[ key ][ visualizationKey ].visible += increment;
						} else {
	
							this.count[ key ][ visualizationKey ].total += increment;
						}
						
					}

					
				},
				getOrderedMetrics: function ( key , visualizationKey ) {
					this.orderCategories( key , visualizationKey );
					return this.orderedMetricsList;
				},
				getOrderedPairedMetrics: function ( key , visualizationKey ) {
					this.orderCategories( key , visualizationKey );
					return this.orderedPairedMetricsList;
				},
				getSingleMetrics: function ( key , visualizationKey ) {
					this.orderCategories( key , visualizationKey );
					return this.singleMetricsList;
				},
				orderCategories: function ( key , visualizationKey ) {
					
					var categoryArray = []; // Used for sorting categories by size
					var categoriesToBeAdded = []; // Holds categories that don't have permuted pairs
					this.orderedCategories = []; // Ordered metric array
					this.orderedMetricsList = [];
					this.orderedPairedMetricsList = [];
					this.singleMetricsList = [];
					if( !this.count[key] ){
						this.count[key] = {};
					}
						
					var totalCount = 0;
					var visibleCount = 0;
					// Add categories to an array to be sorted
					for(var prop in this.categories){
						categoryArray.push( [ prop , this.categories[ prop ] ] );
					}
					// Sort categories from smallest to largest
					categoryArray.sort(function(a, b){
						var a = a[1];
						var b = b[1];
						return a.metricOrder.length - b.metricOrder.length;
					});
					// Start with the largest category and add to the array
					// Add metrics with permuted pairs first
					// Original metrics
					for( var i = categoryArray.length - 1; i > 0 ; i-- ) {
						// Add original 
						if( categoryArray[i][1].isPermuted ){
							var obj = categoryArray[i][1];
							var metricArray = [];
							
							for(var j = 0; j < obj.metricsOriginal.length; j++){
								if(obj.metrics[ obj.metricOrder[ j ] ].dataType != "String"){
									metricArray.push( obj.metricsOriginal[ j ] );
									this.orderedMetricsList.push( obj.metricsOriginal[ j ] );
									this.orderedPairedMetricsList.push( obj.metricsOriginal[ j ] );
									totalCount++;
									if( obj.metrics[ obj.metricOrder[ j ] ].isVisible( key , visualizationKey ) ){
										visibleCount++;
									}
								}
							}
							// Add category
							this.orderedCategories.push( {name: obj.name, metrics: metricArray } );
						} else {
							categoriesToBeAdded.push( categoryArray[i] );
						}
				
					}
					// Add metrics without permuted pairs
					for( var i = 0; i < categoriesToBeAdded.length; i++ ) {
						if(!categoriesToBeAdded[i][1].allString){
							// Add metrics
							var obj = categoriesToBeAdded[i][1];
							var metricArray = [];
							for(var j = 0; j < obj.metricOrder.length; j++){
								if(obj.metrics[ obj.metricOrder[ j ] ].dataType != "String"){
									
									metricArray.push( obj.metricOrder[ j ] );
									this.orderedMetricsList.push( obj.metricOrder[ j ] );
									this.singleMetricsList.push( obj.metricOrder[ j ] );
									totalCount++;
									if( obj.metrics[ obj.metricOrder[ j ] ].isVisible( key , visualizationKey ) ){
										visibleCount++;
									}
								}
							}
							// Add category
							this.orderedCategories.push( {name: obj.name, metrics: metricArray } ); 
						}
					
					}
					// Add metrics with permuted pairs again
					// Permuted metrics
					for( var i = 0; i < categoryArray.length ; i++ ) {
						
						// Add permuted 
						if( categoryArray[i][1].isPermuted ){
							var obj = categoryArray[i][1];
							var metricArray = [];
							for(var j = obj.metricsPermuted.length-1; j > -1 ; j--){
								if(obj.metrics[ obj.metricOrder[ j ] ].dataType != "String"){
									metricArray.push( obj.metricsPermuted[ j ] );
									this.orderedMetricsList.push( obj.metricsPermuted[ j ] );
									this.orderedPairedMetricsList.push( obj.metricsPermuted[ j ] );
									totalCount++;
									if( obj.metrics[ obj.metricOrder[ j ] ].isVisible( key , visualizationKey ) ){
										visibleCount++;
									}
								}
							}
							// Add category
							this.orderedCategories.push( {name: obj.name, metrics: metricArray } ); 
						}
					}
					
					if( visualizationKey == "global" ){
						this.count[visualizationKey] = {
							visible: visibleCount,
							total: totalCount
						};
					} else {
						this.count[key][visualizationKey] = {
							visible: visibleCount,
							total: totalCount
						};
					}
					return this.orderedCategories;
			
				},
				isString: function ( type ) {
					if( this.metrics[ type ][ "dataType" ] == "String") {
						return true;
					} else {
						return false;
					}
				},
				isPermuted: function ( type ) {
					if( this.metrics[ type ].permuted ) {
						return true;
					} else {
						return false;
					}
				},
				setColorScheme: function ( dataKey, visualizationKey , colorscheme ) {
					
					for( var prop in this.metrics ){	
						this.metrics[ prop ].setColorScheme( dataKey , visualizationKey , colorscheme );
					}
				},
				getNormalColorScale: function ( metricName , dataKey , visualizationKey ) {
					return this.metrics[ metricName ].getNormalColorScale( dataKey , visualizationKey );
				},
				getHighlightColorScale: function ( metricName , dataKey , visualizationKey ) {
					return this.metrics[ metricName ].getHighlightColorScale( dataKey , visualizationKey );
				},
				getZscoreColorScale: function ( metricName , dataKey , visualizationKey ) {
					return this.metrics[ metricName ].getZscoreColorScale( dataKey , visualizationKey );
				},
				setVisibility: function ( metricName , dataKey , visualizationKey , visible ) {
					this.metrics[ metricName ].setVisibility( dataKey , visualizationKey , visible );
					if(!this.count[ dataKey ]){
						this.orderCategories( dataKey , visualizationKey );
					}
					this.changeCount( dataKey , visualizationKey , "visible" , visible );
				},
				isVisible: function ( metricName , dataKey , visualizationKey ) {
					
					return this.metrics[ metricName ].isVisible( dataKey , visualizationKey );
				}
			};
			/** Categories of metric types */
			var Category = function ( name , permuted ) {
				this.name =  name;
				this.metrics = {};
				this.metricOrder = [];
				this.metricsOriginal = [];
				this.metricsPermuted = [];
				if( permuted ){
					this.isPermuted = true;
				} else {
					this.isPermuted = false;
				}
			} 
			Category.prototype = {
				add: function ( metric ) {
					thisObj = this;
					// Add metric to global list
					thisObj.metrics[ metric.key ] = metric;
					if ( metric.permuted && (metric.category.index || metric.category.index == 0) ) {
						if( metric.permuted.type === "original" ){
							
							// insert into original
							thisObj.metricsOriginal[ metric.category.index ] = metric.key;
						
						} else {
							// insert into permuted
							thisObj.metricsPermuted[ metric.category.index ] = metric.key;
						}
					
					} 
						
					if(metric.category && METRIC_PROP.CATEGORY_TYPES[metric.category.name] && METRIC_PROP.CATEGORY_TYPES[metric.category.name].allString == true ){
						thisObj.allString = true;
					} else {
						thisObj.allString = false;
					}
					
					var lastPosition = this.metricOrder.length;
					this.metricOrder[ lastPosition ] = metric.key;
				}
			};
			// Class MetricInstance
			// Holds a metric and associated specifications for that metric.
			var MetricInstance = function( type ){
				if( type ){
					
					this.label;
					this.dataType;
					this.domainType;
					this.visualizationType = {};
					this.domainVal = {
						global: {}
					};
					this.key = type;
					this.colorScale = {
						global: {}
					};
					this.visible = {
						global: {}
					}
					var rPermuted = /(new)/g;
					var label = ""; // Holds "new" if metric identified as permuted
					var permutedData = {
						type: "original"
					};
					if ( type.match( rPermuted 	) ) {
				
							type = type.replace(rPermuted, "");
							label = "New ";
							permutedData = {
								type: "permuted"
							}
				
					}
					
					// If metric type exists in USV.constants
					if( METRIC_PROP.METRIC_TYPES[ type ]) {
						for( var prop in METRIC_PROP.METRIC_TYPES[ type ] ){
							// Insert "new" if label
							if( prop == "label" ){
								this[ prop ] = label + METRIC_PROP.METRIC_TYPES[ type ][ prop ];
							} else {
								this[ prop ] = METRIC_PROP.METRIC_TYPES[ type ][ prop ];
							}
							
						}
						if ( this.permuted ) {
							this.permuted = permutedData;
						}
					} else {
						// Default metric settings
						this.label = this.key; // Name of the metric, for putting into arrays, etc.
						this.dataType = "String"
						// Standard maximum and minimum values for this metric
						this.domainType = METRIC_PROP.DOMAIN_TYPES.MIN_MAX;
					}
					// Determine if can be visualized by a grid
					if( this.dataType == "String" ) {
						this.visualizationType.grid = false; // Cannot be visualized by a grid
					} else {
						this.visualizationType.grid = true;
					}
				} else {
					console.log("Error: MetricInstance constructor missing type name. ")
				}
			};
			MetricInstance.prototype = {
				setDomain: function ( data , dataLocation ) {
					var thisObj = this; // The current Metric Instance
					var dataset = data.getData();
					this.domainVal[ dataLocation ] = {}; // Stores max and min for the current dataset
					// If domain type not null (meaning it's not a string), set the domain values
					if ( thisObj.domainType ) {
						// Min needs to be calculated
						if ( thisObj.domainType.min === "min" ) {
							// Find and store minimum for current dataset
							var newDataMin = d3.min( dataset , function (d) { return d[ thisObj.key ]; });
							// Check if it has an altered pair
							if(thisObj.permuted) {
								if (thisObj.permuted.type == "original"){
									var pairName = "new" + thisObj.key,
									pairMin = d3.min( dataset , function (d) { return d[ pairName ]; });
								} else {
									var rPermuted = /(new)/g,
									pairName = thisObj.key;
									pairName = pairName.replace(rPermuted, "");
									var pairMin = d3.min( dataset , function (d) { return d[ pairName ]; });
								}
								newDataMin = d3.min([ pairMin , newDataMin ]);
							}
							thisObj.domainVal[ dataLocation ].min = newDataMin;
							// Compare with existing global minimum and store result
							thisObj.domainVal.global.min = d3.min([ newDataMin, thisObj.domainVal.global.min]);
						// There is the same min for all datasets
						} else {
							// Set the min for this dataset
							this.domainVal[ dataLocation ].min = this.domainType.min;
							
							// Initialize global min
							if(!this.domainVal.global.min) {
							
								this.domainVal.global.min = this.domainType.min;
							
							}
							
						}
						// Max needs to be calculated
						if ( this.domainType.max === "max" ) {
							
							// Find and store maximum for current dataset
							var newDataMax = d3.max( dataset , function (d) { return d[ thisObj.key ]; });
							this.domainVal[ dataLocation ].max = newDataMax;
							// Check if it has an altered pair
							if(thisObj.permuted) {
								if (thisObj.permuted.type == "original"){
									var pairName = "new" + thisObj.key;
									var pairMax = d3.max( dataset , function (d) { return d[ pairName ]; });
								} else {
									var rPermuted = /(new)/g;
									var pairName = thisObj.key;
									pairName = pairName.replace(rPermuted, "");
									var pairMax = d3.max( dataset , function (d) { return d[ pairName ]; });
								}
								newDataMax = d3.max([ pairMax , newDataMax ]);
							}
							thisObj.domainVal[ dataLocation ].max = newDataMax;
							// Compare with existing global maximum and store result
							this.domainVal.global.max = d3.max([ newDataMax, thisObj.domainVal.global.max]);
						// There is the same max for all datasets
						} else {
							
							// Set the max for this dataset
							this.domainVal[ dataLocation ].max = this.domainType.max;
							
							// Initialize global max
							if(!this.domainVal.global.max) {
							
								this.domainVal.global.max = this.domainType.max;
							
							}
					
						}
					}
				},
				getDomain:function ( key , visualizationKey ) {					
					if( visualizationKey == "global" ){
						var min =  this.domainVal.global.min;
						var max =  this.domainVal.global.max;
					} else {
						var min =  this.domainVal[ key ].min;
						var max =  this.domainVal[ key ].max;
					}
					return [min, max];
				},
				setColorScheme: function ( key , visualizationKey , colorscheme ) { 
					var thisObj = this;
					
					// return color function based on plot and dimension
					function zcolor(col, dimension) {
					  var z = zscore(_(col).pluck(dimension).map(parseFloat))
					  return function(d) { return zcolorscale(z(d[dimension])) }
					};
					// color by zscore
					function zscore(col) {
					  var n = col.length,
					      mean = _(col).mean(),
					      sigma = _(col).stdDeviation();
					  return function(d) {
					    return (d-mean)/sigma;
					  };
					};
					if ( thisObj.domainType ) {	
						if( visualizationKey == "global" ){
							var min =  thisObj.domainVal.global.min,
								max =  thisObj.domainVal.global.max,
								mid = 0,
		 						domain = [min, max];
		 					if(max > min){
		 						mid = ( max - min ) / 2; 
		 					} else {
		 						mid = min;
		 					}
		
							if( !this.colorScale[ "global" ] ){
								this.colorScale[ "global" ] = {};
							}
							this.colorScale[ "global" ].normal = d3.scale.linear()
								.domain(domain)
								.range(colorscheme.normal).interpolate(d3.interpolateRgb);
							this.colorScale[ "global" ].highlight = d3.scale.linear()
								.domain(domain)
								.range(colorscheme.highlight).interpolate(d3.interpolateRgb);
							
							domain = [ min, mid, max ];
							this.colorScale[ "global" ].zscore = d3.scale.linear()
								.domain([-2,-0.5,0.5,2])
								.range(["blue", "#666", "#666", "red"]).interpolate(d3.interpolateLab);
						} else {
							var min =  thisObj.domainVal[ key ].min;
							var max =  thisObj.domainVal[ key ].max;
							var mid = 0;
							if(max > min){
		 						mid = ( max - min ) / 2; 
		 					} else {
		 						mid = min;
		 					}
		 					var domain = [min, max];
		
							if( !this.colorScale[ key ] ){
								this.colorScale[ key ] = {};
							}
							if( !this.colorScale[ key ][ visualizationKey ] ){
								this.colorScale[ key ][ visualizationKey ] = {};
							}
		
							this.colorScale[ key ][ visualizationKey ].normal = d3.scale.linear()
								.domain(domain)
								.range(colorscheme.normal).interpolate(d3.interpolateRgb);
							this.colorScale[ key ][ visualizationKey ].highlight = d3.scale.linear()
								.domain(domain)
								.range(colorscheme.highlight).interpolate(d3.interpolateRgb);
							domain = [ min, mid, max ];
							this.colorScale[ key ][ visualizationKey ].zscore = d3.scale.linear()
								.domain([-2,-0.5,0.5,2])
								.range(["blue", "#666", "#666", "red"]).interpolate(d3.interpolateLab);
						}
					}
				},
				getNormalColorScale: function ( key , visualizationKey ) {
					if( visualizationKey == "global" ){
						return this.colorScale[ "global" ].normal;
					} else {
						return this.colorScale[ key ][ visualizationKey ].normal;
					}
				},
				getHighlightColorScale: function ( key , visualizationKey ) {
					if( visualizationKey == "global" ){
						return this.colorScale[ "global" ].highlight;
					} else {
						return this.colorScale[ key ][ visualizationKey ].highlight;
					}
				},
				getZscoreColorScale: function ( key , visualizationKey ) {
					var zcolorscale = {};
					if( visualizationKey == "global" ){
						return this.colorScale[ "global" ].zscore;
					} else {
						return this.colorScale[ key ][ visualizationKey ].zscore;
					}
				},
				setVisibility: function ( key , visualizationKey , visiblility ) {
					if( visualizationKey == "global" ) {
						if( !this.visible[ visualizationKey ] ){
							this.visible[ visualizationKey ] = {};
						}							
						
						this.visible[ visualizationKey ] = visiblility;
					} else {
						if( !this.visible[ key ] ){
							this.visible[ key ] = {};
						}							
						
						this.visible[ key ][ visualizationKey ] = visiblility;
					}
				},
				isVisible: function ( key , visualizationKey ) {
					if( visualizationKey == "global" ) {
						return this.visible[ visualizationKey ];
					} else {
						return this.visible[ key ][ visualizationKey ];
					}
					
				}
			}
			
			/* Public Methods */
			// Create metric and return it
			var createSet = function( ){
				return new MetricSet( );
			};
			return {
				createSet: createSet
			};
		})();
		/** GUI operations for the environment */
		var gui = ( function(){
			
			/* Private Methods */
			// HTML to be loaded
			var EXTERNAL_HTML = {
				initialize: "html/visualizations-holder.html"
			}
			var activeType = "heatmap"; // Current viz type selected on the visualization navbar
			var activeData = ""; // Current dataset being displayed

			/* Public Methods */
			var initialize = function ( callback , thisObj , fileLocation ) { 
				// Load external html: Navigation, main 
				$("#USV-visualization").load(EXTERNAL_HTML.initialize, function done () {
					var navHeight = $('#navbar-main').outerHeight() * 2, // Calculate navbar height
						vizHeight = $('body').outerHeight() - navHeight; // Calculate how tall the visualization should be
					// Adjust height of visualization container to maximum height
					$("#vizualizations-holder, #vizualizations-holder-container").css("height", vizHeight);
					$("#loadingScreen").hide(); // Hide loading screen div
					callback( thisObj , fileLocation );
					$('.vis-type').on('click', function(e){
						activeType = $(e.target).attr("id");
						showVisualization( activeData );
					});
				});
			};
			/** Add another visualization item to the navbar.  */
			var addVisualization = function ( visualizationKey ) {
				var name = "view-" + visualizationKey;
				if(visualizationKey == "heatmap-overview" || visualizationKey == "parcoords-overview"){
					if(visualizationKey == "heatmap-overview"){
						$('#navbar-displayed-visualization').prepend('<li><a class="overview" id="' + name + '" href="' + name + '">All</a></li>');
					}
				} else {
					$('#navbar-displayed-visualization').prepend('<li><a class="' + visualizationKey + '" id="' + name + '" href="' + name + '">' + visualizationKey + '</a></li>');
				}
				
				name = "#" + name;
				$( name ).on("click", function(e){
					e.preventDefault();
					var visualizationKey = $(e.target).attr("class");
					activeData = visualizationKey;
					showVisualization( visualizationKey );
				});
			};
			/** Hide all visualizations except for the passed visualizationKey */
			var showVisualization = function ( visualizationKey ) {
					activeData = visualizationKey;
					$('.visualization-instance').fadeOut({
						duration: 0,
						done: function() {
							// Get which viz is visible
							var key = activeType + "-" + visualizationKey;
							var classnameShow = "#" + key + "-container";
							$(classnameShow).fadeIn("slow");
						}
					});
					$('#navbar-displayed-visualization-name').html( visualizationKey );
				// }
				
			};
			/**  Show all visualizations */
			var showAllOverviewVisualizations = function ( callback ) {
				var visualizations = $('.visualization-instance');
				console.log(visualizations);
				if( visualizations.length > 0 ){
					var i = 0;
					$.when($('.visualization-instance').show()).done(function(){
						callback();
					});
				} else {
					callback();
				}
			};
			return {
				initialize: initialize,
				addVisualization: addVisualization,
				showVisualization: showVisualization,
				showAllOverviewVisualizations: showAllOverviewVisualizations
			};
		})();
		// Public methods
		return {
			
			create: create, // Create environment
			metric: metric // Components of an environment
		};
	})();
	/** GUI operations for the webpage at large */
	this.gui = (function(){
		
		var EXTERNAL_HTML = {
			header: "html/header.html",
			upload: "html/upload.html",
			uploadSuccess: "html/upload-success.html"
		};
		// Show successful upload alert
		var successUpload = function () {
			$("#USV-information-upload").load(EXTERNAL_HTML.uploadSuccess, function done () {
				$("#USV-information-upload").delay(1500).fadeOut("slow");
			});
		}
		// Show upload module
		var showUpload = function ( ) {
			$("#USV-information-upload").load(EXTERNAL_HTML.upload, function done () {
				$("#USV-information-upload").hide();
				$('.csvData-btn :file').on('fileselect', function(event, numFiles, label) {
			        $('.csvData-label').html(label);
			        $("#USV-upload-submit").removeAttr("disabled");
			    });
			    $(document).on('change', '.btn-file :file', function() {
				    var input = $(this),
				        numFiles = input.get(0).files ? input.get(0).files.length : 1,
				        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
				    input.trigger('fileselect', [numFiles, label]);
				});
				$("#USV-information-upload").delay( 0 ).slideDown("slow");
			});
			return false;
		};
		
		// Initialize the GUI0
		var initialize = function ( callback ) {
			$("#USV-body").load(EXTERNAL_HTML.header, function done () {
				showUpload();
				callback();
			});

		};
		return {
			initialize: initialize,
			successUpload: successUpload,
			showUpload: showUpload
		}
	})( );
	/** Upload operations */
	this.upload = function ( event ) {
		event.preventDefault(); // Prevent page from reloading
		var thisObj = this,
			form = document.getElementById('USV-csv-file-select'),
			file = form.files[0],
			name = file.name,
			URL = "",
			reader  = new FileReader();
			
		reader.onloadend = function (event) {
			data = event.target.result;
			thisObj.gui.successUpload();
			if(showExample){
				currentEnvironment.clear();
				showExample = false;
			}
			
			var rReplace = /\.csv/g;
			name = name.replace(rReplace, "");
			currentEnvironment.parseData( name , data );
		}
		if (file) {
			reader.readAsText(file);
		}
		return false;
	}
	
	/** Create environment and load example data visualization */
	this.init = function () {
		var createVisualization = function () {
			showExample = true;
			currentEnvironment = environment.create();
		};
		this.gui.initialize( createVisualization );
	};
}).apply( USV );
$( document ).ready( function(){
	USV.init();
});



	
