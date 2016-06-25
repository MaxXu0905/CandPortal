/**
 * 记录登陆信息
 * zengjie
 * 2014/6/12
 */
(function($,exports){
	var loginInfo ={};
	loginInfo.getBrowserName= function(){
		var browserMark=null,nVersion=navigator.appVersion;
		    if(/TencentTraveler/i.test(nVersion)){
		      browserMark='tt';
		    }else if(/SE.*MetaSr/i.test(nVersion)){
		      browserMark='sogou';
		    }else if(/QQbrowser/i.test(nVersion)){
		      browserMark='qq';
		    }else if(/360/i.test(nVersion) || /360/i.test(navigator.userAgent)){
		      browserMark='360';
		    }else if(/Chrome/i.test(nVersion)){
		      browserMark='chrome';
		    }else if(/Firefox/i.test(navigator.userAgent)){
		      browserMark='firefox';
		    }else if(/Opera/i.test(navigator.userAgent)){
		      browserMark='opera';
		    }else if(/Safari/i.test(navigator.userAgent)){
		      browserMark='safari';
		    }else if(!!window.ActiveXObject || "ActiveXObject" in window){
		        browserMark='ie';
		    }else{
			    browserMark='unkonw';
			}
		    return browserMark;
	};
	/*
	 * 提交记录
	 * operType：操作类型：1进入首页， 2试用  3激活  4登陆
	 * employerAcct：登陆账号
	 * */
	loginInfo.postRecode = function(){
		var url=root+"/info/saveOperLog";
		var jsonObj = {};
		jsonObj.os = navigator.platform;
		var browser = this.getBrowserName();
		if(browser){
			jsonObj.browser = browser;
		}
		jsonObj.browserVersion =  navigator.appVersion;
		$.ajax({
	         type: "POST",
	         url: url,
	         dataType:'json',
			 contentType:"application/json",
	         data:JSON.stringify(jsonObj),// 要提交的表单 
	         success : function(e){
	         }
		});
	};
	exports.recodeloginInfo = loginInfo;
})(jQuery,window);
