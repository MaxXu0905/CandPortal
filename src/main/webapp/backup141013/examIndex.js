var exam=null;//考试对象
var viewType=null;//视频触发类型
var processguide = {
	isInitGuide : false,
	nextGuide :null
};//流程引导对象
/*封装ajax*/
$(function(){
	$.extend({
		examAjax : function(ajaxObj,isCleanSession){
			var protoajax = ajaxObj;
			if(arguments.length>1 && isCleanSession){
				//处理session
				if(ajaxObj.success){
					var prototypeF =  ajaxObj.success;
					ajaxObj.success = function(result){
						 result = typeof result=='string'?JSON.parse(result):result;
						if(result.code==13){
							$.get(root+'/reCreateSession/'+testID+'/'+passport, function(data) {
								if(data.code==0 && data.data.code=="FINISHEXAM"){
									window.location.href=root+"/examfinish";
								}
								$.ajax(protoajax); 
							});
						}else{
							if(typeof prototypeF=='function'){
								prototypeF(result);
							}
							
						}
					};
				}else{
					ajaxObj.success = function(result){
						result = typeof result=='string'?JSON.parse(result):result;
						if(result.code==13){
							$.get(root+'/reCreateSession/'+testID+'/'+passport, function(data) {
								if(data.code==0 && data.data.code=="FINISHEXAM"){
									window.location.href=root+"/examfinish";
								}
							});
						}
					};
					
				}
			}
				$.ajax(ajaxObj); 
			
				
		}
	});
});
/*发布/订阅模式(观察者模式)
 * zengjie
 * 2014/5/20
 * */

(function($){
	var o = $({}); //创建jquery对象
	//订阅
	$.subscribe = function(){
		o.on.apply(o,arguments);
	};
	//取消订阅
	$.unsubscribe = function(){
		o.off.apply(o,arguments);
	};
	//发布
	$.publish = function() {
		o.trigger.apply( o, arguments );
	};
})(jQuery);

/*倒计时插件*/
(function($){
	var timer,originSecs=0,diffSecs=0,div,$this,$minutes=$('#minutes'),$seconds=$('#seconds');
	var targetTime={};
	$.fn.countDown =  function (options) {
		targetTime.Hours=0;
		targetTime.Minutes=0;
		targetTime.Seconds=0;
		div= $(this)[0];
		$this = $(this);
		startCountDown(options);
		if (options.onComplete)
		{
			$.data(div, 'callback', options.onComplete);
		}
	};
	
	$.fn.setCountDown = function (options) {
		$minutes.empty();
		$seconds.empty();
		if (options.diffSecs)
		{
			originSecs = options.diffSecs;
			diffSecs=options.diffSecs;
			dashChange(diffSecs);
		}
	};
	$.fn.stopCountDown = function () {
		var userTime = originSecs-diffSecs;
		stopCount();
		return userTime;
	};
	$.fn.startCountDown = function (options) {
		div= $(this)[0];
		$this = $(this);
		startCountDown($(this),options);
	};
	function startCountDown (options){
		$this.setCountDown(options);
		timedCount();
		$.data(div,'timer',timer);
	}
	function dashChange(diffSecs){
		if(diffSecs<=10){
			$('#countdown_dashboard').addClass("countdown-closeEnd");
		}else{
			if($('#countdown_dashboard').hasClass("countdown-closeEnd")){
				$('#countdown_dashboard').removeClass("countdown-closeEnd");
			}
		}
		targetTime.Seconds = diffSecs % 60;
		targetTime.Minutes = Math.floor(diffSecs/60)%60;
		targetTime.Hours = Math.floor(diffSecs/60/60)%24;
		targetTime.totalDays = Math.floor(diffSecs/ 60 / 60 / 24);
		if(targetTime.Seconds>=0){
			$seconds.html(targetTime.Seconds);
		}
		if(targetTime.Minutes>0 ){
			$minutes.html(targetTime.Minutes+'<span style="font-size:16px">分</span>');
			$seconds.html(targetTime.Seconds);
		}else{
			$minutes.empty();
		}
	}
	function timedCount()
	{
		timer=setInterval(function(){
			diffSecs--; 
			dashChange(diffSecs);
			if(diffSecs<=0){
				stopCount();
				$.data(div, 'callback')();
				return;
			}
		},1000);
		//timer=setTimeout(timedCount,1000);
	}
	function stopCount()
	{
		if (timer){
			clearInterval(timer);
		}
		targetTime.Hours=0;
		targetTime.Minutes=0;
		targetTime.Seconds=0;
		
	}
})(jQuery);
/***
 * 定义题目模板
 * zengjie
 * 2014/2/20
 */
