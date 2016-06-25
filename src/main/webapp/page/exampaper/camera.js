
var TAKEPHOTO = "TAKEPHOTO";
var HIDDEN = "HIDDEN";
var MONITOR = "MONITOR";
	
var cameraType = TAKEPHOTO;
var cutPicInterval = -1;

var _url = "";
var _checkFreq = "";
var _alipath = "";
var _isPhotoFaceRec = "";
var _confirmUrl = "";

var imgName = "";
var imgBytes = null;

var setCameraType = function(type)
{
	if (type == MONITOR)
	{
		ready2Monitor();
	}
	else if(type == HIDDEN)
	{
		if (cutPicInterval)
			clearInterval(cutPicInterval);
	}

	if (type)
		cameraType=type;
}

var getCameraType = function(type)
{
	return cameraType == type;
}


var isSupportH5Video = function()
{
//	if(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia)
//	{
//		return true;
//	}
//	else
//		return false;
	
	 // Normalizes navigator.getUserMedia
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
                           || navigator.mozGetUserMedia || navigator.msGetUserMedia;

	if (isChromiumVersionLower()) {
		return false;
	} else if (!navigator.getUserMedia) {
	    return false;
	}
	else if(navigator.getUserMedia.length == '0')
	{
		return false;
	}
	else {
	    return true;
	}

}


