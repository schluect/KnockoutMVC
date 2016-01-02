({
	"baseUrl":"../src",
	"paths":{		
		jquery: 'lib/jquery.min',
		knockout: 'lib/knockout',
		sammy: 'lib/sammy-latest.min',
		text: 'lib/text',
		utils: 'framework/utils',
		ApplicationViewModelHolder: 'framework/ApplicationViewModelHolder',
		BaseController: 'framework/basecontroller',
		RouteHandler: 'framework/routehandler/RouteHandler',
		RouteChangeHandler: 'framework/RouteChangeHandler',
		ControllerFactory: 'framework/ControllerFactory'	
	},
	"include": ["utils","ApplicationViewModelHolder","BaseController","RouteHandler","RouteChangeHandler","ControllerFactory"],
	"exclude": ["jquery","knockout","sammy","text"],
	"out": "../dist/knockout-mvc.js",
	"wrap": {
		"startFile": "wrap.start",
		"endFile": "wrap.end"
	},
	"optimize":"none"
})