(function($){
	$(function(){
		exam=exam || new Exam();
		exam.init();
		//设置testId和passport到cookie
	});
	/*构造函数*/
	function Exam(){
		this.hasInterview = false;
		this.examModal = 1;//考试模式，1：正常考试；0：只能试答
		this.$viewbody=$("#viewbody");
		this.$cameraMask=$("#camera-mask0");
		this.$viewFooter=$("#view-footer");
		this.$tryOut = $('#tryout');
		this.$next=$("#next");//下一题
		this.$textarea = $("#text-wrap >textarea");//编辑框
		this.$selectwrap =$("#select-wrap"); //答案模板容器ul
		this.$submitPart = $("#submitPart");//提交该部分
		this.examType="test"; //考试类型：test:试答；formal:正式
		this.samplePart={}; // 试答部分
		this.formalPart={}; //正式部分
		this.CodeMatrix=null;
		this.$codematrix=$("#codematrix");//编辑框容器
	}
	/*扩展行为*/
	Exam.prototype = {
		/*初始化*/
		init : function(){
			window.history.forward(1);
			var _this = this;
			/*1.判断flash插件是否安装*/
			if (!flashChecker()) {
				//如果没有安装flash player，则显示
				document.write('<div id="i-skill-mask0" class="i-skill-mask"></div><div id="js-skill-skillgoLayer" >您没有安装flash player，请点击<a href="https://get.adobe.com/cn/flashplayer/">安装</a></div>');
			}
			/*2.注册订阅*/
			_this.toSubscribe();
			/*3.判断考试时间是否开始*/
			_this.checkExamTime(function(data){
				if(_this.examModal===1){
					//正常答题
					_this.norMalExam();
				}else{
					//只能试答
					_this.sampleExam(data);
				}
				/*加载摄像头*/
				_this.loadCamera();
			});
			/*4.绑定事件*/
			_this.bindEvent();
			/*5.初始化高度*/
			initAnswerHeight();
		},
		/*加载摄像头*/
		loadCamera : function(){
			var _this = this;
			//没有面试题且支持html5加载video标签
			var isHasVideo = understands_video();
			if(_this.hasInterview===false && isHasVideo){
				window.html5Video=true;
				templateRender('camera','html5VideoTmpl');
				initH5Video();
			}else{
				templateRender('camera','videoTmpl');
			}
		},
		/*只有试答*/
		sampleExam : function(data){
			var _this = this;
			//提示评测开始时间的倒计时
			_this.examType="test";
			_this.getSamplePaper(function(){
				//1. 更新通知信息
				_this.updateNotice();
				_this.examType="test";
				window.location.hash="sample";
				_this.loadTestPattern(_this.samplePart);
				//隐藏开始练习，按钮开始考试的字需要改
				_this.$tryOut.hide();
				_this.$submitPart.html("未到考试时间").attr("disabled","disabled");
			});
			//显示距离开始考试倒计时
			_this.showCountDownStart(data.secToEffDate);
		},
		/*正常考试*/
		norMalExam : function(){
			var _this = this;
			_this.cancelShowCountDownStart();
			//判断加载模式
			if(pattern=="sample"){
				_this.examType="test";
			}else{
				_this.examType="formal";
			}
			//1.环境准备生成试卷
			var isRepare=_this.getNormalPaper();
			if(isRepare){
				//1. 更新通知信息
				_this.updateNotice();
				//2.请求坐标
				_this.revertObj = _this.revertPart();
				if(_this.revertObj){
					_this.examType="formal";
					window.location.hash="formal";
				}else{
					_this.examType="test";
					window.location.hash="sample";
				}
				// 初始化编程模板
				//_this.initCodeMatrix(_this.$codematrix);
				//2. 加载模式
				if(_this.examType=="test"){
					_this.loadTestPattern(_this.samplePart);
					window.location.hash="sample";
				}else{
					_this.loadFormalPattern(_this.formalPart);
					window.location.hash="formal";
				}
			}
		},
		/*准备正式考试*/
		repareNormalExam : function(){
			var _this  = this;
			_this.getNormalPaper(function(){
				//显示开始练习，按钮开始考试
				_this.cancelShowCountDownStart();
				_this.$tryOut.hide();
				_this.$submitPart.html('<span class="glyphicon glyphicon-send mr10 f20"></span>开始考试').removeAttr('disabled');
				window.location.hash="formal";
			});
		},
		/*显示距离开始考试倒计时*/
		showCountDownStart : function(secToEffDate){
			var _this = this;
			$('#monitor').hide();
			$('#examStartmonitor').show();
			$('#countdown_dashboard').hide();
			$("#clock").removeClass('clock');
			var countDownStart = $('<div>');
			countDownStart.attr('id','countDownStart');
			countDownStart.appendTo('#clock');
			var countDown = {};
			countDown = transferTime(secToEffDate);
			linkData('#countDownStart','#countDownTmpl',_this,'countDownStart',countDown);
		},
		/*取消显示距离开始考试倒计时*/
		cancelShowCountDownStart : function(){
			var _this = this;
			$('#monitor').show();
			$('#examStartmonitor').hide();
			$("#clock").removeClass('clock').addClass('clock');
			$("#countdown_dashboard").show();
			if($('#countDownStart').length>0){
				$('#countDownStart').remove();
			}
		},
		/*提示考试结束时间*/
		showCountDownStop : function(secToExpDate){
			var _this = this;
			var countDown = {};
			countDown = transferTime(secToExpDate);
			if($("#countDownStop").length>0){
				if(secToExpDate<0){
					countDown.minutes="0分";
				}
				$.publish('updateStopExamTime',countDown);
			}else{
				var countDownStart = $('<div>');
				countDownStart.attr('id','countDownStop');
				countDownStart.appendTo('#operate-wrap');
				countDown.desc="距离测评结束还剩：";
				linkData('#countDownStop','#countDownTmpl',_this,'countDownStop',countDown);
			}
		},
		/*注册事件*/
		toSubscribe : function(){
			var _this = this;
			//轮询检查考试时间
			$.subscribe('toCheckExamTime',function(event,data){
				if(data.secToEffDate && data.secToEffDate>0){
					//1.没到开始时间
					$.publish('updateStartExamTime',data.secToEffDate);
				}else{
					if(_this.examModal!=1){
						_this.repareNormalExam();
					}
					//2.已经到了开始时间,检查结束时间
					if(data.secToExpDate){
						if(data.secToExpDate<=1800){
							_this.showCountDownStop(data.secToExpDate);
						}
						//2.1还没结束，半小时需要提示
						if(data.secToExpDate<0){
							//2.2 考试时间已结束
							$.publish('clearCheckExamTime');//清空轮询
							//启动提示模态，启动模态之前要检查是否允许了摄像头，没允许需要在允许后启动
							$.publish('alertAutoSubmitPaper');
						}
					}
				}
				if(!window.checkExamInterval){
					//没有检查考试时间定时器,1分钟检查一次
					window.checkExamInterval = setInterval(function(){
						_this.checkExamTime();
					},60000);
				}
			});
			$.subscribe('clearCheckExamTime',function(event,data){
				if(window.checkExamInterval){
					clearInterval(window.checkExamInterval);
				}
			});
			$.subscribe('updateStartExamTime',function(event,secToEffDate){
				var data = transferTime( secToEffDate);
				//$.observable(_this.countDownStart).setProperty("seconds",data.seconds); 
				$.observable(_this.countDownStart).setProperty("minutes",data.minutes); 
				$.observable(_this.countDownStart).setProperty("hours",data.hours); 
				$.observable(_this.countDownStart).setProperty("days",data.days); 
			});
			$.subscribe('updateStopExamTime',function(event,data){
				//$.observable(_this.countDownStart).setProperty("seconds",data.seconds); 
				$.observable(_this.countDownStop).setProperty("minutes",data.minutes); 
				$.observable(_this.countDownStop).setProperty("hours",data.hours); 
				$.observable(_this.countDownStop).setProperty("days",data.days); 
			});
			$.subscribe('alertAutoSubmitPaper',function(event,data){
				var interviewFlag= false;
				if(viewType=="MONITOR" || (viewType=="INTERVIEW" && _this.examModal===1)){
					if(examFormal && examFormal.startExamFlag){
						//已经开始考试，交卷
						 interviewFlag =examFormal.submitPaper('auto');
					}
					interview_close();
					if(interviewFlag===false){
						$('#timeoverModal').modal({
							backdrop:'static',
							keyboard:false,
							show:true
						});
					}
				}else{
					exam.nextPublicStep = 'alertAutoSubmitPaper';
				}
			});
		},
		bindEvent : function(){
			var _this=this;
			$(window).resize(function(){
				initAnswerHeight();
			});
			/*1. 清除模态框缓存*/
			 $(document).on('hide.bs.modal', '.modal', function () {
				  $(this).removeData("bs.modal");
			  });
			//2.绑定确认模态框
	    	$("#alertBtn").on("click",function(){
	    		var isSucess = false;
    			  $.get(root+'/reCreateSession/'+testID+'/'+passport, function(data) {
    				  if(data.code==0 && data.data.code=="FINISHEXAM"){
    						window.location.href=root+"/examfinish";
    				 }
   				   if(_this.examType=="test" ){
   		    			//1.卸载试答模式
   					   _this.examType=null;
   		    			_this.unloadTestPattern();
   						//2.加载正式模式
   						_this.loadFormalPattern(_this.formalPart);
   					     $('#alertModal').modal('hide');
   					  isSucess = true;
   		    		}  
   			
   			   	}).fail(function(jqXHR, textStatus) {$("#alertBtn").html('网络或服务端异常,请稍后再试');})
   			  .always(function() {
	   			  if(isSucess===true){
	   				$("#alertBtn").html('确定');
	   			  }else{
	   				$("#alertBtn").html('网络或服务端异常,请稍后再试');
	   			  }
   			  });
			 
				return false;
			});
	    	$('#timeOverBtn').on('click',function(){
	    		completeExam();
//	    		if(examFormal && examFormal.startExamFlag){
//					//已经开始考试，交卷
//					examFormal.gameover();
//				}else{
//					//未开始考试,不用交卷
//					completeExam();
//				}
	    	});
		    $("#closeWindow").on("click",function(){closeWindow();});
		},
		/*更新通知信息*/
		updateNotice : function(){
			var _this = this;
			var notice ={};
			var total =_this.examTotalTime?_this.examTotalTime:0;
			var part =0;
			var partTimeStr ="";
			for(var i in _this.formalPart){
				part++;
				//total+=Math.round(_this.formalPart[i].suggestTime/60);
				if(i< _this.formalPart.length-1){
					partTimeStr+=_this.formalPart[i].partDesc+"("+_this.formalPart[i].questionLength+")道、";
				}else{
					partTimeStr+=_this.formalPart[i].partDesc+"("+_this.formalPart[i].questionLength+")道，";
				}
			}
			notice.total=total;
			partTimeStr+="合计约需"+total+"分钟；";
			notice.part = part;
			notice.partTimeStr=partTimeStr;
			var template = $.templates("#noticeModel");
			template.link("#alertmmsg",notice);
		},
		/*检查答题开始时间*/
		checkExamTime : function(callBack){
			var _this = this;
			var url = convertURL(root+"/exam/getInvitationTimeInfo");
			$.get(url,function(result){
				if(result.code == 0 && result.data){
					$.publish('toCheckExamTime',result.data);
					if(result.data.secToEffDate && result.data.secToEffDate>0){
						//未开始考试，只能试答
						_this.examModal = 0;
					}else{
						//已经开始考试
						_this.examModal = 1;
					}
					if(callBack && typeof callBack=="function"){
						callBack(result.data);
					}
				}
			});
		},
		/*获取试答试卷*/
		getSamplePaper : function(callBack){
			var _this = this;
			$.ajax({
				  async: false,
				  type: "POST",
				  url: root+"/exam/getTestInfo",
				  success: function(result){
					  if(result.code=="0"){
							if(result.data.partDatas){
								//遍历题型，默认前2个是试答题型，后面为正式题型
								var partdata = result.data.partDatas;
								var samplePart = [];
								if(partdata[i].partSeq==12){
									_this.hasInterview = true;
								}
								for(var i  in partdata){
										samplePart.push(partdata[i]);
								}
								_this.samplePart=samplePart;
								if(callBack && typeof callBack=="function"){
									callBack();
								}
							}
						}else if(result.code==12){
							window.location.href=root+"/goToError";
							return false;
						}
				  },
				  error :function(result){
						window.location.href=root+"/error";
						return false;
				  }
				});
		},
		/*获取正式考试试卷，准备环境*/
		getNormalPaper:function(callBack){
			var _this = this;
			var flag = false;
			$.ajax({
				  async: false,
				  type: "POST",
				  url: root+"/exam/getInfo",
				  success: function(result){
					  if(result.code=="0"){
						  if(result.data.totalTime){
							  _this.examTotalTime = result.data.totalTime?result.data.totalTime:0;
						  }
							if(result.data.partDatas){
								//遍历题型，默认前2个是试答题型，后面为正式题型
								var partdata = result.data.partDatas;
								var samplePart = [];
								var formalPart = [];
								for(var i  in partdata){
									if(partdata[i].partSeq==12){
										_this.hasInterview = true;
									}
									if(partdata[i].partSeq>20){
										samplePart.push(partdata[i]);
									}else{
										formalPart.push(partdata[i]);
									}
								}
								_this.samplePart=samplePart;
								_this.formalPart=formalPart;
								flag = true;
							}
							if(callBack && typeof callBack=="function"){
								callBack();
							}
						}else if(result.code==12){
							window.location.href=root+"/goToError";
							return false;
						}
				  },
				  error :function(result){
						window.location.href=root+"/error";
						return false;
				  }
				});
			return flag;
		},
		/*还原部分*/
		revertPart : function(){
			var obj =null;
			$.ajax({
				async : false,
				cache : false,
				url:root+"/exam/getCandidateExamInfo",
				success : function(result){
					if(result.code=="0"){
						if(result.data){
							if(result.data.partSeq){
								//还原部分
								obj=result.data;
							}
						}
					}else if(result.code==12){
						window.location.href=root+"/goToError";
						return false;
					}
				},error : function(){
					window.location.href=root+"/error";
					return false;
				}
			});
			return obj;
		},
		/*获取剩余时间*/
		getSpareTime : function(spare){
			$.getJSON(root+"/exam/getTimeLeft/1",function(data){
				
			});
		},
		/*加载题干
		loadQuestionHead:function(){
			var _this = this;
			if(_this.examType=="test"){
				examTest.initQuestionHead();
			}else{
				examFormal.initQuestionHead();
			}
		},*/
		/*加载试答模式*/
		loadTestPattern : function(obj){
			if(examTest){
				exam.examType="test";
				examTest.init(obj);
				//显示开始练习，按钮开始考试
				//_this.$tryOut.show();
				//_this.$submitPart.html('<span class="glyphicon glyphicon-send mr10 f20"></span>开始考试').removeAttr('disabled');
			}
		},
		/*卸载试答模式*/
		unloadTestPattern : function(){
			//1.删除对象
			examTest=null;
			//delete examTest;
			//2.remove对象
			$("#tryout").remove();
			$("#recovery-answer").remove();
			//3.解除所有绑定
			var _this = this;
			_this.unbindTestEvent();
			_this.unloadTestStyle();
		},
		unbindTestEvent : function(){
			var _this = this;
			_this.$textarea.off("change");
			_this.$selectwrap.off("click","li >a");
			_this.$next.off("click");
			 _this.$submitPart.off("click");
			 $("#tryout,#gameover").off("click");
		},
		unloadTestStyle : function(){
			$('#questionHead').removeClass('pull-left').css('width','100%');
			 interview_close();
			 getSWF("VideoOper").setCameraType('MONITOR');
			 $("#submitPart").html('提交该部分');
			 $('#guide').remove();
		},
		/*加载正式答题模式*/
		loadFormalPattern : function(obj){
			var _this = this;
			if(examFormal){
				_this.examType="formal";
				examFormal.init(obj);
				if(recodeException && recodeException.totalLeaveTimes==0 && viewType=="MONITOR"){
					recodeException.init();
				}
			}
			_this.$tryOut.hide();
			_this.$submitPart.html('提交部分').removeAttr('disabled');
		},
		/** 初始化编程插件，仅在页面加载的时候执行一次 */
		initCodeMatrix : function($place, funct) {
			var _this =this;
			$LAB.script(root + "/common/utils.js",root + "/plugin/codematrix/lib/codemirror-3.21/lib/codemirror.js")
			.wait()
			.script(root + "/plugin/codematrix/plugin/matrix-active-line.js") // 当前行高亮
			.script(root + "/plugin/codematrix/lib/codemirror-3.21/addon/edit/closebrackets.js") // 括号补全
			.script(root + "/plugin/codematrix/lib/codemirror-3.21/addon/edit/matchbrackets.js") // 括号高亮匹配
			.wait()
			.script(root + "/plugin/codematrix/lib/codematrix.js") //
			.wait(function() {
				_this.CodeMatrix = CodeMatrix($place.get(0));
				funct();
			});
		}
		
	};
	
})(jQuery);
/**答题页面公用函数*/

