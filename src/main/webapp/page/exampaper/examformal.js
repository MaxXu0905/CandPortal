var examFormal,recodeException;
var submitPart = false,isGameOver=false;
var modalWaiting = {
		$modalHint : $('#modal_waiting'),
		$spinner : $('#modal_waiting .spinner'),
		init : function() {
			var _this = this;

			this.$modalHint.modal({
				backdrop : 'static',
				keyboard : false,
				show : false
			});

			this.$modalHint.on('shown.bs.modal', function(e) {
				_this.$spinner.spin({
					corners : 1,
					direction : 1,
					hwaccel : false,
					length : 15,
					lines : 12,
					radius : 20,
					rotate : 0,
					shadow : false,
					speed : 1,
					trail : 61,
					width : 8,
					left : 150,
					top : -40
				});
			});

			this.$modalHint.on('hide.bs.modal', function(e) {
				_this.$spinner.spin(false);
			});

		},
		show : function(title) {
			this.$modalHint.find('.title').text(title);
			this.$modalHint.modal('show');
		},
		hide : function() {
			this.$modalHint.modal('hide');
		},
		title : function(title) {
			this.$modalHint.find('.title').text(title);
		}
	};

modalWaiting.init();
/**
 * 记录异常情况
 * zengjie
 * 2014/5/8
 * */
(function($){
	$(function(){
		recodeException = new RecodeException();
	});
	//记录异常构造函数
	function RecodeException(){
		this.startStr = 0;//记录离开次数
		this.totalLeaveTimes=0; //配置的可离开次数
		this.currentKeyCode=-1; //按键code
		this.clientY = -1; //鼠标位置
		this.altkey=false; //是否按下alt按键
		this.rightKey=false; //是否按下右键
		this.listernType=null; //监听事件类型
		this.freshTimes=0; //监听事件类型
	}
	RecodeException.prototype = {
		/*初始化*/
		init : function(){
			if(debug===true){
				return false;
			}
			var _this = this;
			_this.getSwitchTimesConfig();
			_this.bindEvent();
		},
		/*获取切换次数配置信息*/
		getSwitchTimesConfig : function(){
			var _this = this;
			var url =  convertURL(root+'/exam/getSwitchTimesConfig'); 
			$.getJSON(url,function(result){
				if(result && result.code==0 && result.data.configSwitchTimes){
					_this.totalLeaveTimes =result.data.configSwitchTimes;
				}
				if(result && result.code==0 && result.data.switchTimes){
					_this.startStr =result.data.switchTimes;
					if(_this.startStr>_this.totalLeaveTimes){
						_this.recodeLeave(); 
						return false;
					}else{
						$("#leaveTimes-temp").hide();
					}
				}
			});
		},
		/*绑定事件*/
		bindEvent : function(){
			var _this = this;
			if (window.ActiveXObject && /MSIE/.test(navigator.userAgent)) { 
				 //IE  
				 $('body').on("focusout", function (event) {
					 if(!document.hasFocus()){
						_this.updateSwitchTimes();
					 }
			    });
			 }else{
				 $(window).blur(function(e){
					 _this.updateSwitchTimes();
				});
				
			 }
			$(window).keydown(function(){
				_this.altkey = event.altKey;
				_this.currentKeyCode = event.keyCode;
			});
			$(document).on("contextmenu",function(e){
				_this.rightKey =true;
				$(window).mousemove(function(e){
					_this.clientY = e.clientY;
				});
			});
			window.onbeforeunload = function(event) {   
				   return _this.isReloadOrClose(event);
			 }; 
			
			$(document).on("click","#endExam",function(){
				$("#leaveTimes-temp").empty();
				examFormal.gameover();//交卷
				//closeWindow();
			});
			$(document).on("click","#goOnExam",function(){
				$("#leaveTimes-temp").hide();
			});
		},
		/*离开提示*/
		recodeLeave : function(){
			//判断是否显示交卷窗口
			var _this = this;
			if(!_this.switchTimesFilter()){
				return;
			}
			var $title=$("#leaveTimes-title");
			var $msgbody = $("#leaveTimes-body");
			var $msg = $("#leaveTimes-msg");
			var $goOnExam = $("#goOnExam");
			var $endExam = $("#endExam");
			var leaveAlertMsg = "为了避免影响您的成绩，请谨慎作答。";
			var $alertmsg = $("#leaveTimes-alertmsg");
			var times = _this.startStr>_this.totalLeaveTimes?_this.totalLeaveTimes:_this.startStr;
			var warnClass="l_t warn_"+(times>5?5:times);
			var alertmsg="";
			if(_this.startStr>=_this.totalLeaveTimes){
				$title.empty();
				alertmsg="您已经离开本页面"+_this.totalLeaveTimes+"次，不能继续考试了";
				$msgbody.removeClass().addClass(warnClass);
				$msg.html(alertmsg);
				$alertmsg.empty();
				$goOnExam.hide();
				$endExam.removeClass("hidden").show();
				//todo 如果是面试题需要中断面试
				if(examFormal.questionTypeName== "interview"){
					//1.停止倒计时
					examFormal.stopCutDown();
					getSWF("VideoOper").stopClick();
				}
			}else{
				//渲染选择题模板
				var alerttitle="您已经离开本页面"+_this.startStr+"次";
				alertmsg="离开页面超过"+_this.totalLeaveTimes+"次将不能继续考试，并<br />且离开次数将会呈现在您的测评报告中";
				$title.html(alerttitle);
				$msgbody.removeClass().addClass(warnClass);
				$msg.html(alertmsg);
				$alertmsg.html(leaveAlertMsg);
				$goOnExam.removeClass("hidden");
				if($endExam.is(':visible')){
					$endExam.hide();
				}
				
			}
			$("#leaveTimes-temp").removeClass("hidden").show();
		},
		/*离开的过滤*/
		switchTimesFilter : function(){
			var _this = this;
			//初始值
			/*if(_this.startStr == 0){
				return;
			}*/
			//F5过滤
			if(_this.currentKeyCode == 116){
				return false;
			}
			if(isGameOver){
				return false;
			}
			//确认模态
			if($('#confirmModal').is(':visible')){
				return false;
			}
			//提示模态
			if($('#alertModal').is(':visible')){
				return false;
			}
			if($('#timeoverModal').is(':visible')){
				return false;
			}
			//交卷
			if($("#gameOverArea").is(':visible')){
				return false;
			}
			//离开
			if($("#leaveTimes-temp").is(':visible')){
				return false;
			}
			return true;
		},
		/*更新切换次数+1*/
		updateSwitchTimes : function(){
			var _this = this;
			//过滤
			if(!_this.switchTimesFilter()){
				return;
			}
			var url =  convertURL(root+"/exam/updateSwitchTimes"); 
			var data = {"partSeq":examFormal.partSeq,"questionId":examFormal.questionId};
			$.ajax({
				async :false,
				type : "POST",
				url : url,
				dataType :"json",
				contentType : "application/json",
				data:JSON.stringify(data),
				success : function(result){
					if(result &&  result.code==0 && result.data && result.data.code=='SUCCESS' && result.data.times){
						_this.startStr =result.data.times;
						 _this.recodeLeave();
					}
				}
			});
		},
		/*更新刷新次数+1*/
		updateFreshTimes : function(){
			var _this = this;
			$.ajax({
				async :false,
				url : root+"/exam/updateFreshTimes",
				success : function(result){
					if(result &&  result.code==0 && result.data  && result.data.times){
						_this.freshTimes =result.data.times;
					}
				}
			});
		},
		/*判断是刷新还是关闭*/
		isReloadOrClose : function(event){
			var msg=null,_this=this;
			if(_this.rightKey && -1<_this.clientY  && _this.clientY<8 ){
				_this.rightKey = false;
			}
			   if (_this.currentKeyCode == 116 || _this.rightKey) {
				   _this.updateFreshTimes();
				   //116:F5
				   if(_this.currentKeyCode == 116){
					  // msg = "刷新窗口!(F5)"; 
					   _this.currentKeyCode =-1;
				   }
				   if(_this.rightKey){
					  // msg = "右键刷新窗口!"; 
					   _this.rightKey = false;
				   }
				   _this.listernType ="reload";
			   }else{
				  // msg = "点击关闭窗口";
				   _this.listernType ="close";
				   if ((_this.altkey || _this.currentKeyCode == 18) || (_this.currentKeyCode == 115) ){
					 //  msg = "关闭窗口!(alt+F4)";
					   _this.altkey = false;
				   } 
				   if(_this.currentKeyCode == 91){
					 //  msg = "Mac关闭窗口!(commad)";
					   _this.currentKeyCode = -1;
				   }
				   //startStr ++;
				   if(!submitPart){
					   //提交部分不算
					   _this.updateSwitchTimes();
				   }
				  
			   }
		}
	};
})(jQuery);
/*end 记录异常情况*/

