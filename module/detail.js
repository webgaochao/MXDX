var home=require('./home.js')
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