/*渲染模板
 * htmlId:html容器id
 * tempId:tempId容器id
 * */
function templateRender(htmlId,tempId,data){
	var htmlOutput = $("#"+tempId).render(data);  
	$("#"+htmlId).html(htmlOutput); 
}
/*渲染模板link
 * htmlId:html容器id
 * tempId:tempId容器id
 * */
function templateLink(htmlId,tempId){
	var template = $.templates("#"+tempId);
	template.link("#"+htmlId);
}
/*link数据*/
function linkData($wrap,$model,obj,objName,data){
	if(obj[objName]){
		if($.isArray(data)){
			$.observable(obj[objName]).refresh(data);
		}
	}else{
		obj[objName] = obj[objName] || {};
		obj[objName] = data;
		var tmpl = $.templates($model);
		tmpl.link($wrap,obj[objName]);
	}
}
/*弹出确认框
 * msg:消息
 * type:提示类型：1：未答完；2：答完了;3:交卷
 * */
function confirmBox(msg,type){
	//启动模态框
	if(type==2){
		//改变按钮
		$("#confirmbtn").html("继续答题");
		$("#cancelbtn").html("暂不答题");
		$("#confirmbtn").data("active",2);
		$('#confirmModal .close').remove();
		//$("#confirmbtn").removeClass("active1").addClass("active2");
	}else{
		$("#confirmbtn").html("确定");
		$("#cancelbtn").html("取消");
		if(type==1){
			$("#confirmbtn").data("active",1);
			//$("#confirmbtn").addClass("active1");
		}else if(type==3){
			$("#confirmbtn").data("active",3);
			//$("#confirmbtn").removeClass("active1").addClass("active3");
		}
	}
	//添加信息
	var a ="<p>"+msg+"</p>";
	$("#confirmmsg").html(a);
		$('#confirmModal').modal({
		     backdrop:'static',
		     keyboard:false,
		     show:true
		});
}
/*
 *弹出提示框
 * msg:消息
 * type:提示类型：1：默认；2：提示;
 * */