var isChromiumVersionLower = function() {
	var ua = navigator.userAgent;
	var testChromium = ua.match(/AppleWebKit\/.* Chrome\/([\d.]+).* Safari\//);
	if (!testChromium) return false;
	
	var rltArray = testChromium[1].split('.');
	return ((parseInt(rltArray[0]) < 18) || ((parseInt(rltArray[0]) == 18) && (parseInt(rltArray[1]) == 0) && (parseInt(rltArray[2]) < 966)));
}


//(function($) {
	

$("#camera").on('mouseenter','#oTakePhoto',function(e){
	$(this).attr("src",root+"/flex/assets/photoover.png");
});	

$("#camera").on('mouseleave','#oTakePhoto',function(e){
	$(this).attr("src",root+"/flex/assets/takephoto.png");
});

$("#camera").on('mouseenter','#oSurePhoto',function(e){
	$(this).attr("src",root+"/flex/assets/sureover.png");
});

$("#camera").on('mouseleave','#oSurePhoto',function(e){
	$(this).attr("src",root+"/flex/assets/surephoto.png");
});

$("#camera").on('mouseenter','#oCancelPhoto',function(e){
	$(this).attr("src",root+"/flex/assets/cancelover.png");
});

$("#camera").on('mouseleave','#oCancelPhoto',function(e){
	$(this).attr("src",root+"/flex/assets/cancelphoto.png");
});


$("#camera").on('click','#oTakePhoto',function(e){
	cutPic();
});	

$("#camera").on('click','#oSurePhoto',function(e){
	surePhoto();
});	

$("#camera").on('click','#oCancelPhoto',function(e){
	cancelPhoto();
});	


//初始化
var initH5Video = function()
{
	$("#oTipDiv").show();
	
	$("#oTakePhotoTip").hide();
	$("#oTakePhotoImg").hide();
	$("#oTakePhoto").hide();
	$("#oSurePhoto").hide();
	$("#oCancelPhoto").hide();
	$('#confirmModalVideo').modal('hide');
	
//	var videoWidth = $("#oVideo").width();
//	var videoHeight = $("#oVideo").height();
	
	var videoWidth = 598;
	var videoHeight = 448;
	
	$("#oCanvas").width(videoWidth);
	$("#oCanvas").height(videoHeight);
	
	getCameraConfig();
}

var hiddenCamera = function()
{
	viewWindowMin();
}

//允许后操作
var ready2Operation = function()
{
	oTipDiv.hide();
}

//照片
var ready2TakePhoto = function() {
	$("#oTakePhotoTip").show();
	$("#oTakePhoto").show();
	
	$("#oSurePhoto").hide();
	$("#oCancelPhoto").hide();
	$("#oWaitInterviewDiv").hide();
	$("#oPlayDiv").hide();
}

//监控
var ready2Monitor = function()
{
	cameraType=MONITOR; //变成监控状态
	hiddenCamera();
	
	if(!canWithoutCamera)  //没有摄像头不允许考试的情况下，才有监控
		setTimeoutCutPic();
}

/*取得配置参数*/
var getCameraConfig = function()
{	
	$.ajax({
		url : root + "/flex/config.xml?timestamp="+ (new Date).getTime(),
		type : "POST",
		contentType : "application/json",
		dataType : "xml",
		success : function(result) {
			var $xml = $(result);
			_url = $xml.find('red5url').text();
			_checkFreq = $xml.find('checkfreq').text();
			_alipath = $xml.find('alipath').text();
			_isPhotoFaceRec = $xml.find('isPhotoFaceRec').text(); 
			
			if(!_checkFreq)
				_checkFreq = 60;
			
			_checkFreq = parseInt(_checkFreq);
			_checkFreq = parseInt(_checkFreq + Math.ceil(Math.random()*10) );
			
			setupCamera();
		}
	});
};


/*检查候选人是否有照片*/
var checkCandidatePic = function() {
	$.ajax({
		url : root + "/checkCandidatePic?timestamp="+ (new Date).getTime(),
		type : "POST",
		contentType : "application/json",
		dataType : "json",
		success : function(result) {
			if (result.code == "0") {
				var noPhoto = result.data.code == "FAILED";
				if (!noPhoto) //FAILED表示没有图片  !FAILED表示有图片，有图片不用拍照，直接隐藏
				{
					ready2Monitor();
				}
				else
				{
					if (cameraType == TAKEPHOTO)
					{
						oTakePhotoTip.visible=oTakePhotoTip.includeInLayout=true;
						ready2TakePhoto();
					}
				}
				
			} else if (result.code == 12) {
				// window.location.href=root+"/goToError";
				return false;
			} else if (result.code == 13) {
				// session失效
				alertSessionInvalid(_this, index, a);
			} else {
				// alert("获取题目信息服务（exam/query）的返回状态码异常：状态码为"+result.code+":"+result.message);
				// window.location.href=root+"/error";
				return false;
			}
		}
	});
}		

var cutPic = function()
{
	$("#oCanvas").show();
	var videoWidth = $("#oCanvas").width();
	var videoHeight = $("#oCanvas").height();
	
	
	var canvas = $("#oCanvas").get(0),
	context = canvas.getContext("2d");
	context.drawImage(video, 0, 0, videoWidth, videoHeight);
	
	var imageData = context.getImageData(0, 0, videoWidth, videoHeight);
	
	var encoder = new JPEGEncoder();
	imgBytes=encoder.encode(imageData);
	
	imgName = new Date().getTime()+"";
	fileOper("PUT",imgName);
}

/*上传照片并人脸识别*/
var fileOper = function(httpMethodName,imgName) {
	
	var param = null;
	if("PUT" == httpMethodName)
	{
		$("#oTakePhotoTip").text("正在解析照片，请稍候...");
		
		$("#oTakePhotoImg").show();
		$("#oTakePhotoImg").addClass("fa-spin");
		$("#oTakePhoto").hide();

		param = imgBytes;
	}

	$.ajax({
		url : _alipath + "/snapShotsUploadTemp/"  + testID + "/" + imgName + "/" +httpMethodName +"/" + cameraType+"/"+_isPhotoFaceRec,
		type : "POST",
		contentType : "application/octet-stream",
		data: param,
		method:"POST",
		dataType : "json",
		success : function(result) {
			if ("PUT" == httpMethodName)
			{
				if (cameraType == "TAKEPHOTO") //如果是拍照。
				{
					
					if (result.code == "21") //拍摄无效
					{
						
						confirmModalWin("看不清你的脸，重新拍一张吧！","我知道了",null,null,null,0,true,true);
						faceError();
						return;
					}
					else if (result.code == "12") //错误
					{
						confirmModalWin(VideoPrompt.FACERECERROR,"确定",null,null,null,0,true,true);
//						alert(VideoPrompt.FACERECERROR);
						faceError();
						return;
					}
					else
					{
						$("#oTakePhotoTip").text("是否用这张照片作为您的报告头像，确认√，重拍×。");
						
						$("#oTakePhotoImg").hide();
						$("#oTakePhotoImg").removeClass("fa-spin");
//							stop();
						$("#oTakePhoto").hide();
						$("#oSurePhoto").show();
						$("#oCancelPhoto").show();
						
						_confirmUrl = result.message;
					}
				}
				else if (cameraType == "MONITOR")
				{
					if (result.data)
						uploadAbnormalSnapShot(result.data);
				}
			}
		}
	});
}	

//确认用这张图片作为头像
var surePhoto = function()
{
	updateCandidatePic();
}

//取消重拍
var cancelPhoto = function()
{
	$("#oCanvas").hide();
	
	faceError();
	fileOper("DELETE", imgName);
}

//将这张照片作为头像
var updateCandidatePic = function() {
	
	var param = {imgUrl:_confirmUrl};
	$.ajax({
		url : root + "/updateCandidatePic",
		type : "POST",
		contentType : "application/x-www-form-urlencoded",
		data: param,
		dataType : "json",
		success : function(result) {
			if (result.code == "0") //正确的
			{
				$("#oTakePhoto").hide();
				$("#oSurePhoto").hide();
				$("#oCancelPhoto").hide();
				$("#oCanvas").hide();
				
				hiddenCamera();
			}
		}
	});
}	

//将异常图片记录到数据库
var uploadAbnormalSnapShot = function(obj) {
	$.ajax({
		url : root + "/uploadAbnormalSnapShot",
		type : "POST",
		contentType : "application/x-www-form-urlencoded",
		data: obj,
		dataType : "json",
		success : function(result) {
		}
	});
}	


//监控拍照
var setTimeoutCutPic = function()
{
	setTimeout(cutPic,_checkFreq);
	cutPicInterval = setInterval(cutPic,_checkFreq);
}

var faceError = function()
{
//			stop();
		$("#oTakePhotoTip").text("请端正坐姿拍一张靓照，给面试官留下好印象！点击拍照>>>");
		
		$("#oTakePhotoImg").hide();
		$("#oTakePhotoImg").removeClass("fa-spin");
		$("#oCanvas").hide();
		$("#oTakePhoto").show();
		$("#oSurePhoto").hide();
		$("#oCancelPhoto").hide();
};

var confirmModalWin = function(msg,yesLabel,noLabel,yesFunction,noFunction,activeId,isClosable,hasNoBtn)
{
	$("#confirmmsgVideo").html("<p>"+msg+"</p>");
	
	if(!yesLabel)
		yesLabel = "确定";
	if(!noLabel)
		noLabel = "取消";
	if(!activeId)
		activeId = 2;
	if(!isClosable)
		isClosable = false;
	if(!hasNoBtn)
		hasNoBtn = false;
	
	if(hasNoBtn)
		$("#cancelbtnVideo").hide();
		
	
	$('#confirmbtnVideo').on('click',function(e){
		if(yesFunction)
			yesFunction();
		$('#confirmModalVideo').modal('hide');
	});	
	
	
	if(noFunction)
		$('#cancelbtnVideo').on('click',function(e){
			noFunction();
			$('#confirmModalVideo').modal('hide');
		});	
	else
		$('#cancelbtnVideo').on('click',function(e){
			$('#confirmModalVideo').modal('hide');
		});	
	
	
	$("#confirmbtnVideo").html(yesLabel);
	$("#cancelbtnVideo").html(noLabel);
	$("#confirmbtnVideo").data("active",activeId);
	
	if(isClosable)
		$('#confirmModalVideo .close').remove();
	
	//题目内容信息
	$('#confirmModalVideo').modal({
		 backdrop:'static',
		 keyboard:false,
		 show:true
	});
}

var setupCamera = function()
{
	video = $("#oVideo").get(0),
	videoObj = {
		"video" : true
	};
	
	// Normalizes window.URL
    window.URL = window.URL || window.webkitURL || window.msURL || window.oURL;

    // Normalizes navigator.getUserMedia
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
                           || navigator.mozGetUserMedia || navigator.msGetUserMedia;

	
    var errorCallback = function(error) {
		if (error.name == "PermissionDeniedError"
				|| error.code == "PermissionDeniedError") {
			confirmModalWin("不小心点拒绝了吧。请重新设置浏览器的摄像头访问权限并刷新页面。","确定",null,null,null,0,true,true);
//			alert("不小心点拒绝了吧。刷新一下页面点击允许。");
		} else if (error.name == "DevicesNotFoundError"
				|| error.code == "DevicesNotFoundError") {

			
			if(canWithoutCamera)  //没有摄像头允许考试
			{
				confirmModalWin("哎呀，没检测到你的摄像头，没有摄像头将会影响到你考试的可信度。","已安装摄像头","不安装，继续考试",setupCamera,hiddenCamera,1,true);	
			}
			else
			{
				confirmModalWin("哎呀，考试需要有摄像头，但没检测到你的摄像头，装一个吧！","已安装摄像头",null,setupCamera,null,1,true,true);	
			}
			
		} else {
			//alert("未知错误，请马上联系百一客服。");
		}

		console.log("Video capture error: ", error.name || error.code);
	};
	
	var  successsCallback = function(stream) {
	      video.src = (window.URL && window.URL.createObjectURL) ? window.URL.createObjectURL(stream) : stream;
	      video.play();
	}

	
	try {
        // Tries it with spec syntax
		console.log('----------------11------------------' + navigator.getUserMedia.length);
		console.dir(navigator.getUserMedia);
        navigator.getUserMedia({ video: true }, successsCallback, errorCallback);
        console.log('-----------------22-----------------' + navigator.getUserMedia.length);
      } catch (err) {
        console.log(err);
        // Tries it with old spec of string syntax
        navigator.getUserMedia('video', successsCallback, errorCallback);
      }
      
	$("#oVideo").bind('canplay', function(e) {
		// 可以开始播放了
		checkCandidatePic();
		
		$("#oTipDiv").hide();
	});
}


//正式开始执行代码




//调用外部的方法
//cameraCreateComplete();

//})(jQuery);

