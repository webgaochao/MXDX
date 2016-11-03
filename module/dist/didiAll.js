/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var home=__webpack_require__(1);
	var address=__webpack_require__(2);
	var city=__webpack_require__(3);
	var detail=__webpack_require__(4);
	var routeConctrol=__webpack_require__(5);
	var route=new Router({
		'/:page':function(page){
			routeConctrol.init(page)	
		}
	})

	route.init('city');


/***/ },
/* 1 */
/***/ function(module, exports) {

	var home={
		name:"home",
		Dom:$('#home'),
		init:function(){
			this.render();
			this.bindEvent();
		},
		getHash:function(type){
			if(location.hash.split('?')[1]){
				var datalist=location.hash.split('?')[1].split('&');
				for(i=0;i<datalist.length;i++){
					if(datalist[i].split('=')[0]==type){
						return datalist[i].split('=')[1];
						break;
					}
				}
			}else{
				return 1;
			}
		},
		bindEvent:function(){
			var jay=this;
			$('.home_address').click(function(){
				location.href='#address?cityId='+store('location').cityId
			});
			$('.home_storeList').on('click','.aStore',function(){
				location.href='#detail?geohash='+jay.getHash('geohash')+'&shopId='+$(this).attr('data-goodId');
			})
		},
		enter:function(){
			this.Dom.show();
		},
		leave:function(){
			this.Dom.hide();
		},
		render:function(){
			var jay=this;
			$.ajax({//获取商品类型列表
				url:'/v2/index_entry',
				type:'get',
				data:{
					geohash:this.getHash('geohash'),
					group_type:1,
					flags:['F']
				},
				success:function(res){
					var strFir='';
					var strSec='';
					for(i in res){
						if(i<8){
							strFir+='<dl>'
						        		+'<dt><img src="https://fuss10.elemecdn.com'+res[i].image_url+'" alt=""></dt>'
						        		+'<dd>'+res[i].title+'</dd>'
						        	+'</dl>'
						}else{
							strSec+='<dl>'
						        		+'<dt><img src="https://fuss10.elemecdn.com'+res[i].image_url+'" alt=""></dt>'
						        		+'<dd>'+res[i].title+'</dd>'
						        	+'</dl>'
						}
					}
					$('.type_listFir').html(strFir);
					$('.type_listSec').html(strSec);
				}
			})
			if(store('location')){
				$.ajax({
					url:'/shopping/restaurants',
					type:'get',
					data:{
						latitude:store('location').latitude,
						longitude:store('location').longitude,
						offset:0,
						limit:20,
						extras:['activities']
					},
					success:function(res){
						var str='<header><i class="fa fa-anchor"></i><span>附近商家</span></header>';
						for(i in res){
							str+='<article class="aStore" data-goodId="'+res[i].id+'">'
								+'<aside class="leftWrap">'
									+'<img _v-01bcfc2b src="'+jay.getRealImgUrl(res[i].image_path)+'" alt="">'
								+'</aside>'
								+'<aside class="rightWrap">'
									+'<h4>'
										+'<span class="left title">'+res[i].name +'</span>'
										+'<div class="right">'
											+'<span class="star">星级评定</span>'
											+'<span>'+res[i].rating+'</span>'
										+'</div>'
									+'</h4>'
									+'<p>'
										+'月售<span>'+res[i].recent_order_num+'</span>单'
									+'</p>'
									+'<div class="length">'
										+'¥<span>'+res[i].float_delivery_fee+'</span>起送'
										+'<span class="Separate">/</span>'
										+'配送费¥<span>'+res[i].float_minimum_order_amount+'</span>'
										+'<div class="right">'
											+'<span>'+res[i].distance+'</span>米'
											+'<span class="Separate">/</span>'
											+'<span class="time">'+res[i].order_lead_time+'分钟</span>'
										+'</div>'
									+'</div>'
								+'</aside>'
								+'</article>'
						}
						$('.home_storeList').html(str);
						if(res==''){
							var img=$('<img/>');
							img.attr('src','https://github.elemecdn.com/eleme/fe-static/master/media/empty/no-shop.png');
							img.css({display:'block',margin:"0 auto",marginTop:'3rem'});
							var span=$('<span></span>');
							span.text('附近没有外卖商家');
							span.css({display:'block',textAlign:'center',fontSize:'16px',color:'silver'});
							$('.home_storeList').append(img).append(span);
						}
					}
				});
				$('.home_address').text(store('location').address)
			}else{
				$('.home_address').text('请重新选择地址')
			}
		},
		getRealImgUrl:function(str){
			switch(str.substring(str.length-2)){
				case 'ng':var type='png';break;
				case 'eg':var type='jpeg';break;
				case 'pg':var type='jpg';break;
				case 'if':var type='gif';break;
			}
			return imgURL='https://fuss10.elemecdn.com/'+str.substring(-1,1)+'/'+str.substring(1,3)+'/'+str.substring(3)+'.'+type;
		}
	}
	module.exports=home;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var home=__webpack_require__(1)
	var address=Object.create(home);
	$.extend(address,{
		name:"准确地址",
		Dom:$('#address'),
		eventFlag:true,
		init:function(){
			this.render();
			this.bindEvent();
		},
		bindEvent:function(){
			var jay=this;
			$('.searchbotton').click(function(){
				jay.searchAddress();
			})//搜索
			$('.addressList').on('click','dl',function(){
				if(jay.eventFlag){
					jay.eventFlag=false;
					store('location',{cityId:jay.getHash('cityId'),address:$(this).find('dd').text(),longitude:$(this).attr('data-longitude'),latitude:$(this).attr('data-latitude')})
					location.href='#home?geohash='+$(this).attr('data-geohash');
					home.init();
				}else{
					jay.eventFlag=true
				}
			})
			//返回按钮
			$('.back').click(function(){
				history.go(-1)
			});
			$('.otherCity').click(function(){
				location.href='#city';
			});
		},
		render:function(){
			this.getAddress(); 
		},
		searchAddress:function(){
			var keyword=$('.keyword').val();
			$.ajax({
				url:'/v1/pois',
				type:'get',
				data:{
					city_id:this.getHash('cityId'),
					keyword:keyword,
					type:'search'
				},
				success:function(res){
					var str='';
					for(i in res){
						str+='<dl data-longitude="'+res[i].longitude+'" data-latitude="'+res[i].latitude+'" data-geohash="'+res[i].geohash+'">'+
								'<dt>'+res[i].name+'</dt>'+
								'<dd>'+res[i].address+'</dd>'+
							'</dl>'
					}
					$('.addressList').html(str);
				}
			})
		},
		getAddress:function(){
			$.ajax({
				url:"/v1/cities/"+this.getHash('cityId'),
				type:'get',
				success:function(res){
					$('.inThisCity').html(res.name);
				}
			})
		}
	});
	module.exports=address;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var home=__webpack_require__(1);
	var city=Object.create(home);
	$.extend(city,{
		name:'city',
		Dom:$('#city'),
		eventFlag:true,
		scrollTimer:'',
		init:function(){
			this.render();
			this.bindEvent()
		},
		render:function(){
			var jay=this;
			/*$.ajax({
				url:'/shopping/restaurants',
				type:'GET',
				data:{
					latitude:31.23308,
					longitude:121.3815,
					offset:0,
					limit:20,
					extras:['activities']
				},
				success:function(res){
					console.log(res)
				}
			});*/
			$.ajax({
				url:'/v1/cities?type=hot',
				type:'get',
				success:function(res){
					var str='<article class="hot_city_list">'
						+'<h4>热门城市</h4>'
						+'<a href="javascript:void(0)" id="'+res[0].id+'">'+res[0].name+'</a>'
						+'<a href="javascript:void(0)" id="'+res[1].id+'">'+res[1].name+'</a>'
						+'<a href="javascript:void(0)" id="'+res[2].id+'">'+res[2].name+'</a>'
						+'<a href="javascript:void(0)" id="'+res[3].id+'">'+res[3].name+'</a>'
						+'<a href="javascript:void(0)" id="'+res[4].id+'">'+res[4].name+'</a>'
						+'<a href="javascript:void(0)" id="'+res[5].id+'">'+res[5].name+'</a>'
						+'<a href="javascript:void(0)" id="'+res[6].id+'">'+res[6].name+'</a>'
						+'<a href="javascript:void(0)" id="'+res[7].id+'">'+res[7].name+'</a>'
					+'</article>'
					$('.hot_city').html(str)
				}
			});
			$.ajax({
				url:'/v1/cities?type=group',
				type:'get',
				success:function(res){
					var arr=[];
					for(z in res){
						arr.push(z);
					}
					arr.sort();
					var tableList=[];
					console.log(res)
					for(i in res){
						var article=$('<article></article>');
						var h4=$('<h4></h4>');
						article.addClass('hot_city_list');
						article.attr('sort',i)
						if(i==='A'){
							h4.text(i+'(按字母排序)');
						}else{
							h4.text(i);
						}
						article.append(h4);
						for(j in res[i]){
							var a=$('<a href="javascript:void(0)"></a>');
							a.attr('id',res[i][j].id)
							a.text(res[i][j].name);
							article.append(a);
						}
						tableList.push(article);
					}
					for(x=0;x<arr.length;x++){
						for(c=0;c<tableList.length;c++){
							if(tableList[c].attr('sort')==arr[x]){
								$('.allcity').append(tableList[c]);
								var a=$('<a href="javascript:void(0)">'+arr[x]+'</a>')
								$('.floor').append(a);
							}
						}
					}
					jay.bindEvent();
				}
			});//获取城市列表（按字母排序）
		},
		bindEvent:function(){
			var jay=this;
			document.querySelector('.floor').addEventListener('click',function(e){
				if(jay.eventFlag){
					jay.eventFlag=false;
					for(i=0;i<$('.hot_city_list').length;i++){
						if($('.hot_city_list').eq(i).attr('sort')===e.target.innerHTML){
							clearInterval(city.scrollTimer)
							jay.animateScroll($('.hot_city_list').eq(i).offset().top);
						}
					}
				}else{
					jay.eventFlag=true;
				}	
			})
			document.querySelector('#cityBox').addEventListener('click',function(e){
				if(jay.eventFlag){
					jay.eventFlag=false;
					if(e.target.id){
						location.href='#address?cityId='+e.target.id
					}
				}else{
					jay.eventFlag=true;
				}
			})	
		},
		animateScroll:function(target){
			var thisScrollTop=$(window).scrollTop();
			city.scrollTimer=setInterval(function(){
				var speed=Math.abs(Math.floor((target-$(window).scrollTop()))/10)>1?Math.floor((target-$(window).scrollTop())/10):(target-$(window).scrollTop())>0?1:-1;
				$(window).scrollTop($(window).scrollTop()+speed);
				if($(window).scrollTop()==Math.floor(target)){
					clearInterval(city.scrollTimer)
				};
			},20)
		}
	});
	module.exports=city;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var home=__webpack_require__(1)
	var detail=Object.create(home);
	$.extend(detail,{
		name:'detail',
		Dom:$('#detail'),
		clickFlag:true,
		init:function(){
			this.render();
			this.shopCar.init();
		},
		bindEvent:function(){
			var jay=this;
			this.shopCar.goodsListRender();
			setTimeout(function(){
				if(jay.goodsScroll){
					jay.goodsScroll.refresh();
				}else{
					jay.goodsScroll = new IScroll('#ollistScroll',{
						mouseWheel: true,
		    			scrollbars: true,
		    			fadeScrollbars:true,
		    			probeType:3, //让滚动条滚动正常
					});
				}
				if(jay.typesScroll){
					jay.typesScroll.refresh();
				}else{
					jay.typesScroll = new IScroll('#typeScrollWrap',{
						mouseWheel: true,
			    		scrollbars: true,
			    		fadeScrollbars:true,
			    		probeType:3, //让滚动条滚动正常
					});
				}
				jay.goodsScroll.on('scrollEnd',function(){
					var key={};
					var arr=[];
					$.each($('.goods_list>li'),function(index){
						key[Math.abs($(this).offset().top-$('#ollistScroll').offset().top)]=index;
						arr.push(Math.abs($(this).offset().top-$('#ollistScroll').offset().top));
						/*if($(this).offset().top-$('#ollistScroll').offset().top>=-10&&$(this).offset().top-$('#ollistScroll').offset().top<$('#ollistScroll').height()/4){
							$('.type_list>li').eq($(this).index()).addClass('indexType').siblings().removeClass('indexType');
							jay.typesScroll.scrollToElement(selector('.type_list li','all')[$(this).index()],500,0,0);
						}*/
					});
					var index=Math.min.apply(null,arr)
					$('.type_list>li').eq(key[Math.min.apply(null,arr)]).addClass('indexType').siblings().removeClass('indexType');
					jay.typesScroll.scrollToElement(selector('.type_list li','all')[key[Math.min.apply(null,arr)]],500,0,0);
				})		
			},200);
			if(this.clickFlag){
				this.clickFlag=false;
				$('.type_list').on('tap','li',function(){
					$(this).addClass('indexType').siblings().removeClass('indexType');
					for(j=0;j<$('.minTittle').length;j++){
						if($('.minTittle').eq(j).text()==$(this).find('span').text()){
							jay.goodsScroll.scrollToElement(selector('.minTittle','all')[j], 500, 0, -10);
							break;
						}
					}
				})
			};
			//头部详情模块
			$('.closeActButton').on('tap',function(){
				$('.activityBox').addClass('activityBoxHide')
				setTimeout(function(){
					$('.activityBox').removeClass('activityBoxHide').hide();
				},500);	
			});
			$('#detail .aStore').on('tap',function(){
				$('.activityBox').show().addClass('activityBoxIn')
				setTimeout(function(){
					$('.activityBox').removeClass('activityBoxIn');
				},500);	
			});
		},
		render:function(){
			var jay=this;
			Pace.restart();
			$.ajax({
				url:'/shopping/restaurant/'+this.getHash('shopId')+'?extras[]=activities&extras[]=album&extras[]=license&extras[]=identification&extras[]=statistics',
				type:'get',
				data:{
					latitude:store('location').latitude,
					longitude:store('location').longitude,
				},
				success:function(res){
					/*var str='<article class="aStore">'+
						'<aside class="leftWrap">'+
							'<img  src="'+jay.getRealImgUrl(res.image_path)+'" alt="">'+
						'</aside>'+
						'<aside class="rightWrap">'+
							'<h4>'+
								'<span class="title">'+res.name+'</span>'+
							'</h4>'+
							'<p>'+
							'</p>'+
							'<div class="activities">'+
								'<span class="activities_num">'+res.activities.length+'个活动&nbsp;<i class="fa fa-chevron-down">'+'</i>'+'</span>'+
							'</div>'+
						'</aside>'+
					'</article>'+
					'<aside class="promotion_info">'+
						'<dl>'+
							'<dt class="promotion_icon">'+'公告</dt>'+
							'<dd class="promotion_text">'+res.promotion_info+'</dd>'+
						'</dl>'+
					'</aside>';
					$('#detail>header').html(str)*/
					var str='';
					$('#detail>header').css({background:'url('+jay.getRealImgUrl(res.image_path)+'?imageMogr/quality/80/format/webp/thumbnail/!40p/blur/50x40/) no-repeat',backgroundSize:'100% auto'})
					$('#detail .leftWrap img').attr('src',jay.getRealImgUrl(res.image_path));
					$('#detail .rightWrap .title').text(res.name);
					$('#detail .time').text(res.order_lead_time+'分钟送达');
					$('#detail .float_delivery_fee').text(res.float_delivery_fee)
					for(i=0;i<res.activities.length;i++){
						str+='<dl>'+
								'<dt class="activities_icon" style="background:#'+res.activities[i].icon_color+'">'+res.activities[i].icon_name+'</dt>'+
								'<dd class="activities_tips">'+res.activities[i].tips+'</dd>'+
							'</dl>'
					}
					$('.activities').prepend(str);
					if(res.activities.length>1){
						$('.activities_num').show();
						$('.activities_num span').text(res.activities.length)
					}else{
						$('.activities_num').hide();
					}
					if(res.promotion_info!=''){
						$('.promotion_text').text(res.promotion_info)
					}
				}
			});
			$.ajax({
				url:'/shopping/v1/menu',
				type:'get',
				data:{
					restaurant_id:this.getHash('shopId')
				},
				success:function(res){
					var typeStr='';
					var goodStr='';
					var li;
					var goodsIndex=0;
					$('.goods_list').html('')
					for(i in res){
						typeStr+='<li><span>'+res[i].name+'</span><div class="typeNum">0</div></li>';
						if(i==0){
							typeStr='<li class="indexType"><span>'+res[i].name+'</span><div class="typeNum">0</div></li>';
						}
						goodStr='';
						li=$('<li></li>')
						li.html('<h2><span class="minTittle">'+res[i].name+'</span><i class="goods_title_icon fa fa-server"></i></h2>');
						var ol=$('<ol></ol>');
						for(j=0;j<res[i].foods.length;j++){
							goodsIndex++;
							var ptext=res[i].foods[j].description?res[i].foods[j].description:'';
							var imgPath=res[i].foods[j].image_path?'<aside class="good_logo"><img src="'+jay.getRealImgUrl(res[i].foods[j].image_path)+'" alt=""></aside>':'';

							goodStr+='<li>'+imgPath+
										'<aside class="good_detail">'+
											'<h3>'+res[i].foods[j].name+'</h3>'+
											'<p>'+ptext+'</p>'+
											'<p>'+'<span>月售'+res[i].foods[j].month_sales+'份&nbsp;好评率'+res[i].foods[j].satisfy_rate+'%</span>'+'</p>'+
											'<span class="singlePrice">'+res[i].foods[j].specfoods[0].price+'</span>'+
											'<div class="crountWrap" index="'+goodsIndex+'"><div class="shiftButton">-</div><span class="crountNum">1</span><div class="addButton">+</div></div>'+
										'</aside>'+
									'</li>'
						}
						ol.html(goodStr);
						li.append(ol);
						$('.goods_list').append(li);
					}
					$('.type_list').html(typeStr);
					jay.bindEvent();
				}
			})
		},
		enter:function(){
			this.Dom.show();
			this.Dom.css({display:'flex'});
		},
		leave:function(){
			this.Dom.hide();
		},
		shopCar:{
			PriceDOM:$('.allPrice'),
			clickFlag:true,
			Singlegoods:{},
			carJumpTimer:'',
			listReadyDOM:{},
			init:function(){
				this.bindEvent();
			},
			plusMethod: function(elem){
				var shop=this.Singlegoods;
				var jay=this;
				var name=$(elem).parents('ol').siblings('h2').find('.minTittle').text()
				var index=$(elem).parent().attr('index');
				var singlePrice=$(elem).parent().siblings('.singlePrice').text();
				if(!shop[index]){
					var goodName=$(elem).parents('.good_detail').find('h3').text();
					shop[index]={};
					shop[index].name=goodName;
					shop[index].singlePrice=parseInt(singlePrice*10)/10;
					shop[index].singleNum=0;
					$.each($('.type_list li'), function() {
						 if($(this).find('span').text()==name){
						 	shop[index].typeNumDom=$(this).find('.typeNum')
						 }
					});//获取商品类型DOM;
				}
				if(!shop[index].listAddDOM){
					var str=	'<dd>'+
									'<span class="shopTitle">'+shop[index].name+'</span>'+
									'<span class="typePrice">'+singlePrice+'</span>'+
									'<div class="crountWrap" index="'+index+'">'+
										'<div class="shiftButton">-</div>'+
										'<span class="crountNum">1</span>'+
										'<div class="addButton">+</div>'+
									'</div>'+
								'</dd>';
					$('.carListWrap').append(str);
					$.each($('.shopCarList dd .crountWrap'), function() {
						 if($(this).attr('index')==index){
						 	shop[index].listAddDOM=$(this).find('.addButton');
						 	shop[index].listShiftDOM=$(this).find('.shiftButton');
						 }
					});
				}
				shop[index].singleNum++;
				$(elem).siblings('.shiftButton').show();
				shop[index].typeNumDom.show().text(Number(shop[index].typeNumDom.text())+1);
				$(elem).siblings('.crountNum').show().text(shop[index].singleNum);

				shop[index].listAddDOM.siblings('.crountNum').text(shop[index].singleNum);
				shop[index].listAddDOM.parent().siblings('.typePrice').text(shop[index].singleNum*shop[index].singlePrice)
				if(jay.shopListScroll){
					jay.shopListScroll.refresh();
				}
				jay.getAllPrice();
				store('shopCar'+detail.getHash('shopId'),shop);
			},
			shiftMethod:function(elem){
				var jay=this;
				var shop=this.Singlegoods;
				var index=$(elem).parent().attr('index');
				if(shop[index].singleNum>0){
					shop[index].singleNum--;
					$(elem).siblings('.crountNum').text(shop[index].singleNum);
					shop[index].listShiftDOM.siblings('.crountNum').text(shop[index].singleNum);
					shop[index].listShiftDOM.parent().siblings('.typePrice').text(shop[index].singleNum*shop[index].singlePrice);
				}
				if(shop[index].typeNumDom.text()>0){
					shop[index].typeNumDom.show().text(Number(shop[index].typeNumDom.text())-1);
				}
				if(shop[index].typeNumDom.text()==0){
					shop[index].typeNumDom.hide();
				}
				if(shop[index].singleNum==0){
					$(elem).siblings('.crountNum').hide();
					$(elem).hide();
					shop[index].listShiftDOM.parents('dd').remove();
					shop[index]=null;
					if(jay.shopListScroll){
						jay.shopListScroll.refresh();
					}
				}
				jay.getAllPrice();
				store('shopCar'+detail.getHash('shopId'),shop);
			},
			bindEvent:function(){
				var shop=this.Singlegoods;
				var jay=this;
				if(jay.shopListScroll){
					
				}else{
					jay.shopListScroll = new IScroll('#shopListScroll',{
						mouseWheel: true,
		    			scrollbars: true,
		    			fadeScrollbars:true,
		    			probeType:3, //让滚动条滚动正常
					});
				}
				if(this.clickFlag){
					this.clickFlag=false;
					$('.goods_list').on('tap','.addButton',function(){
						jay.plusMethod(this);
					});
					$('.goods_list').on('tap','.shiftButton',function(){
						jay.shiftMethod(this);
					});
					$('.theCarIcon').on('tap',function(){
						$('.shopCarList').toggleClass('showShopCarList');
					});
					$('.shopCarList').on('tap','.addButton',function(){
						var index=$(this).parent().attr('index');
						var el=$('.good_detail .crountWrap').eq(index-1).find('.addButton');
						jay.plusMethod(el);
					});
					$('.shopCarList').on('tap','.shiftButton',function(){
						var index=$(this).parent().attr('index');
						var el=$('.good_detail .crountWrap').eq(index-1).find('.shiftButton');
						jay.shiftMethod(el);
					});
					$('.container').on('tap',function(){
						$('.shopCarList').removeClass('showShopCarList');
					})
					//清空购物车
					$('.clearButton ').on('tap',function(){
						for(i in jay.Singlegoods){
							jay.Singlegoods[i]=null;
						}
						store('shopCar'+detail.getHash('shopId'),jay.Singlegoods);
						jay.goodsListRender();
						$('.shiftButton').hide().next().text(0).hide();
						$('.typeNum').hide().text(0)
						$('.carListWrap').html('');
					})
				}
			},
			getAllPrice:function(reset){
				var shop=this.Singlegoods;
				var Price=0;
				var num=0;
				var singleNum;
				var singlePrice;
				if(reset){
					$('.theCarIcon').addClass('empety');
					$('.allGoodNum').hide();
					this.PriceDOM.text(0)
					return
				}
				for(index in shop){
					singlePrice=shop[index]?shop[index].singleNum*shop[index].singlePrice:0;
					singleNum=shop[index]?shop[index].singleNum:0;
					Price+=singlePrice;
					num+=singleNum;
				}
				if(Price===0){
					$('.theCarIcon').addClass('empety');
					$('.allGoodNum').hide();
					$('.shopCarList').removeClass('showShopCarList');
				}else{
					$('.theCarIcon').removeClass('empety');
					$('.allGoodNum').show().text(num);
				}
				$('.theCarIcon').addClass('iconJump');
				clearTimeout(this.carJumpTimer)
				this.carJumpTimer=setTimeout(function(){
					$('.theCarIcon').removeClass('iconJump');
				},500)
				this.PriceDOM.text(Price)
			},
			goodsListRender:function(){
				this.Singlegoods={};
				var shop=this.Singlegoods;
				var str='';
				var res=store('shopCar'+detail.getHash('shopId'));
				for(i in res){
					if(!res[i]){
						continue
					}
					shop[i]={};
					shop[i].name=res[i].name;//获取商品名字
					shop[i].singleNum=res[i].singleNum;//获取商品数量
					shop[i].singlePrice=res[i].singlePrice;//获取商品单价
					str+=	'<dd>'+
									'<span class="shopTitle">'+shop[i].name+'</span>'+
									'<span class="typePrice">'+shop[i].singlePrice*shop[i].singleNum+'</span>'+
									'<div class="crountWrap" index="'+i+'">'+
										'<div class="shiftButton">-</div>'+
										'<span class="crountNum">'+shop[i].singleNum+'</span>'+
										'<div class="addButton">+</div>'+
									'</div>'+
								'</dd>';//填充购物车列表
					var name=$('.crountWrap').eq(i-1).parents('ol').siblings('h2').find('.minTittle').text()
					$.each($('.type_list li'), function() {
						 if($(this).find('span').text()==name){
						 	shop[i].typeNumDom=$(this).find('.typeNum');
						 	shop[i].typeNumDom.show().text(Number(shop[i].typeNumDom.text())+shop[i].singleNum);
						 }
					});//获取商品类型DOM;
					//随着数量变化文档的变化
					$('.crountWrap').eq(i-1).find('.shiftButton').show();
					$('.crountWrap').eq(i-1).find('.crountNum').show().text(res[i].singleNum);
					
				};	
				$('.carListWrap').html(str);
				$.each($('.shopCarList dd .crountWrap'), function() {
					 shop[$(this).attr('index')].listAddDOM=$(this).find('.addButton');
					 shop[$(this).attr('index')].listShiftDOM=$(this).find('.shiftButton');
				});//获取购物车内加减DOM
				res?this.getAllPrice():this.getAllPrice('reset');
			},
			listRender:function(){
				var shopCarStr='';
				for(i in this.Singlegoods){
					this.listReadyDOM[i]=true;
					shopCarStr+=	'<dd>'+
								'<span class="shopTitle">'+this.Singlegoods[i].name+'</span>'+
								'<span class="typePrice">'+this.Singlegoods[i].singlePrice*this.Singlegoods[i].singleNum+'</span>'+
								'<div class="crountWrap" index="'+i+'">'+
									'<div class="shiftButton">-</div>'+
									'<span class="crountNum">'+this.Singlegoods[i].singleNum+'</span>'+
									'<div class="addButton">+</div>'+
								'</div>'+
							'</dd>';
				}
				$('.carListWrap').html(shopCarStr);
			},
			typeListRender:function(){
			},
			render:function(){
				this.clickFlag=true;
				this.Singlegoods={};
				this.carJumpTimer='';
				this.listReadyDOM={};
				this.listRender();
			}
		}
	});
	module.exports=detail;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var home=__webpack_require__(1);
	var address=__webpack_require__(2);
	var city=__webpack_require__(3);
	var detail=__webpack_require__(4);
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

/***/ }
/******/ ]);