function alertBox(){
	//启动模态框
	exam.updateNotice();
	$('#alertModal').modal({
		     backdrop:'static',
		     keyboard:false,
		     show:true
	 });
}
//session失效提示
function alertSessionInvalid(obj,index,param){
	$.get(root+'/reCreateSession/'+testID+'/'+passport, function(data) {
		if(data.code==0 && data.data.code=="FINISHEXAM"){
			window.location.href=root+"/examfinish";
		}
		obj.getQuestionByIndex(index,param);
	});
}
//视频关闭
function interview_close(){
	$("#view-footer").remove();
	$("#camera-mask0").remove();
	$("#camera").css({"position":"static","z-index": "0"});
	 $(window).off("scroll");
	$("#viewbody").removeClass("view-model").offset({top:-1000,left:0});
}
//视频打开
function interview_open(){
	exam.$viewbody.removeClass("view-model");
	exam.$cameraMask.remove();
	exam.$viewFooter.remove();
}

//面试下一题
function interview_next(){
	examFormal.aotoGoNext();
}

//开始面试题计时
function startInterviewTime(){
	examFormal.startTimeCount();
}

//停止面试题计时
function stopInterviewTime(){
	examFormal.stopCountTime();
}
//linmy 2014年2月25日添加 start
//判断页面是否安装flash player
function flashChecker() {
	var hasFlash = false; // 是否安装了flash
	var swf=null;
	if (document.all) {
		try {
			swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
			if (swf) {
				hasFlash = true;
			}
		} catch (e) {
		}
	} else {
		if (navigator.plugins && navigator.plugins.length > 0) {
			swf = navigator.plugins["Shockwave Flash"];
			if (swf) {
				hasFlash = true;
			}
		}
	}
	return hasFlash;
}


