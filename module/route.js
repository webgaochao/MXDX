var home=require('./home.js');
var address=require('./address.js');
var city=require('./city.js');
var detail=require('./detail.js');
var routeConctrol={
	home:home,
	city:city,
	address:address,
	detail:detail,
	preSection:null,
	thisSection:null,
	cacheFlag:{},
	init:function(id){
		if(this.preSection===null){//是否第一次进行实例化
			this.preSection=this.city;
		}else{
			this.preSection=this.thisSection;
		}
		if(this[id]){//模块是否正确
			if(this.cacheFlag[id]===undefined){//是否有缓存
				this[id].init();
				this.cacheFlag[id]=true;
			}else{
				if(id=='address'||id=='detail'||id=='home'){
					this[id].init();
				}
			}
			this.thisSection=this[id];
		}else{//模块不正确则返回首页
			this.thisSection=this.city;	
		}
		this.preSection.leave();//模块的退出和进入
		this.thisSection.enter();
	}
}

module.exports=routeConctrol;