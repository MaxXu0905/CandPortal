/**
 * 完善资料页面功能
 * zengjie
 * 14/3/15
 */
function setPageHeight(){
	$("#regist-wrap-inner").css("min-height",document.body.scrollHeight-86);
}
/*创建命名空间*/
var registModel = angular.module('registApp',[]);

/*main函数*/
registModel.run(function($rootScope){
	
	//$rootScope.address=GenerAddressInfoSV.init();
});

/*创建模糊查询过滤器*/

/*创建服务工厂来获取数据*/
registModel.factory('GetInfoServer',function($http){
	var url = convertURL(root+"/info/getInput");
		return {
			get : function(){
				return $http.get(url).then(function(data,status,headers,config){
	                return data.data; //成功回调则返回这个
	            });
			}
		};
});
/*设置realValue*/
registModel.directive('setRealValue',function(){
	return {
		 require: 'ngModel',
		 link: function(scope, ele, attrs, c) {
			 ele.on('change',function(){
				 var text = ele[0].options[ele[0].selectedIndex].text;
				 scope.$parent.item.realValue=text;
			 });
		    	/*scope.$watch(attrs.ngModel, function() {
		    		
		    	});*/
		 }
	};
});
/*angularjs ng-option ie issue解决方案*/
registModel.directive('ieSelectFix', [
    function () {
        return {
            restrict: 'A',
            require: 'select',
            link: function (scope, element, attributes) {
                var isIE = document.attachEvent;
                if (!isIE) return;
                var control = element[0];
 
                scope.$watch(attributes.ieSelectFix, function () {
 
                    //it should be use javascript way, not jquery way.
 
                    var option = document.createElement("option");
 
                    control.add(option, null);
 
                    control.remove(control.options.length - 1);
 
                });
 
            }
 
        }
 
    }
 
]);
/*改变居住地的省份*/
registModel.directive("changeProvince",function(){
	return {
		link : function(scope,ele,attrs,c){
			ele.on('change',function(){
				//设置realValue
				 var text = ele[0].options[ele[0].selectedIndex].text;
				 scope.$parent.item.realValue=text;
				 scope.$parent.item.value=scope.$parent.item.currentProvince;
			});
		}
	};
});
registModel.directive("changeCity",function(){
	return {
		link : function(scope,ele,attrs,c){
			ele.on('change',function(){
				//设置realValue
				 var text = ele[0].options[ele[0].selectedIndex].text;
				 scope.$parent.item.realValue=scope.$parent.item.realValue+"-"+text;
				 scope.$parent.item.value=scope.$parent.item.currentProvince+","+scope.$parent.item.currentCity;
			});
		}
	};
});
registModel.directive('toSearch', ['$http', function($http) {
	  return {
	    require: 'ngModel',
	    link: function(scope, ele, attrs, c) {
	      scope.$watch(attrs.ngModel, function() {
	    	  var selected = scope.$parent.selected;
	    	  if(c.$dirty && !selected){
	    		  $http({
	    	          method: 'POST',
	    	          url: root+"/info/getBySearchCondition",
	    	          data: {"infoId":attrs.name,"searchName":c.$modelValue}
	    	        }).success(function(data, status, headers, cfg) {
	    	        	scope.queryitems=data.data;
	    	        	if(data.data && data.data.length>0){
	    	        		scope.$parent.$parent.showQuery = true;
	    	        	}else{
	    	        		scope.$parent.$parent.showQuery = false;
	    	        	}
	    	        }).error(function(data, status, headers, cfg) {
	    	        	scope.queryitems=[];
	    	        });
	    	  }else{
	    		  scope.$parent.selected=false;
	    	  }
	      });
	    }
	  };
	}]);