/***
 * 定义题目模板
 * zengjie
 * 2014/2/20
 */
(function($){
	/*构造函数*/
	$(function(){
		examFormal = new ExamFormal();
	});
	/*构造函数*/
	function ExamFormal(){
		/*按钮*/
		this.$examAnswer =$('#exam-answer');
		this.$examAnswerMask =$('#exam-answer-mask');
		this.$spinner =$('#exam-mask-spinner');
		this.$spinnerTitle =$('#exam-mask-title');
		this.$cameraMask =$('#camera-mask0');
		this.$questionWrap=$('#question-wrap');
		this.$anserHead=$('#anserHead');
		this.$questionIndex=$('#questionIndex');
		this.$questionLength=$('#questionLength');
		this.$questionHead=$("#questionHead");
		this.$keyword=$('#keyword');
		this.$countdown=$("#countdown-area"); //倒计时
		this.$selectwrap =$("#select-wrap"); //选择题答案模板容器ul
		this.$codematrix=$("#codematrix");//编程容器
		this.$textwrap = $("#text-wrap");//编辑框容器
		this.$textarea = $("#text-wrap >textarea");//编辑框
		this.$interviewWrap=$("#interview-wrap");//视频框
		this.$next=$("#next");//下一题
		this.$prev=$("#prev");//下一题
		this.$submitPaper = $("#submitPaper");//交卷
		this.$submitPart = $("#submitPart");//提交该部分
		this.$countdown=$('#countdown_dashboard');
		/*属性*/
		this.isGotoNext = false;
		this.timeOverType=1;//时间停止后的处理类型 1：停止答题；2：面试计时；3：提交部分；4：交卷
		/*题目对象属性*/
		this.partSeq=null;//当前题型 seq;
		this.partDesc=null;//题型描述：选择题，编程题，附加题，面试题
		this.partIndex=1;//当前部分 1:第一部分 2:第二部分...
		this.questionIndex=1;	//当前题标
		this.questionId=0;//当前题号
		this.nextQuestionId=0;//下一题号
		this.prevQuestionId=0;//上一题号
		this.questionTypeName=null;//当前题类型名称
		this.wrapType = false;
		this.answer="";//当前答案
		this.answerHtml=null;
		this.formalPart={};
		this.revertObj=null;
		this.counTime = 0;
		this.stopTimeCount=null;
		this.alertMsg="";
		var fileName=null,content=null; //文件名,文件 
		/*设置fileName*/
		this.setFileName = function(filename){
			fileName = filename;
		};
		this.getFileName = function(){
			return fileName;
		};
		/*设置content*/
		this.setContent = function(cont){
			content = cont;
		};
		this.getContent = function(){
			return content;
		};
		/*单独答题设置时间*/
		var suggestTime=null;
		this.setSuggestTime = function(time){
			suggestTime = time;
		};
		this.getSuggesTime = function(){
			return suggestTime;
		};
		this.$openQuestionPanel=$("#openQuestionPanel");//打开答题面板
	}
	/*扩展行为*/
	ExamFormal.prototype = {
		/*初始化*/
		init : function(obj){
			exam.examType="formal";
			window.location.hash="formal";
			$.get(convertURL(root+"/exam/startExam"),function(){
				_this.startExamFlag = true;
			});
			var _this = this;
			//1.获取试卷信息
			_this.formalPart=obj;
			//加载考试模式
			_this.loadExamType();
			//2.获取还原对象	
			_this.revertObj = exam.revertObj;
			//3.订阅
			_this.toSubscribe();
			//3.初始化样式
			_this.initStyle();
			//4.判断是否需要恢复记录
			if(_this.revertObj){
				_this.revertStep(_this.revertObj.partIndex);
				//还原部分
				$.publish("loadRevert",_this.revertObj);
			}else{
				//开始答题
				_this.revertStep(1);
			}
			//4.绑定页面事件
			_this.bindEvent();
			
			_this.operateOffset=$('#operate-wrap').offset();
		},
		/*加载考试模式*/
		loadExamType : function(){
			var _this = this;
			//部分计时渲染题板
			if(examTimeType===1){
				_this.$prev.remove();
				_this.$openQuestionPanel.remove();
			}
			if(examTimeType===2){
				// 1. 部分计时的样式
				_this.$prev.show();
				_this.$openQuestionPanel.show();
			}
		},
		/*渲染题目面板*/
		renderQuestionPanel : function(index){
			//index从1开始
			var _this = this;
			if(_this.formalPart[index-1].partSeq==12){
				//面试题是否需要特殊处理？
				_this.timeOverType=2;
			}
			if(examTimeType===2){
				if(_this.questionIndex==1){
					_this.$prev.hide();
				}
				_this.timeOverType=3;
				$('#examTimeAlert').html(_this.formalPart[index-1].partDesc+"部分");
				if(_this.revertObj!=null && _this.revertObj.timeLeft!=null){
					_this.setSuggestTime(_this.revertObj.timeLeft);
					_this.revertObj.timeLeft=null;//只有刷新后的第一次加载用timeleft,之后变换部分要取原定时间
				}else{
					var timeLeft = _this.formalPart[index-1].suggestTime;
					_this.setSuggestTime(timeLeft);
				}
				if(viewType){
					//如果加载了摄像头
					_this.resetCutDown(_this.getSuggesTime(),_this.timeOverType); 
				}else{
					_this.initCutDown(_this.getSuggesTime());
					if(_this.revertObj!=null && _this.revertObj.timeLeft==0){
						exam.nextPublicStep="aotoSubmitPart";
					}
				}
				linkData('#questionPanel','#questionPanelTmpl',_this,'questionPanel',_this.formalPart[index-1]);
				$('#'+_this.questionId).addClass('currentAnswer');
			}else{
				$('#examTimeAlert').empty();
			}
		},
		/*开始计时*/
		toCountDown : function(suggestTime){
			var _this = this;
			//1. 检查计时模式
			if(examTimeType===1){
				_this.timeOverType=1; //时间到就停止答题
				//1.单题计时,取单题推介时间suggestTime
				if(suggestTime>0){
					_this.setSuggestTime(suggestTime);
				}
				//2.检查摄像头是否已加载
				if(viewType){
					//摄像头已经加载
					  _this.resetCutDown(_this.getSuggesTime(),_this.timeOverType); 
				}
			}else if(examTimeType===2){
				_this.timeOverType=3; //时间到就提交部分
				//2.部分计时,取_this.revertObj.timeLeft
				if(_this.$countdown.data('timer')!==undefined){
					//计时
					_this.startCutDown();
				}
			}
		},
		/*绑定事件*/
		bindEvent : function(){
			var _this = this;
			$(document).on('hide.bs.modal', '.modal', function () {
				  $(this).removeData("bs.modal");
				// window.isModal = true;
			});
			//1.绑定记录答案
			_this.$textarea.on("change",function(){
				_this.answerHtml = $(this).val();
				_this.answer = $(this).val();
				var current = $("#"+_this.formalPart[_this.partIndex-1].partSeq+"que > a[class^=numb_bg4]");
				if(_this.answer ){
					 current.attr("data-isAnswered",1);
				}else{
					 current.attr("data-isAnswered",0);
				}
			});
		
			//4.绑定答题
			_this.$selectwrap.on("click","li >a",function(e) {
			 	stopDefault(e);
			 	if($(this).hasClass("disabled")){
			 		return;
			 	}
			 	if(_this.wrapType=='singleSelect'){
			 		_this.dealSingleSelect($(this), e);
			 	}else if(_this.wrapType=='multiSelect'){
			 		_this.dealMuiltSelect($(this), e);
			 	}else if(_this.wrapType=='singleSelectText'){
			 		_this.dealSingleSelectText($(this), e);
			 	}else if(_this.wrapType=='multiSelectText'){
			 		_this.dealMuiltSelect($(this), e);
			 	}
			 	return false;
			});
			//5.绑定下一题
		   _this.$next.on("click",function(e){
			   if(_this.nextFirstClick==='undefied'){
				   _this.nextFirstClick=true;
			   }else{
				   _this.nextFirstClick=false;
			   }
			  	$('button[questionId]').removeClass('currentAnswer');
			   	stopDefault(e);
			   _this.gotoNext();
			   return false;
			 });
		   //绑定上一题
		   _this.$prev.on('click',function(event){
			   event.preventDefault();
			  	$('button[questionId]').removeClass('currentAnswer');
			   _this.gotoPrev();
			   return false;
		   });
			//6.绑定提交部分
		   _this.$submitPart.on("click",function(e){
				stopDefault(e);
				//停止倒计时
				_this.stopCutDown();
			   $(this).attr("disabled","disabled");
			   //判断是否最后一种类型
	   			if(_this.currenttype>=_this.formalPart.length){
	   			}else{
	   			  _this.submitPart(_this.currenttype);
	   			}
	   		  $(this).removeAttr("disabled");
	   		return false;
		   });
		
		   _this.$submitPaper.on("click",function(e){
				stopDefault(e);
				 $(this).attr("disabled","disabled");
			 //交卷
			   var msg =  "您点击的【我要交卷】操作意味着考试结束，确定交卷吗？";
			   confirmBox(msg,3);
			   $(this).removeAttr("disabled");
		   });
		  $("#confirmbtn").on("click",function(e){
				var hideflag=false;
				
				    if($(this).data("active")==1){
						//1.提交答案
						_this.toSubmitPart(_this.partIndex);
						//2.提示是否继续答题 
						top.submitPart = true;
						if(_this.isError===true){
							hideflag=true;
						}else{
							var msg ="您已提交了"+_this.formalPart[_this.partIndex-1].partDesc+"部分，点击【继续答题】将开始"+_this.formalPart[_this.partIndex].partDesc+"答题部分，是否继续答题？";
							confirmBox(msg,2);
							hideflag=false;
						}
					}else if($(this).data("active")==2){
						//加载下一部分
						 hideflag=true;
						 $(this).removeData("active2");
						 $('#confirmModal').modal('hide');
						_this.loadNextPart(_this.partIndex);
						 return false;
						
					}else if($(this).data("active")==3){
						//交卷提示
						$('#confirmModal').modal('hide');
						hideflag=true;
						_this.gameover();
					}
				if(hideflag){
					$('#confirmModal').modal('hide');
					 $('#confirmModal').removeData("bs.modal");
					 return false;
				}
			});
			$("#cancelbtn").on("click",function(e){
				if(($(this).text()=="暂不答题")){
					window.location.href=root+"/tempIndex";
				}else{
					$('#confirmModal').modal('hide');
					return false;
				}
			});
			 /*答题面板相关事件*/
		    
		    /*关闭和打开答题面板*/
		    _this.$openQuestionPanel.on("click",function(){
		    	$("#questionPanel").fadeToggle("slow", "swing");
		    	$(this).hide();
		    });
		    $('body').on('click','#closeQuestionPanel',function(){
		    	$("#questionPanel").fadeOut("slow", "swing",function(){
		    		$("#openQuestionPanel").show();
		    	});
		    });
		    $('body').on('click','button[questionId]',function(){
		    	var index = $(this).html().trim(),questionId=$(this).attr('id').trim();
		    	$('button[questionId]').removeClass('currentAnswer');
		    	$(this).addClass('currentAnswer');
		    	_this.forwardIndex= index;
		    	_this.gotoQuestion(questionId,index);
		    });
			/*end 答题面板相关事件*/
		},
		/*订阅事件*/
		toSubscribe : function(){
			var _this = this;
			//加载题干
			$.subscribe('updateQuestion',function(event,data){
				_this.updateQuestion();
			});
			//加载还原
			$.subscribe('loadRevert',function(event,revertObj){
				_this.loadRevert(revertObj);
			});
			//选择题
			$.subscribe('singleSelect',function(event,data){
				_this.initSelectAnswer(data);
			});
			//选择题
			$.subscribe('multiSelect',function(event,data){
				var title = $('#tag').text();
				$("#tag").text('【多选】'+title);
				_this.initSelectAnswer(data);
			});
			//选择题
			$.subscribe('singleSelectText',function(event,data){
				_this.initSelectAnswer(data);
			});
			//选择题
			$.subscribe('multiSelectText',function(event,data){
				var title = $('#tag').text();
				$("#tag").text('【多选】'+title);
				_this.initSelectAnswer(data);
				_this.$selectwrap.append('<textarea id="choiceDesc" class="form-control" rows="6" placeholder="请给出解释，否则选对不得分"></textarea>');
				   $('#choiceDesc').val(data.optDesc);
			});
			//编程题
			$.subscribe('program',function(event,data){
				_this.initProgramAnswer(data);
			});
			//附加题
			$.subscribe('textarea',function(event,data){
				_this.initTextAnswer(data);
				
			});
			//面试题
			$.subscribe('interview',function(event,data){
				if(viewType=="MONITOR" || viewType=="INTERVIEW"){
					_this.initInterview();
				}else{
					exam.nextPublicStep = 'interview';
				}
			});
			//提交部分
			$.subscribe('aotoSubmitPart',function(event,data){
				if(viewType=="MONITOR" || viewType=="INTERVIEW"){
					_this.autoSubmitPart();
				}else{
					exam.nextPublicStep = 'aotoSubmitPart';
				}
			});
		},
		/*初始化部分*/
		initStyle : function(){
			var _this = this;
			_this.initQuestionHead();
			//1.显示板块
			_this.initPanel();
			//2.显示按钮
			_this.revertButton();
		},
		/*处理单选点击*/
		dealSingleSelect : function($this,e){
			var _this = this;
		 	_this.$selectwrap.find('a').removeClass("answer-active");
		 	$this.addClass("answer-active");
		   //记录答案
			  _this.answerHtml=_this.$selectwrap.html();
			  _this.answer=$this.attr("data-select");
		},
		/*处理多选点击*/
		dealMuiltSelect : function($this,e){
			var _this = this;
			 var arr = _this.answer.split('');
			 //处理样式
			 if($this.hasClass('answer-active')){
				 $this.removeClass("answer-active");
			 }else{
				 $this.addClass("answer-active");
			 }
			 _this.answer='';
			 var selectObj = _this.$selectwrap.find('a.answer-active');
			 for (var i = 0,len=selectObj.length;i<len;i++){
				 _this.answer+=$(selectObj[i]).attr("data-select");
			 }
			//记录答案
			  _this.answerHtml=_this.$selectwrap.html();
		},
		/*处理单选点击*/
		dealSingleSelectText : function($this,e){
			var _this = this;
			_this.dealSingleSelect($this, e);
				 var text = $("#choiceDesc").val();
				 var temp = '<textarea id="choiceDesc" class="form-control" rows="6" placeholder="请给出解释，否则选对不得分"></textarea>';
				 $("#choiceDesc").remove();
				 $('.placeholder').remove();
				 if(text){
					 $this.after(temp);
					 $("#choiceDesc").val(text);
				 }else{
					 $this.after(temp);
				 }
					 $.placeholder.shim({selector:'#choiceDesc',bindScroll:'#exam-answer'});//初始化placeholder	 
		},
		/*恢复步骤*/
		revertStep : function(partIndex){
			var _this = this;
			var dataArr = [];
			for(var i = 0 ;i<_this.formalPart.length;i++){
				var obj = {};
				if(i==partIndex-1){
					obj.state='stepcurrent';
				}else if(i<partIndex-1){
					obj.state='stepfinish';
				}else{
					obj.state='steponready';
				}
				obj.partDesc=_this.formalPart[i].partDesc;
				dataArr.push(obj);
			}
			templateRender('step','stepModel',{'steps':dataArr});
			_this.renderQuestionPanel(partIndex);
		},
		/*加载还原*/
		loadRevert : function (revertObj){
			var _this = this;
			if(!_this.revertObj.questionId){
				//临界点
				_this.alertMsg ="您已提交了"+_this.formalPart[_this.revertObj.partIndex-2].partDesc+"部分，点击【继续答题】将开始"+_this.formalPart[_this.revertObj.partIndex-1].partDesc+"答题部分，是否继续答题？";
			}
		},
		/*还原指定部分*/
		toRevertPart : function(obj){
			var _this = this;
			_this.stopCutDown();
			_this.partSeq=obj.partSeq;//当前题型 seq;
			_this.partIndex = obj.partIndex;
			_this.partDesc = _this.formalPart[_this.partIndex-1].partDesc;
			_this.questionIndex = typeof (obj.questionIndex)=='undefined'?1:obj.questionIndex;
			_this.questionId=typeof (obj.questionId)=='undefined'?_this.formalPart[_this.partIndex-1].questionIds[_this.questionIndex-1].questionId:obj.questionId;//当前题号
		},
		/*初始化问题信息*/
		initQuestionInfo : function(partIndex){
			var _this = this;
			_this.partSeq=_this.formalPart[partIndex-1].partSeq;//当前题型 seq;
			_this.partDesc=_this.formalPart[partIndex-1].partDesc;//题型描述
			_this.partIndex=partIndex;//当前部分 
			_this.questionIndex=1;	//当前题标
			_this.questionId=_this.formalPart[partIndex-1].questionIds[0].questionId;//当前题号
		},
		/*初始化题干*/
		initQuestionHead : function(){
			var _this =this;
			if(_this.revertObj){
				_this.toRevertPart(_this.revertObj);
				 if(_this.questionId && _this.partSeq){
					 _this.getQuestionByIndex(_this.questionIndex,{"question_id":_this.questionId ,"partSeq":_this.partSeq,"partIndex":_this.partIndex,"questionIndex":_this.questionIndex});
				 }
			}else{
				_this.initQuestionInfo(1);
				var firstQuestion={"question_id":_this.questionId,"partSeq":_this.partSeq,"partIndex":_this.partIndex,"questionIndex":_this.questionIndex};
				_this.getQuestionByIndex(_this.questionIndex,firstQuestion);
				$.ajax({
					url:root+"/exam/goPaperPart/"+_this.partSeq
				});
			}
			_this.revertButton();
		},
		/*设置题干*/
		setQuestionHead : function(title){
			var _this = this;
			//var questionHead = title.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g,"<br>");
			_this.$questionHead.html(title);
		},
		/*显示板块*/
		initPanel: function(){
			var _this=this;
			$("#clock").removeClass().addClass('countDown');
			$("#testAnswer").remove();//
			$("#tryout").remove();
			$('#jiankong').removeClass('hidden');
			if(_this.questionIndex==1){
				_this.$prev.hide();
			}
		},
		/*部分计时*/
		revertButtonPart : function(){
			var _this=this;
			 //1.2 部分计时
			if(_this.questionIndex==1){
				_this.$prev.hide();
			}else{
				_this.$prev.show();
			}
			 if(_this.questionIndex<_this.formalPart[_this.partIndex-1].questionLength){
				//1.2.1 有下一题
				 _this.$next.removeClass("hidden").show();
				 _this.$submitPart.hide(); 
				 _this.$submitPaper.hide();
			 }else{
				//1.2.1 无下一题 
				 _this.revertButtonNoNext();
			 }
		},
		/*单独计时模式按钮还原*/
		revertButtonSinger : function(){
			var _this=this;
			 //1.2 单题计时
			 if(_this.questionIndex<_this.formalPart[_this.partIndex-1].questionLength){
				//1.2.1 有下一题
				 _this.$next.removeClass("hidden").show();
				 _this.$submitPart.hide(); 
				 _this.$submitPaper.hide();
			 }else{
				//1.2.1 无下一题 
				 _this.revertButtonNoNext();
			 }
		},
		/*无下一题模式按钮还原*/
		revertButtonNoNext : function(){
			var _this = this;
			//1.2无下一题
			_this.$next.hide();
			 if(_this.partIndex<_this.formalPart.length){
				 //1.2.1  非最后一种类型
				 _this.$submitPart.removeClass("hidden").show(); 
				 _this.$submitPaper.hide();
			 }else{
				 //1.2.2  最后一种类型
				 _this.$submitPaper.removeClass("hidden").show();
				 _this.$submitPart.hide(); 
			 }
		},
		/*还原显示板块*/
		revertButton : function(){
			var _this=this;
			if(_this.partSeq=="12"){
				//1.面试题，隐藏除了交卷的所有按钮
				_this.$prev.hide();
				_this.$next.hide();
				_this.$submitPart.hide(); 
			    _this.$submitPaper.removeClass("hidden").show();
			    _this.$openQuestionPanel.hide();
			    $('#questionPanel').hide();
			    
			}else{
				//2.非面试题
				if(examTimeType===1){
					_this.revertButtonSinger();
				}else if(examTimeType===2){
					_this.revertButtonPart();
				}
			}
		},
		/*根据题号获取题目信息，提交本地*/
		getQuestionByIndex:function(index,a,callback){
			var _this = this;
			var partSeq = a.partSeq;
			var param = JSON.stringify(a);
			var isSuccess = false;
			_this.questionId = a.question_id;
			$.ajax({
				url:root+"/exam/query",
				type:"POST",
				contentType:"application/json",
				dataType:"json",
				data:param,
				timeout:4000,
				success:function(result){
					if(result.code==0){
						if(result.data){
							//标记题板当前题
							if($('#'+_this.questionId).length>0){
								$('#'+_this.questionId).addClass('currentAnswer');
							}
							//1. 解析题型容器
							if(result.data.editType){
								_this.wrapType = trasferQuestionWrap(result.data.editType);
								if(_this.wrapType ){
									$.publish(_this.wrapType,result.data);
								}
							}
							//2. 加载题干
							if(result.data.title){
								//set题干	
								_this.$questionIndex.html(index);
								_this.$questionLength.html(_this.formalPart[_this.partIndex-1].questionLength);
								$("#tag").text(result.data.qbName);
								_this.setQuestionHead(result.data.title);
							}
							//3.计时
							_this.toCountDown(result.data.suggestTime);
							
							//4.记录用户的当前题答题时间
							_this.counTime=0;
						}
						//5.更新题目
							$.publish('updateQuestion');
						//记录成功状态
						isSuccess = true;
						if(callback && typeof callback=="function"){
							callback();
						}
					}else if(result.code==12){
						//window.location.href=root+"/goToError";
						return false;
					}else if(result.code==13){
						//session失效
						alertSessionInvalid(_this,index,a);
					}else{
						//window.location.href=root+"/error";
						return false;
					}
				},
				beforeSend : function(){
					_this.isError=false;
					//停止计时
					_this.$countdown.stopCountDown();
					//过滤：初始化，提交部分，面试
					 if(_this.nextFirstClick===false){
						 _this.$next.html('正在提交答案...');
					 }
					_this.$next.attr("disabled","disabled");
				},
				complete : function(){
					setTimeout(function(){
						_this.$next.html('下一题').removeAttr("disabled");
					},1500);
				},
				error : function(jqXHR,textStatus,errorThrown){
					_this.isError=true;
					var errmsg ="服务端出现异常，请稍后重试！";
					if(jqXHR.readyState===0 || jqXHR.status===0){
						//网络异常
						errmsg=""; //网络异常用默认信息
					}else{
						if(textStatus=="timeout"){
							errmsg="网络连接超时，请稍后再试";
						}
					}
					//添加信息
					if(errmsg){
						$("#errorAlertMsg").html("<p>"+errmsg+"</p>");
					}
					$('#errorAlert').modal({
						backdrop:'static',
						keyboard:false,
						show:true
					});
					//停止计时
					_this.$countdown.startCountDown();
				}
			});
		},
		/*初始化选择题模板*/
		initSelectAnswer : function(data){
			//getSWF("TitleSet").setTitleFontSize();
			var _this=this;
			_this.$questionHead.css('font-size','18px');
			_this.questionTypeName="select";
			if(!data.options){
				return;
			}
			var answerArr =[];
			var select =['A','B','C','D','E','F'];
			for(var i in data.options){
				var answerObj ={};
				answerObj.select=select[i];
				//answerObj.answer=data.options[i].replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g,"<br>");
				answerObj.answer=data.options[i];
				answerArr.push(answerObj);
			}
			//渲染选择题模板
			var htmlOutput = $("#selectAnswer").render(answerArr);  
			_this.$selectwrap.html(htmlOutput); 
			//修改样式
			_this.$anserHead.removeClass('col3');
			_this.$questionWrap.removeClass('col3');
			_this.$keyword.removeClass('col3');
			_this.$questionHead.removeClass('col3');
			//隐藏其他答题容器
			_this.loadAnswerWrap("select");    
			//加载答案
			if(data.optAnswers){
				//加载选择题答案
				if(data.optAnswers.length==1){
					$("#select-"+data.optAnswers).addClass("answer-active");
				}else if(data.optAnswers.length>1){
					var answerArr =  data.optAnswers.split('');
					for(var i = 0;i<answerArr.length;i++){
						$("#select-"+answerArr[i]).addClass("answer-active");
					}
				}
			   if(data.optDesc){
				   if(data.optAnswers.length==1){
					   $("#select-"+data.optAnswers).trigger('click');
				   }
				   $('#choiceDesc').val(data.optDesc);
			   }
			   _this.answer=data.optAnswers;
			}else{
				_this.answer='';
			}
			
		},
		/*
		 * 加载答案容器
		 * type:容器类型
		 * */
		loadAnswerWrap: function(type){
			var _this = this;
			if(type=="select"){
				_this.$textwrap.hide();    //文本容器
				 _this.$codematrix.hide();
				_this.$selectwrap.removeClass("hidden").show(); //选择题容器
			}else if(type=="program"){
				_this.$textwrap.hide();    //文本容器
				_this.$selectwrap.empty();	//选择容器
				 _this.$codematrix.removeClass("hidden").show();
			}else if(type=="text"){
				 _this.$codematrix.hide();    //文本容器
				_this.$selectwrap.empty();	//编程容器
				_this.$textwrap.removeClass("hidden").show(); //选择题容器
			}else if(type=="interview"){
				 _this.$codematrix.hide();
				_this.$selectwrap.empty();	//选择容器
				_this.$textwrap.hide(); //选择题容器
				if(examTimeType===1){
					_this.$next.hide();
				}
				 //_this.$countdown.hide();
			}
		},
		/*初始化编程题模板*/
		initProgramAnswer : function(data){
			//getSWF("TitleSet").setTitleFontSize(14);
			var _this = this;
			_this.$questionHead.css('font-size','14px');
			_this.questionTypeName="program";
			_this.$anserHead.addClass('col3');
			_this.$questionWrap.addClass('col3');
			_this.$keyword.addClass('col3');
			_this.$questionHead.addClass('col3');
			//隐藏其他答题容器
			_this.loadAnswerWrap("program"); 
			if(data.matrix){
				//加载编程题答案
				if(!exam.CodeMatrix){
					exam.CodeMatrix = exam.initCodeMatrix(_this.$codematrix,function(){
						 exam.CodeMatrix.show();
						 exam.CodeMatrix.onResize();
						 exam.CodeMatrix.setMatrix(data.matrix,_this.questionId);
						 if(_this.getSuggesTime==0){
							 _this.stopToAnswer();
						 }
					});
				}else{
					exam.CodeMatrix.show();
					exam.CodeMatrix.onResize();
					exam.CodeMatrix.setMatrix(data.matrix,_this.questionId);
				}
			   
			}
			
		},
		/*初始化文本题模板*/
		initTextAnswer : function(data){
			//getSWF("TitleSet").setTitleFontSize();
			var _this = this;
			_this.$questionHead.css('font-size','18px');
			_this.$textarea.removeAttr('disabled');
			_this.questionTypeName="text";
			if(data.matrix){
				var filename =  data.matrix.items[0].filename;
				_this.setFileName(filename);
				var content = data.matrix.items[0].content;
				_this.setContent(content);
				if(content){
					_this.$textarea.val(content);
					 _this.answer=content;
				}else{
					_this.$textarea.val('');
				}
			}
			//修改样式
			_this.$anserHead.removeClass('col3');
			_this.$questionWrap.removeClass('col3');
			_this.$keyword.removeClass('col3');
			_this.$questionHead.removeClass('col3');
			//隐藏其他答题容器
			_this.loadAnswerWrap("text");  
			$.placeholder.shim();//初始化placeholder	
		},
		/*初始化视频模板*/
		initInterview : function(){
			//getSWF("TitleSet").setTitleFontSize();
			var _this = this;
			_this.$questionHead.css('font-size','18px');
			_this.questionTypeName="interview";
			_this.$anserHead.addClass('col3');
			_this.$questionWrap.addClass('col3');
			_this.$keyword.addClass('col3');
			_this.$questionHead.addClass('col3');
			$("#tag").text('面试题');
			//调用摄像头接口
			if(viewType=="INTERVIEW"){
				try{
					var num = _this.formalPart[_this.partIndex-1].questionLength;
					if(_this.questionIndex>0 && _this.questionIndex<=num){
						var index = _this.questionIndex;
						if(_this.isGotoNext==true){
							index=_this.questionIndex+1;
						}else if(_this.isGotoPrev==true){
							index=_this.questionIndex-1;
						}
						getSWF("VideoOper").ready2Interview(_this.questionId,examTimeType,index,num);
					}
				}catch(e){
					throw e.message;
				}
			}
			if(viewType=="MONITOR"){
				_this.loadAnswerWrap("interview");
				_this.loadView();
			}
			
		},
		/*提交答案
		 * askQustionId:请求题号
		 * currentQuestionId:提交题号
		 * questionType:问题类型
		 * partSeq：部分序号
		 * current:当前题序号
		 * */
		toSubmitAnswer : function(obj){
			var _this = this;
			var askQustionId;
			if(obj.askQustionId){
				askQustionId =  obj.askQustionId;
			}
			var currentQuestionId=obj.currentQuestionId,
			partSeq=obj.partSeq,currentPart=obj.questionType,index=obj.index,currentAnswer=_this.answer;
			//停止计时
			 //  _this.stopCount();
			 var answerObj = {};
			   answerObj.question_id=askQustionId;
			   answerObj.partSeq = partSeq;
			   answerObj.partIndex=_this.partIndex;
			   answerObj.questionIndex=index;
			   //判断题型
			   if(currentPart=="select"){
				   //选择题
				   answerObj.answer={};
				   answerObj.answer.id=currentQuestionId; 
				   answerObj.answer.answerTime = _this.counTime;
				   answerObj.answer.choice=_this.answer;
				   if(_this.wrapType=='singleSelectText' || _this.wrapType=='multiSelectText'){
					   if($('#choiceDesc').val()){
						   answerObj.answer.choiceDesc=  $('#choiceDesc').val();
					   }
				   }
			   }
			   if(currentPart=="program"){
				   //编程题
				   answerObj.answer={};
				   answerObj.answer.id=currentQuestionId;
				   answerObj.answer.answerTime = _this.counTime;
				   answerObj.answer.files=exam.CodeMatrix.getAnswer();
				   currentAnswer = exam.CodeMatrix.hasAnswer();
				   answerObj.answer.fileEdited=currentAnswer?1:0;
			   }
			   if(currentPart=="text"){
				   //文本题
				   answerObj.answer={};
				   answerObj.answer.id=currentQuestionId;
				   answerObj.answer.answerTime = _this.counTime;
				   currentAnswer = _this.$textarea.val();
				   var ans = [{"filename":_this.getFileName(),"content":currentAnswer}];
				   answerObj.answer.fileEdited=currentAnswer?1:0;
				   answerObj.answer.files=ans;
			   }
			   
			   if(currentPart=="interview"){
				   //面试题
				   answerObj.answer={};
				   answerObj.answer.id=currentQuestionId;
				   answerObj.answer.answerTime = _this.counTime;
			   }
			   //如果已答当前题，设置当前题样式
			   if(currentAnswer){
				   $("#"+currentQuestionId).removeClass('unAnswer').addClass('answered');
			   }else{
				   $("#"+currentQuestionId).removeClass('answered').addClass('unAnswer');
			   }
			   _this.getQuestionByIndex(index, answerObj);
		},
		/*禁止答题*/
		stopToAnswer : function(){
			var _this = this;
			if(_this.questionTypeName=="select"){
				_this.$selectwrap.find('a').not('.answer-active').addClass("disabled");
				$('#choiceDesc').attr("disabled","disabled");
			}
			if(_this.questionTypeName=="program" &&  exam.CodeMatrix!==undefined){
				 exam.CodeMatrix.addMask();
			}
			if(_this.questionTypeName=="text"){
				_this.$textarea.attr("disabled","disabled");
			}
		},
		/*加载指定题型
		 * 参数：partSeq部分序号
		 * */
		loadPartType : function(){
			var _this = this;
			//加载面试题
			if( _this.partSeq=="12" && viewType=="MONITOR"){
				_this.loadView();
			}
			 _this.revertButton();
		},
		/*下一题*/
		gotoNext : function(){
			var _this = this;
			_this.isGotoNext = true;
			var questionIndex = _this.questionIndex;
			var partIndex = _this.partIndex;
			var nextQuestionId = _this.formalPart[partIndex-1].questionIds[questionIndex].questionId; //要请求的questionId
			_this.gotoQuestion(nextQuestionId,parseInt(questionIndex)+1);
		},
		/*上一题*/
		gotoPrev : function(){
			var _this = this;
			_this.isGotoPrev= true;
			var questionIndex = _this.questionIndex;
			var partIndex = _this.partIndex;
			if(questionIndex-2>-1){
				var prevQuestionId = _this.formalPart[partIndex-1].questionIds[questionIndex-2].questionId; //要请求的questionId
				_this.gotoQuestion(prevQuestionId,parseInt(questionIndex)-1);
			}
		},
		/*跳转指定题*/
		gotoQuestion : function(askQustionId,askIndex){
			var _this = this;
			if( !_this.partSeq=="12"){
				if(askIndex==1){
					_this.$prev.hide();
				}else{
					_this.$prev.show();
				}
			}
			var questionIndex = _this.questionIndex, partIndex = _this.partIndex,currentAnswer = _this.answer;
			 //1.提交答案:question_id:请求下一题的题号
			   /*var a={"question_id":"3","partSeq":1,"answer":{"id":"1","choice":"D","files":[{"filename":"a.java","content":"aaaaa"},
			                                                                           	   {"filename":"b.java","content":"bbbbbb"}]}};*/
			   var currentQuestionId = _this.formalPart[partIndex-1].questionIds[questionIndex-1].questionId;
			   var answerobj ={"askQustionId":askQustionId,"currentQuestionId":currentQuestionId,
						"partSeq":_this.partSeq,"questionType":_this.questionTypeName,"index":askIndex};
			   _this.toSubmitAnswer(answerobj);
			   _this.answer='';
			   _this.answerHtml="";
		},
		/*
		 * 更新下一题信息
		 * */
		updateQuestion : function(){
			var _this =this;
			 if(_this.isGotoNext===true || _this.isGotoPrev===true){
				 var questionIndex = _this.questionIndex;
				 // 变更当前题
				 if(	_this.isGotoNext===true){
					 _this.questionIndex++;
				 }else if(_this.isGotoPrev===true){
					 _this.questionIndex--;
				 }
				 //设置按钮
			 }else if(_this.forwardIndex!==undefined && 	_this.forwardIndex>0){
				 _this.questionIndex=_this.forwardIndex;
				 _this.forwardIndex=0;
			 }
			 _this.revertButton();
			 
		  	_this.isGotoNext = false;
		  	_this.isGotoPrev = false;
		},
		/**
		 * 提交部分
		 * parttype:提交什么题型的部分
		 */
		submitPart : function(partType){
				var _this=this;
				var msg=null;
				var num = _this.formalPart[_this.partIndex-1].questionLength;
				//1.获取当前部分已完成题数
					msg="提交后将进入下一环节，不能回到本环节，确定提交您的"+_this.partDesc+"部分吗?";
					confirmBox(msg,1);
					//增加部分完成数
					// _this.finPart++;
			
		},
		/*提交部分提交数据*/
		toSubmitPart : function(partType){
			var _this=this;
			_this.stopCutDown(); 
			//1.提交答案,不请求题
			var questionIndex = _this.questionIndex;
			var questionId = _this.questionId;
			var partSeq = _this.partSeq;
			var partIndex = _this.partIndex;
			var partName = _this.questionTypeName;
			var currentAnswer = _this.answer;
			 //1.提交答案
			   /*var a={"partSeq":1,"answer":{"id":"1","choice":"D","files":[{"filename":"a.java","content":"aaaaa"},
			                                                         	   {"filename":"b.java","content":"bbbbbb"}]}};*/
			   var answerobj ={"currentQuestionId":questionId,
						"partSeq":partSeq,"questionType":partName,"index":1};
			   _this.toSubmitAnswer(answerobj);
			  
			//2.调用提交部分接口
			$.ajax({
				timeout:4000,
				url:root+"/exam/handInPaperPart/"+_this.partSeq,
				beforeSend : function(){
					_this.isError=false;
				},
				error : function(jqXHR,textStatus,errorThrown){
					_this.isError=true;
					var errmsg ="服务端出现异常，请稍后重试！";
					if(jqXHR.readyState===0 || jqXHR.status===0){
						//网络异常
						errmsg=""; //网络异常用默认信息
					}else{
						if(textStatus=="timeout"){
							errmsg="网络连接超时，请稍后再试";
						}
					}
					//添加信息
					if(errmsg){
						$("#errorAlertMsg").html("<p>"+errmsg+"</p>");
					}
					$('#errorAlert').modal({
						backdrop:'static',
						keyboard:false,
						show:true
					});
				}
			});
			top.submitPart = true;
		},
		/*加载下一部分
		 * currentType：当前部分
		 * */
		loadNextPart : function(currentType){
			top.submitPart = false;
			var _this=this,nextParIndex=parseInt(currentType)+1;
			//加载答题面板
			examTimeType=_this.formalPart[nextParIndex-1].timerType?getTimeType(_this.formalPart[nextParIndex-1].timerType):examTimeType;
			_this.renderQuestionPanel(nextParIndex);
			_this.initQuestionInfo(nextParIndex);
			//1.提交答案
			// 变更当前题
			//1.请求下一题:question_id:请求下一题的题号
			   /*var a={"question_id":"3","partSeq":1,"answer":{"id":"1","choice":"D","files":[{"filename":"a.java","content":"aaaaa"},
			                                                         	   {"filename":"b.java","content":"bbbbbb"}]}};*/
			  
		   if(currentType<_this.formalPart.length){
			   var answerObj = {};
			   answerObj.question_id=_this.questionId;
			   answerObj.partSeq=_this.partSeq;
			   answerObj.partIndex= _this.partIndex;
			   answerObj.questionIndex= _this.questionIndex;
			   _this.getQuestionByIndex(1, answerObj,function(){
				   _this.loadPartType(parseInt(currentType)+1);
			   });
				//4.通知接口开始下一部分
				$.ajax({
					url:root+"/exam/goPaperPart/"+_this.formalPart[parseInt(currentType)].partSeq
				});
		   }
			//变换按钮
			_this.revertButton();
			_this.revertStep(_this.partIndex);
		},
		/*测评结束*/
		gameover : function(type){
			var _this = this;
			var interviewFlag = _this.submitPaper(type);
			if(!interviewFlag && _this.isError!==true)
			{
				if(type=="timeover"){
					modalWaiting.show('很抱歉，本次测评时间已到，系统已经自动交卷中，请稍候...');
					setTimeout(function(){
						modalWaiting.hide();
						_this.completeExam();
					},3000);
				}else{
					_this.completeExam();
				}
			}
		},
		/*交卷*/
		submitPaper : function(type){
			var _this = this;
			var interviewFlag = false;
			_this.stopCutDown(); //停止倒计时
			if(	_this.questionTypeName!= "interview"){
				//1.提交答案
				_this.toSubmitPart(_this.partIndex);
			}else{
				 interviewFlag = getSWF("VideoOper").isInterviewing();
				 if(interviewFlag){
					 interviewFlag = true;
					 getSWF("VideoOper").stopClick(true);  // true  isGameOverWhenInterview  表示 在面试的过程中没有结束答题直接交卷
					 if(type && type=='auto' || type=="timeover"){
						 modalWaiting.show('很抱歉，本次测评时间已到，系统已经自动交卷中，请稍候...');
					 }else{
						 modalWaiting.show('交卷中，请稍候...');
					 }
				 }
				
			}
			return interviewFlag;
		},
		/*跳转完成页面*/
		completeExam : function()
		{
			isGameOver =true;
			window.location.href=root+"/examfinish";
		},
		/*检查是否仍在面试*/
		isInterviewing : function(){
			getSWF("VideoOper").getCameraType('INTERVIEW');
			try{
				 var flag = getSWF("VideoOper").isInterviewing();
				 if(flag){
					 var msg = "【我要交卷】操作意味着考试结束，但是您的面试题还没有答完，确定交卷吗？";
					 confirmBox(msg,3);
				 }
			}catch(e){
				throw e.message;
			}
			
		},
		/*加载视频题*/
		loadView : function(){
			var _this = this;
			//修改样式
			_this.$anserHead.addClass('col3');
			_this.$questionWrap.addClass('col3');
			_this.$keyword.addClass('col3');
			_this.$questionHead.addClass('col3');
			$('#viewbody').css({"z-index":"10"});
			$(getSWF("VideoOper")).attr("width","558").attr("height","419"); 
			var w = _this.operateOffset || $('#operate-wrap').offset();
			var y = w.left-698;
			interview_open(); //显示摄像头
			$("#viewbody").css({"position":"absolute","left":'50%',"top":"120px","margin-left":-279});
			//$("#camera").offset({top:0,left:0}).offset({top:120,left:y});
			$(window).on("scroll",function() {
			    	/*var y=_this.$interviewWrap.offset();
				    $("#camera").offset({top:120,left:y});*/
				$("#viewbody").css({"position":"absolute","left":'50%',"top":"120px","margin-left":-279});
			});
		   getSWF("VideoOper").setCameraType('INTERVIEW',_this.formalPart[_this.partIndex-1].questionIds);
			var num = _this.formalPart[_this.partIndex-1].questionLength;
		   getSWF("VideoOper").ready2Interview(_this.questionId,examTimeType,_this.questionIndex,num);
		   viewType="INTERVIEW";
		},
		/*面试上一题*/
		aotoGoPrev : function(){
			var _this =this;
			var questionIndex = _this.questionIndex;
			if(questionIndex>1){
				_this.gotoPrev();
			}
		},
		/*面试下一题*/
		aotoGoNext : function(){
			var _this =this;
			var questionIndex = _this.questionIndex;
			var partIndex = _this.partIndex;
			if(questionIndex==_this.formalPart[partIndex-1].questionLength){
				//最后一题,提交时间
				//停止倒计时
				_this.stopCutDown();
				//提交倒计时
				var currentQuestionId = _this.formalPart[partIndex-1].questionIds[questionIndex-1].questionId;
				var answerobj ={"currentQuestionId":currentQuestionId,
							"partSeq":_this.partSeq,"questionType":_this.questionTypeName,"index":parseInt(questionIndex)+1};
				   _this.toSubmitAnswer(answerobj);
				//判断是否最后一部分
				  if(partIndex<_this.formalPart.length){
					  _this.loadNextPart(partIndex);
				  }else{
					  //交卷
					  _this.gameover();
				  }
			}else{
				_this.gotoNext();
			}
			 
		},
		/*给面试调用开始计时*/
		startTimeCount : function(){
			var _this =this;
			 if(examTimeType===1){
				 if(_this.getSuggesTime() && _this.getSuggesTime()>0){
					 _this.resetCutDown(_this.getSuggesTime(),2);
					 _this.$countdown.removeClass("hidden").show();
				 }else{
					 _this.stopCutDown();
				 }
			 }else if(examTimeType===2){
				 if(_this.getSuggesTime() && _this.getSuggesTime()>0){
					 _this.startCutDown();
				 }
			 }
		},
		/*停止倒计时*/
		stopCountTime : function(){
			var _this =this;
			 _this.stopCutDown();
			 if(examTimeType===1){
				 _this.$countdown.hide();
			 }
		},
		/*开始计时*/
		timedCount : function(){
			var _this = this;
			_this.stopTimeCount=setInterval(
				    function()
				    {
				    	_this.counTime++;
				     
				    }, 1000);
		},
		/*停止计时*/
		stopCount : function(){
			var _this = this;
			clearInterval(_this.stopTimeCount);
		},
		/*自动提交部分*/
		autoSubmitPart : function(){
			var _this = this;
			_this.toSubmitPart(_this.partIndex);
			//2.提示是否继续答题 
			top.submitPart = true;
			var msg ="当前环节测评时间已到，系统已自动帮您提交了"+_this.formalPart[_this.partIndex-1].partDesc+"部分，点击【继续答题】将开始"+_this.formalPart[_this.partIndex].partDesc+"答题部分，是否继续答题？";
			confirmBox(msg,2);
		},
		/*时间到
		 * type:1：提交题；2交卷
		 * */
		timeOver : function(type){
			var _this = this;
			if(type==1){
				//1.非面试提交题
				if(_this.questionTypeName != "interview"){
					//1.1 判断是否有下一题
					if(_this.questionIndex<_this.formalPart[_this.partIndex-1].questionLength){
						_this.stopToAnswer();
					}else{
						//1.2 有下一题判断是否有下一部分
						if(_this.partIndex<_this.formalPart.length){
							//1.2.1 有下一部分，自动提交部分
							if(_this.questionIndex==_this.formalPart[_this.partIndex-1].questionLength){
								_this.autoSubmitPart();
							}
						}else{
							//1.2.2 最后一部分，自动交卷
							_this.gameover('timeover');
						}
					}
				}
			}else if(type==2){
				//面试提交题
				if(_this.questionTypeName == "interview"){
					getSWF("VideoOper").stopClick();
				}
			}else if(type==3){
				//提交部分
					//1.2 有下一题判断是否有下一部分
					if(_this.partIndex<_this.formalPart.length){
						//1.2.1 有下一部分，自动提交部分
							_this.autoSubmitPart();
					}else{
						//1.2.2 最后一部分，自动交卷
						//$("#go-timeoveralert").html("很抱歉，本次测评时间已到，系统已经自动帮你交卷。");
						_this.gameover('timeover');
					}
			}else{
				//自动交卷
				//$("#go-timeoveralert").html("很抱歉，本次测评时间已到，系统已经自动帮你交卷。");
				_this.gameover('timeover');
			}
		},
		/*初始化倒计时值*/
		initCutDown : function(time){
			var _this = this;
			_this.$countdown.setCountDown({
					'diffSecs': time
			});
		},
		/*开启倒计时*/
		startCutDown : function(){
			var _this = this;
			_this.$countdown.startCountDown();
		},
		/**
		 * 停止倒计时
		 */
		stopCutDown : function(){
			var _this = this;
			var userTime=_this.$countdown.stopCountDown();
			_this.counTime = userTime;
		},
		/**
		 * 重设倒计时
		 */
		resetCutDown : function(time,type){
			var _this = this;
			var userTime=_this.$countdown.stopCountDown();
			_this.$countdown.countDown({
				'diffSecs': time,
				//到时间自动交卷
				 'onComplete': function() { _this.timeOver(type);}
			});	
			return userTime;
		}
	};
})(jQuery);
