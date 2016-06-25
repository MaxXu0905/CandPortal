

var setupCamera = function()
{
	video = $("#oVideo").get(0),
	videoObj = {
		"video" : true
	};
	errBack = function(error) {
		if (error.name == "PermissionDeniedError"
				|| error.code == "PermissionDeniedError") {
			alert("不小心点拒绝了吧。刷新一下页面点击允许。");
		} else if (error.name == "NotSupportedError"
				|| error.code == "NotSupportedError") {

			if(canWithoutCamera)  //没有摄像头允许考试
			{
				confirmModalWin("哎呀，没检测到你的摄像头，没有摄像头将会影响到你考试的可信度。","已安装摄像头","不安装，继续考试",setupCamera,hiddenCamera,1,false);	
			}
			else
			{
				confirmModalWin("哎呀，考试需要有摄像头，但没检测到你的摄像头，装一个吧！","已安装摄像头",null,setupCamera,null,1,false,false);	
			}
			
		} else {
			alert("未知错误，请马上联系百一客服。");
		}

		console.log("Video capture error: ", error.name || error.code);
	};
	// Put video listeners into place
	if (navigator.getUserMedia) { // Standard
		navigator.getUserMedia(videoObj, function(stream) {
			video.src = stream;
			video.play();
		}, errBack);
	} else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
		navigator.webkitGetUserMedia(videoObj, function(stream) {
			video.src = window.webkitURL.createObjectURL(stream);
			video.play();
		}, errBack);
	} else if (navigator.mozGetUserMedia) { // WebKit-prefixed
		navigator.mozGetUserMedia(videoObj, function(stream) {
			video.src = window.URL.createObjectURL(stream);
			video.play();
		}, errBack);
	}

	$("#oVideo").bind('canplay', function(e) {
		// 可以开始播放了
		alert("ohye");
	});
}


//正式开始执行代码

setupCamera();


//调用外部的方法


//})(jQuery);