//跳转错误
function goError(){
	window.location.href=root+"/goToError";
	return false;
}

//视频最小化
function viewWindowMin(){
		viewType="MONITOR";
		var isGuide = true;
		//1.判断是否有待处理的步骤
		if(	exam.nextPublicStep ){
			try{
				$.publish(exam.nextPublicStep);
				if(exam.nextPublicStep=="alertAutoSubmitPaper"){
					isGuide = false;
				}
				exam.nextPublicStep=null;
			}catch(e){
				throw e.message;
		    }
			
		}else{
			//2.最小化
			/*if(!exam.revertObj){
				 interview_close();
			}*/
			 interview_close();
			 if( examFormal.getSuggesTime()>0){
				  if(examFormal.countTimeType==1){
					  examFormal.resetCutDown(examFormal.getSuggesTime(),1); 
				  }else if(examFormal.countTimeType==2){
					  examFormal.resetCutDown(examFormal.getSuggesTime(),2); 
				  }
				//记录开始时间
				  examFormal.counTime=0;
				  examFormal.timedCount();
				  examFormal.$countdown.removeClass("hidden");
			  }
		}
	    //3.试答：初始引导；正式：初始化离开次数
	 	try{
	 		if(exam.examType=="test"){
	 			//初始引导，todo
	 			if(isGuide===true){
	 				initGuide();
	 			}
	 			getSWF("VideoOper").setCameraType('HIDDEN');//练习的时候不监控
	 		}else{
	 			if(recodeException && recodeException.totalLeaveTimes==0){
					recodeException.init();
				}
	 		}
	 	}catch(e){
	 		throw e.message;
	 	}
	}

