var home=require('./home.js')
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