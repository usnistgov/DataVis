/*


*/
USG.visualization = {};
(function(){
	// environment
	this.environment = ( function(){
		
		/* Private Methods */
		
		// Class EnvironmentInstance
		// Holds a dataset and associated visualizations for that dataset.
		var EnvironmentInstance = function( callback ){
			
			this.datasets = [];
			this.metrics = [];
			this.visualizations = [];

			gui.initialize( callback );

		};
		EnvironmentInstance.prototype = {
			
			// Adds a HeatmapSet visualization to the environment
			addHeatmapSet: function ( dataLocation, config ){

				if( this.datasets[ dataLocation ] ){

					var visualizationKey = "heatmap-" + dataLocation;
					this.visualizations[visualizationKey] = heatmap.create( visualizationKey, this.datasets[ dataLocation ], "default" );


				} else {
					console.log("No data found. Try loading " + dataLocation + " using environment.loadData( \"fileLocation\" )")
				}
				
			},

			// Loads a .csv file into the visualization. Creates metric objects used in the visualization
			// @param: 
			// 		dataLocation - String. Url of releative location of csv file
			// 		callback - function(). Optional. 
			loadData: function( dataLocation, callback ){
				
				var thisObj = this;
				var thisNamespace = USG.visualization.environment; 
				var dataset = thisObj.dataset;
				
				d3.csv( dataLocation , function parseRows ( d ) {
					
					// For each property in a row ( d ) 
		        	for ( var prop in d ) {
		        			
		            		if ( !( thisObj.metrics[ prop ] ) ) {
								
								// Create relevant metric objs
			            		thisObj.metrics[ prop ] = thisNamespace.metric.createMetric( prop );
			            		
			            		// if datatype is not a string
			            		if ( thisObj.metrics[ prop ][ "dataType" ] !== "String") {
									d[ prop ] = +d[ prop ];
			            		} 
			         
		            		}
	
		            }

		            return d;

		        }, function done ( error, data ) {
					
		        	var rReplace = /\.csv/g;
					dataLocation = dataLocation.replace(rReplace, "");

					if ( data ) {
						console.log( "Metrics created:");
						console.log( thisObj.metrics );
						dataset = data;
						console.log( "Data Loaded:");
						console.log( data );
					}
					
					if ( error ){
						console.log( error );
					}

					// Add dataset
					thisObj.datasets[ dataLocation ] = data;

					// Initialize metric domains
					thisObj.setMetricDomains( dataLocation );
					callback();

				});
	
			}, 
			setMetricDomains: function ( dataLocation ) {
				thisObj = this;

				for( var prop in thisObj.metrics ){
					thisObj.metrics[ prop ].setDomain( thisObj.datasets[ dataLocation ] );
				}
			}
		};

		/* Public Methods */

		// Create and return environmentInstance
		var create = function( callback ){
			return new EnvironmentInstance( callback );
		};

		// environment.heatmap
		var heatmap = ( function(){
			var thisObj = this;

			/* Private Methods */
			// Class HeatmapSet
			// Holds a dataset and associated visualizations for that dataset
			var HeatmapSet = function ( key, dataset , config ){
				// Properties
				//
				this.key = key;
				this.hiddenSelections; // which passwords are hidden currentSelections
				this.tiers;
				var thisObj = this;

				var addHTML = function( tierHTML ) {
						var html = ('<div class="col-sm-12"><div class ="row heatmap" id=' + thisObj.key + '>' + tierHTML + '</div></div>');
						
						// Append a container for the heatmap
						$( "#vizualizations-holder" ).append( html );
				};
				
				// default config
				if( config == "default" ){
					console.log("Create heatmap with default config");



					// Create new tier1, tier2, tier3
					thisObj.tiers = [];
					var defTiersCreated = $.Deferred();

					for (var i = 0; i < 3; i++) {
						// Will append html to the heatmap container
						thisObj.tiers[i] = tier.create( thisObj.key, ( i+1 ) , dataset , thisObj.key );
					}

					defTiersCreated.resolve(thisObj.tiers);

					defTiersCreated.done(function(tiers){

						$.when( tiers[0].loadHTML() , tiers[1].loadHTML() , tiers[2].loadHTML() ).done(function () {
							console.log(tiers);
							var tierHTML = tiers[1].html + '' + tiers[0].html + '' + tiers[2].html;

							addHTML( tierHTML );
							tiers[0].visualize();
						}); 

					});
					
				}

				

			};

			/* Public Methods */
			// Create and return HeatmapSet
			var create = function( key, dataset, config ){
				// Create HeatmapSet and return it
				return new HeatmapSet( key, dataset , config );
			};


			// environment.heatmap.gui
			var gui = ( function(){
				var EXTERNAL_HTML = {
					heatmapHolder: "html/heatmap.html"
				}


				return {
					EXTERNAL_HTML: EXTERNAL_HTML
				};
			})();

			// environment.heatmap.tiers
			var tier = ( function(){

				/* Private Methods */

				// GUI properties
				var gui = ( function(){
					var EXTERNAL_HTML = {
						1: "html/tier1.html", 
						2: "html/tier2.html",
						3: "html/tier3.html"
					}


					return {
						EXTERNAL_HTML: EXTERNAL_HTML
					};
				})();


				// Generic tier
				// Generic version of heatmap grid.
				var GenericTier = function( key, dataset , htmlElem ){
					this.key = key;
					this.dataset = dataset;
					this.htmlParentContainer = htmlElem;
					this.htmlElem;

					
					this.html = "";

					// Default to tier 1 data
					this.type = 1; // type of tier
					this.rId = /id=\"heatmap-tier1\"/g; // id 
					this.rReplace = "id=\"tier1-";
					
					console.log(htmlElem);

				};
				GenericTier.prototype = {
					// Loads html into this.html. Returns deferred promise object.
					loadHTML: function () {
						var deferred = $.Deferred(); // Create deferred object
						var thisObj = this; 

						// Load HTML
						var request = $.ajax({
							url: gui.EXTERNAL_HTML[this.type],
							dataType: 'html'
						});

						// Process loaded HTML
						$.when(request).done(function(data){
							// Add specialized id for this tier
							console.log(thisObj.htmlParentContainer);
							var rReplace = thisObj.rReplace + (thisObj.htmlParentContainer) + "\""; 
							data = data.replace(thisObj.rId, rReplace);
							
							thisObj.html = data;
							thisObj.htmlElem = "tier1-" + thisObj.htmlParentContainer;
							deferred.resolve(); 
						});
							
						return deferred.promise();
					}
				};

				// Specialized tiers
				//// Small view, sidebar
				var Tier1 = function ( key , dataset , htmlElem  ) {
					GenericTier.call( this , key , dataset , htmlElem );
					this.type = 1;
					this.rId = /id=\"heatmap-tier1\"/g;
					this.rReplace = "id=\"tier1-";
				};
				Tier1.prototype = Object.create( GenericTier.prototype, {
					visualize: {
						value: function () {
							var SVGname = "#" + this.htmlElem;

							// SVG
							this.svg = d3.select(SVGname).append("svg");

							// Nodes
						},
						enumerable: true,
					    configurable: true, 
					    writable: true
					}
				}); 
				Tier1.prototype.constructor = Tier1;

				//// Medium view, scrollable
				var Tier2 = function ( key, dataset , htmlElem  ) {
					GenericTier.call(this, key , dataset , htmlElem );
					this.type = 2;
					this.rId = /id=\"heatmap-tier2\"/g;
					this.rReplace = "id=\"tier2-";
				};
				Tier2.prototype = Object.create( GenericTier.prototype); 
				Tier2.prototype.constructor = Tier2;

				//// Close up view  
				var Tier3 = function ( key, dataset , htmlElem  ) {
					GenericTier.call(this, key , dataset , htmlElem );
					this.type = 3;
					this.rId = /id=\"heatmap-tier3\"/g;
					this.rReplace = "id=\"tier3-";

				};
				Tier3.prototype = Object.create( GenericTier.prototype ); 
				Tier3.prototype.constructor = Tier3;

				var types = {
					1: Tier1,	 
					2: Tier2, 
					3: Tier3
				};

				/* Public Methods */
				var create = function( key, type , dataset, htmlElem ){
					if( types[type] ){

						var tierType = types[type];
						return new tierType( key, dataset , htmlElem );
					
					}
					
				};
			
				return {
					create: create
				};
			 
			})();


			return {
				create: create
			};

		})();

		// environment.metric
		var metric = ( function(){
			
			/* Private Methods */

			// Holds metric type data
			// Defined in USG-constants file
			// USG.constants.metric
			var METRIC_PROP = USG.constants.metric;

			// Class MetricInstance
			// Holds a metric and associated specifications for that metric.
			var MetricInstance = function( type ){
				if( type ){
					this.domainVal = {};
					this.key = type;

					var rPermuted = /(new).*/g;
					if ( type.match( rPermuted 	) ) {
							type = type.replace(rPermuted, "");
					}
					
					if( METRIC_PROP.METRIC_TYPES[ type ]) {

						for( var prop in METRIC_PROP.METRIC_TYPES[ type ] ){
							this[ prop ] = METRIC_PROP.METRIC_TYPES[ type ][ prop ];
						}

					} else {

						// Default metric settings
						this.steplabel = this.key; // Name of the metric, for putting into arrays, etc.
						this.dataType = "String"
						// Standard maximum and minimum values for this metric
						this.domainType = METRIC_PROP.DOMAIN_TYPES.MIN_MAX;
					}

				} else {
					console.log("Error: MetricInstance constructor missing type name. ")
				}
			};
			MetricInstance.prototype = {
				setDomain: function ( dataset ) {
					if ( this.domainType ) {

						if ( this.domainType.min === "min" ) {

							this.domainVal.min = d3.min( dataset , function (d) { return d[ this.key ]; });
						}
						if ( this.domainType.max === "max" ) {
	
							this.domainVal.min = d3.max( dataset , function (d) { return d[ this.key ]; });

						}

					}
				}
			}
			
			/* Public Methods */

			// Create metric and return it
			var createMetric = function( type ){

				return new MetricInstance( type );
			
			};

			return {
				createMetric: createMetric
			};
		})();

		var gui = ( function(){
			
			/* Private Methods */
			var EXTERNAL_HTML = {
				initialize: "html/visualizations-holder.html"
			}
			
			
			/* Public Methods */
			var initialize = function ( callback ) { 

				$("#USG-body").load(EXTERNAL_HTML.initialize, function done () {
					callback();
				});

			};
			

			return {
				initialize: initialize
			};
		})();

		// Public methods
		return {
			create: create,

			// Components of an environment
			metric: metric
		};
	
	})();
}).apply(USG.visualization);

$( document ).ready( function(){
	var environment;

	var printtoC = function(){
		environment.addHeatmapSet( "catCode-results-1thousand-2015-01-15" , "default" );
	};
	var loadData = function () {
		environment.loadData( "catCode-results-1thousand-2015-01-15.csv", printtoC );
	}

	environment = USG.visualization.environment.create( loadData , "#USG-body" );
});






	