//resize 变更相应的高度
function setTitleHeight(_titleHeight)
{
	//set height here
	 $(getSWF("TitleSet")).attr("height",_titleHeight); 
	//other code
}

//得到相应的swf文件
 function getSWF(name){
	 if(window.html5Video){
		 return window;
	 }
     var e=document.getElementById(name);
     return (navigator.appName.indexOf("Microsoft") != -1)?e:e.getElementsByTagName("embed")[0];
}
 
 //linmy 2014年2月25日添加 end
 function stopDefault(e){
	    if(e && e.preventDefault){
	        e.preventDefault();
	    }else{
	        window.event.returnValue = false;
	    }
	}
//关闭页面并且清除缓存
function closeWindow(){
	window.opener = null;
    window.open(root+"/clearSession", '_self');
    window.close();
}
//重新登录
function relogin(){
	return root+'/reCreateSession/'+testID+'/'+passport;
}
/**
 * 适配器模式
 * 转换题型容器
 * typeIndex 1:单选；2：多选；3：编程；4：文本；5：单选文本；6：多选文本；7：面试
 */
function trasferQuestionWrap(typeIndex){
	var type=null;
	switch (typeIndex){
		case 1:
			type = "singleSelect";
			break;
		case 2:
			type = "multiSelect";
			break;
		case 3:
			type = "program";
			break;
		case 4:
			type = "textarea";
			break;
		case 5:
			type = "singleSelectText";
			break;
		case 6:
			type = "multiSelectText";
			break;
		case 7:
			type = "interview";
			break;
	}
	
	return type;
}
/*初始引导*/
function initGuide(){
	if(viewType!="MONITOR"){
		return false;
	}
	//有模态框，不引导
	if($('#timeoverModal').is(':visible')){
		return false;
	}
	var option={
				title : "练习环节"	,
				place :'',
				nextBtn : 'guidetextbtn',
				step:['这里是练习环节。<br>我叫小招，欢迎来到百一测评。<br>你可以点击右上角的X关闭我，一旦关闭将结束引导。',
					  '试卷中一旦出现时钟，表示这道题是计时的，时钟的倒计时是这道题的作答限时，抓紧时间答题哦']
			};
	$("#guide-popover").guidePopover(option);
	processguide.isInitGuide= true;
}
/*编程引导*/
function initProgramGuide(){
	processguide.nextGuide=null;
	var eles = exam.CodeMatrix.getEles();
	var option={
			isMark: false,
			place :'up',
			title : ['注意哦！','小心点哦！','其他工具','测试运行'],
			nextBtn : 'guidetextbtn',
			offset :[{"ele":eles.$mirror,'highLight':true,ratio:{widthRatio:0.5,heightRatio:0.5}},
			         {"ele":eles.$templateBtn,'highLight':true},
			         {"ele":eles.$helpBtnGroup,'highLight':true},
			         {"ele":eles.$testBtn,'highLight':true}
			        ],
			step:['你可以在指定的方法里编写代码，并返回结果。但请不要更改给定的代码，否则无法编译。',
				  '如果不小心改了给定的代码，你可以点击这里，复制代码到代码编辑区域。',
				  '这里还提供了一些工具，可以搜索API、格式化、全屏。',
				  '你可以点击【运行】，对你的代码进行编译运行，并在控制台上看到代码的运行结果。开始练习吧！']
	};
	$("#guide-popover").guidePopover(option);
}
/*查浏览器*/
function getBrowserName(){
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
	    browserMark='unknown';
	}
    return browserMark;
}
function initAnswerHeight(){
	var headHeight = $('#header').innerHeight();
	var keyword =$('#keyword').innerHeight();
	var windowHeight =$(window).innerHeight();
	$('#exam-answer').css('max-height',windowHeight-keyword-headHeight);
}

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

function completeExam()
{
	modalWaiting.hide();
	examFormal.completeExam();
}
/*时间转换,只计算到分钟*/
function transferTime(diffSecs){
	var secToEffDate = {};
	if(diffSecs>=0){
		var time="";
		//var seconds = diffSecs % 60;
		var minutes = Math.ceil(diffSecs/60)%60; //因为计算到分，要四舍五入
		var hours = Math.floor(diffSecs/60/60)%24;
		var day = Math.floor(diffSecs/60/60/24);
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
/*
 * 检查是否支持video
 * */
function understands_video() {
	  //return !!document.createElement('video').canPlayType; // boolean
	return isSupportH5Video();
};