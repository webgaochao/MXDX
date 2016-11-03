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