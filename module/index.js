var home=require('./home.js');
var address=require('./address.js');
var city=require('./city.js');
var detail=require('./detail.js');
var routeConctrol=require('./route.js');
var route=new Router({
	'/:page':function(page){
		routeConctrol.init(page)	
	}
})

route.init('city');
