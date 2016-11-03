var home=require('./home.js');
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