/*创建controller*/
registModel.controller('RegistController',function($scope,$http,$window,$interval){
	$window.setPageHeight();
	$scope.btnIsDisabled = true;
	$scope.btnValue = "正在生成试卷...";
	$scope.showQuery=false;
	$scope.alertShow=false;
	$scope.selected=false;
//	$scope.address={};
//	$scope.province="";
//	$scope.city="";
//	$scope.addressStr=$scope.city;
	$scope.setQueryValue =  function(target,infoid){
		$scope.showQuery=false;
		var value = angular.element(target).text();
		angular.element("#"+infoid).scope().$parent.item.value=jQuery.trim(value);
		angular.element("#"+infoid).scope().$parent.selected=true;
	};
	/*检查考试开始时间和结束时间*/
	$scope.isSecToEffDate = false;
	var checkExamInterval = null;
	$scope.getInvitationTimeInfo = function(){
		var url = convertURL(root+"/exam/getInvitationTimeInfo");
		$http.get(url).success(function(data,status,headers,config){
			if(data.code == 0 && data.data){
				$scope.invitationTimeInfo = data.data;
				//判断是否可以开始考试
				if(data.data.secToEffDate && data.data.secToEffDate>0){
					//未到考试时间，给出时间提示
					$scope.isSecToEffDate = true;
					$scope.secToEffDate = $scope.secToEffDate || {};
					$scope.secToEffDate.diffSec  = data.data.secToEffDate;
					$scope.secToEffDate = transferTime($scope.secToEffDate);
					if(!checkExamInterval){
						checkExamInterval = $interval(function(){
							$scope.getInvitationTimeInfo();
						}, 60000);
					}
				}else{
					$scope.isSecToEffDate = false;
					if(checkExamInterval){
						$interval.cancel(checkExamInterval);
					}
				}
			}
			//调用生成试卷
			$scope.getPaperState();
		}).error(function(data,status,headers,config){
			//处理错误
			$scope.alertInfo="调用getInvitationTimeInfo失败，不能连接服务端，请联系管理员！";
		});
	}
	/*获取生成试卷状态*/
	var stop=null;
	$scope.getPaperState = function(){
		var url =  convertURL(root+"/exam/getPaperState"); 
		$http.get(url).success(function(data,status,headers,config){
			//获取数据成功
			if(data.code==0 && data.data){
				$scope.paperState=data.data.code; 
				if($scope.paperState==2){
					$scope.btnIsDisabled = false;
					$scope.btnValue = "开始练习";
					$interval.cancel(stop);
				}else if($scope.paperState==-1){
					$scope.alertInfo="服务异常，请联系管理员！";
					$scope.btnIsDisabled = true;
					$scope.btnValue = "生成试卷失败!";
				}else{
					if(!stop){
						stop = $interval(function(){
							$scope.getPaperState();
						}, 5000);
					}
				}
			}else{
				$scope.alertInfo="获取生成试卷状态失败！";
			}
		}).error(function(data,status,headers,config){
			//处理错误
			$scope.alertInfo="调用getPaperState失败，不能连接服务端，请联系管理员！";
		});
		
	};
	/*end 获取生成试卷状态*/
	/*初始化居住地址值*/
	$scope.initAddress = function(k,v){
		var a = $scope.items[k].extendInfo;
		var currentProvince = $scope.items[k].currentProvince;
		var currentCity = $scope.items[k].currentCity;
		for (var i in a){
			if(a[i].regionId==v){
				$scope.items[k].currentProvince = a[i].regionId;
				$scope.items[k].city=a[i].children;
				break;
			}
		}
		var city = $scope.items[k].city
		for (var i in city){
			if(city[i].regionId==currentCity){
				$scope.items[k].currentCity = city[i].regionId;
				break;
			}
		}
	};
	$scope.changeProvince = function(infoid,v,target){
		var currentitem = angular.element("#"+infoid).scope().$parent.item;
		angular.element("#"+infoid).scope().$parent.item.currentCity="";
		angular.element("#"+infoid).scope().$parent.item.value=v;
		//$scope.province =v;
		var a=currentitem.extendInfo;
		for (var i in a){
			if(a[i].regionId==v){
				angular.element("#"+infoid).scope().$parent.item.city=a[i].children;
				break;
			}
		}
	
	};
//	$scope.changeCity= function(infoid,v,flag){
//		//angular.element("#"+infoid).scope().$parent.item.city=v;
//		var currentProvince = angular.element("#"+infoid).scope().$parent.item.currentProvince;
//		var currentCity = angular.element("#"+infoid).scope().$parent.item.currentCity;
//	    angular.element("#"+infoid).scope().$parent.item.value=	currentProvince+","+currentCity;
//	};
	$http.get(convertURL(root+"/info/getInput")).success(function(data,status,headers,config){
		//获取数据成功
		if(data.data){
			$scope.items=data.data; 
			for(var i in $scope.items){
				if($scope.items[i].valueType=="address"){
					var value = $scope.items[i].value;
					var infoId = $scope.items[i].infoId;
					$scope[infoId]=$scope[infoId] || {};
					$scope.items[i].currentProvince ="";
					$scope.items[i].currentCity ="";
					if(value){
						var valueArr = value.split(",");
						$scope.items[i].currentProvince =valueArr[0];
						$scope.items[i].currentCity =valueArr[1];
					}
				}
			}
			$scope.loading=false;
			angular.element("#loading").addClass("hidden");
			angular.element("#regist-wrap-inner").removeClass("hidden");
		}else{
			$scope.alertInfo="从服务端获取个人信息失败！";
		}
	}).error(function(data,status,headers,config){
		//处理错误
		$scope.alertInfo="连接服务端失败！";
	});
	$scope.submitInfo = function(items){
		if($scope.registForm.$valid){
			$scope.btnIsDisabled = true;
			var formData =$scope.items; 
			var form =[];
			for (var i in formData){
				var info ={};
				info.id={"infoId":formData[i].infoId};
				info.value=formData[i].value;
				if(formData[i].valueType!="select" && formData[i].valueType!="address"){
					info.realValue=formData[i].value;
				}else{
					info.realValue= formData[i].realValue;
				}
				
				form.push(info);
			}
			var jsonStr =JSON.stringify(form);
			$http.post(root+"/info/commit",jsonStr,{}).success(function(data, status, headers, config){
				if(data.code=="0"){
					$scope.alertShow=true;
					$scope.alertInfo="保存资料成功!";
					$window.location.href=root+"/exam/sample";
				}else{
					$scope.alertShow=true;
					$scope.alertInfo="保存资料失败,调用服务失败!";
				}
			}).error(function(data, status, headers, config){
				
			});
			$scope.btnIsDisabled = false;
		}else{
			//$window.alert("请正确完整填写个人资料");
			 $scope.registForm.submitted = true;
			 $scope.registForm.submittedClass = "submited";
		}
		
		
	};
	$scope.clearInput=function(target,value){
		if((target.placeholder == target.value)|| (!target.value)){
			target.value="";
		}
	};
	$scope.queryIndex = 0; //当前的索引
	$scope.queryFocus = function(e){
		var li = angular.element("#"+e.target.id+" + ul")[0].getElementsByTagName('li');
		var length = angular.element("#"+e.target.id+" + ul").children("li").length;
		if($scope.showQuery){
			 if(40 == e.keyCode) { //按键盘向下键
			        if(++$scope.queryIndex == length+1) { $scope.queryIndex = 1; }
			        $scope.setView(li, $scope.queryIndex);
		    }
		    if(38 == e.keyCode) {//按键盘向上键
		        if(--$scope.queryIndex == 0) { $scope.queryIndex = length; }
		        $scope. setView(li, $scope.queryIndex);
		    }
		    if(13 == e.keyCode){//回车键
		    	$scope.showQuery=false;
		    	$scope.queryIndex = 0;
		    }
		}
		 
	};
	$scope.setView = function(elems, index) {
	    for(var j = 0; j < elems.length; j++) {
	    	angular.element(elems[j]).removeClass("query-menu-hover");
	    }
	    var value = angular.element(elems[index-1]).text();
		angular.element(elems).scope().$parent.$parent.item.value=jQuery.trim(value);
		angular.element(elems).scope().$parent.$parent.selected=true;
	    angular.element(elems[index-1]).addClass("query-menu-hover");
	};
	$scope.isqueryHover = false;
	$scope.queryHover = function(target){
		 angular.element(target).removeClass("query-menu-hover");
		 $scope.isqueryHover=true;
	};
	$scope.onBlurQuery = function(target){
		if(!$scope.isqueryHover){
			$scope.showQuery=false;
		}
	};
	$scope.onFocusQuery = function(target){
		var a =angular.element("#"+target.id+"+ ul").children("li");
		if(a.length>0){
			$scope.showQuery=true;
		}
	};
});
$(function(){
	$.placeholder.shim();//初始化placeholder
	/*记录登陆信息*/
	 try{
		 recodeloginInfo.postRecode();
	 }catch(e){
		 throw e.message;
	 }
	 /*获取二维码图片*/
	 try{
		$.get(root+'/info/getQRCodePicUrl',function(data){
			if(data.data){
				 $('#qrcode-pic').attr('src',data.data);
				 $('#qrcode').show();
			}else{
				 $('#qrcode').remove();
			}
		});
	 }catch(e){
		 throw e.message;
	 }
	 /*关闭二维码弹出层*/
	 $('#closeqrCode').on('click',function(){
		 $('#qrcode').remove();
	 });
	 
});
function convertURL(url) { 
    //获取时间戳 
    var timstamp = (new Date()).valueOf(); 
    //将时间戳信息拼接到url上 
    //url = "AJAXServer" 
    if (url.indexOf("?") >= 0) { 
            url = url + "&t=" + timstamp; 
    } else { 
            url = url + "?t=" + timstamp; 
    } 
    return url; 
}

/*时间转换*/
function transferTime(secToEffDate){
	if(secToEffDate.diffSec){
		var time="",diffSecs=secToEffDate.diffSec;
		//var seconds = diffSecs % 60;
		var minutes = Math.ceil(diffSecs/60)%60;
		var hours = Math.floor(diffSecs/60/60)%24;
		var day = Math.floor(diffSecs/ 60 / 60 / 24);
		if(day){
			time+=day+"天";
			secToEffDate.day = day+"天";
		}
		if(hours || day){
			if(day==1 && hours==0){
				delete secToEffDate.day;
				secToEffDate.hours = "24时";
			}else{
				time+=hours+"时";
				secToEffDate.hours = hours+"时";
			}
		}
		
		if(minutes>=0){
			time+=minutes+"分";
			secToEffDate.minutes = minutes+"分";
		}
//		if(seconds>=0){
//			time+=seconds+"秒";
//			secToEffDate.seconds = seconds+"秒";
//		}
	}
	return secToEffDate;
}
