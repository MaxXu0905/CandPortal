var examTest;
//初始化模板
/*学习引导*/
(function($){
	var step = 0;
	var defaults={
		isMark: true
	};
	$.fn.guidePopover= function(option){
		step = 0;
		$.extend(defaults,option);
		if(!defaults.isMark){
			$('#guide-mark').remove();
		}
		$('#guide').removeClass('hidden').show();
		if(typeof option==='object'){
			if(option.title){
				if(typeof option.title==='string'){
					$('#guide-popover-title').html(option.title);
				}
				
				$('#guideClose').on('click',function(){
					$('#guide').guidePopover('hide');
					$.dismissGuideFrog();
					return false;
				});
			}
			if(option.step){
				if(option.nextBtn){
					$("#"+option.nextBtn).off('click');
					$("#"+option.nextBtn).on('click',function(){
						if($(this).text()=='开始练习'){
							$('#guide').guidePopover('hide');
							if(processguide.nextGuide){
								processguide.nextGuide();
							}else{
								$.dismissGuideFrog();
							}
						}else{
							step++;
							loadNextStep(option);
						}
					});
				}
				step++;
				loadNextStep(option);
				if(option.offset){
					$(window).on('resize scroll', function() {
						resetSize(option.offset[step-1]);
					});
				}
			}
			if(option.place){
				var div = 'nexticon_'+option.place,i=root+'/core/images/'+option.place+'.png';
				var temp='<div id="nexticon" class="'+div+'"><img src="'+i+'"/></div>';
				$('#nexticon').remove();
				if(option.place=='up'){
					$(temp).insertBefore($('#guide-content'));
				}
				else if(option.place=='down'){
					$(temp).insertAfter($('#guide-content'));
				}
			}
		}else if(typeof option==='string'){
			if(option=='remove'){
				$('#guide').remove();
				$.k();
			}else if(option=='hide'){
				$("#guidetextbtn").html('下一步');
				$('#guide').hide();
			}
		}
	};
	/*reset位置*/
	function resetSize($ele){
		if($ele && $ele.ele){
			var elesset = $ele.ele.offset(),ele=$ele.ele;
			var popoverwidth = $('#guide-popover').width();
			var popoverheight = $('#guide-popover').height();
			var width =ele.outerWidth(),height=ele.outerHeight();
			if($ele.highLight){
				if($ele.ratio){
					if(ele.width()>0 && ele.height()>0){
						$.guideHighlight(ele,$ele.ratio);
					}
					if($ele.ratio.widthRatio){
						width =ele.width()*$ele.ratio.widthRatio;
					}
					if($ele.ratio.heightRatio){
						height =ele.height()*$ele.ratio.heightRatio;
					}
					
				}else{
					if(ele.width()>0 && ele.height()>0){
					 $.guideHighlight(ele);
					}
				}
			}
			if(width<popoverwidth){
				width = 0-(popoverwidth/2);
			}else{
				width =0;
			}
			$('#guide-popover').css('margin-left','0px').offset({top:elesset.top+height,left:elesset.left+width});
		}
		
	}
	/*加载下一步骤*/
	function loadNextStep(data){
		if(data.step){
			if(data.step instanceof Array && step<=data.step.length){
				$('#guide-popover-content').html(data.step[step-1]);
			}
			if(data.title instanceof Array && step<=data.title.length){
				$('#guide-popover-title').html(data.title[step-1]);
			}
			if(data.offset instanceof Array && step<=data.offset.length){
				resetSize(data.offset[step-1]);
				
			}
			if(step>=data.step.length){
				$("#guidetextbtn").html('开始练习');
			}
			
		}
	}
})(jQuery);
/***
 * 定义题目模板
 * zengjie
 * 2014/2/20
 */
(function($){
	//初始化模板
	/*构造函数*/
	$(function(){
		examTest = new ExamTest();
	});
	function ExamTest(){
		this.$questionIndex=$('#questionIndex');
		this.$questionLength=$('#questionLength');
		this.$questionHead=$("#questionHead");
		this.$next=$("#next");//下一题
		this.$selectwrap =$("#select-wrap"); //答案模板容器ul
		this.$submitPart=$("#submitPart");
		this.$codematrix=$("#codematrix");//编辑框容器
		this.$textwrap = $("#text-wrap");//编辑框容器
		this.$textarea = $("#text-wrap >textarea");//编辑框
		this.$interviewWrap=$("#interview-wrap");//视频框
		this.isGotoNext = false;
		this.partSeq=null;//当前题型 seq;
		this.partDesc=null;//题型描述：选择题，编程题，附加题，面试题
		this.partIndex=1;//当前部分 1:第一部分 2:第二部分...
		this.questionIndex=1;	//当前题标
		this.questionId=0;//当前题号
		this.questionTypeName=null;//当前题类型名称
		this.answer="";
		this.programAnswer="";
		this.samplePart={};
		this.optAnswers="";
	}
	/*扩展行为*/
	ExamTest.prototype = {
		/*初始化*/
		init : function(obj){
			var _this = this;
			_this.samplePart=obj;
			//2.加载题干flex
			//templateLink('questionHead','questionHeader');
			_this.initQuestionHead();
			//4.初始化样式
			_this.toInitStyle();
			//5.绑定事件
			_this.bindEvent();
			//6.订阅消息
			_this.toSubscribe();
			_this.operateOffset=$('#operate-wrap').offset();
			$("#testAnswer").html('<span class="title_part">练习环节</span>');
			 
		},
		/*初始化题干*/
		initQuestionHead : function(){
			var _this =this;
			_this.initQuestionInfo();
			var firstQuestion={"question_id":_this.questionId,"partSeq":_this.partSeq};
			_this.getQuestionByIndex(1,firstQuestion);
		},
		/*设置题干*/
		setQuestionHead : function(title){
			var _this = this;
			var questionHead = title;
				//title.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g,"<br>");
			_this.$questionHead.html(questionHead);
		},
		/*初始化问题信息*/
		initQuestionInfo : function(){
			var _this = this;
			_this.partSeq=_this.samplePart[0].partSeq;//当前题型 seq;
			_this.partDesc=_this.samplePart[0].partDesc;//题型描述
			_this.partIndex=1;//当前部分 
			_this.questionIndex=1;	//当前题标
			_this.questionId=_this.samplePart[0].questionIds[0].questionId;//当前题号
		},
		/*初始化试答题的选择题模板*/
		initTestSelectAnswer : function(data){
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
			_this.optAnswers=data.optAnswers;
			//渲染选择题模板
			templateRender('select-wrap','selectAnswer',answerArr);
			//隐藏其他答题容器
			_this.loadAnswerWrap("select");   
			//加载样式
			$('#anserHead').removeClass('col3');
			$('#question-wrap').removeClass('col3');
			$('#keyword').removeClass('col3');
			$('#questionHead').removeClass('col3');
		},
		/*初始化编程题模板*/
		initTestProgramAnswer : function(data){
			//getSWF("TitleSet").setTitleFontSize(14);
			var _this = this;
			_this.$questionHead.css('font-size','14px');
			_this.questionTypeName="program";
			//加载样式
			$('#anserHead').addClass('col3');
			$('#question-wrap').addClass('col3');
			$('#keyword').addClass('col3');
			$('#questionHead').addClass('col3');
			//隐藏其他答题容器
			_this.loadAnswerWrap("program");  
			if(data.matrix){
				//加载编程题答案
				if(!exam.CodeMatrix){
					exam.initCodeMatrix(_this.$codematrix,function(){
						exam.CodeMatrix.onResize();
						exam.CodeMatrix.setMatrix(data.matrix,_this.questionId);
						_this.initProgramGuide();
					});
				}else{
					exam.CodeMatrix.onResize();
					exam.CodeMatrix.setMatrix(data.matrix,_this.questionId);
				}
				
			}
		},
		/*初始化面试题模板*/

		initTestInterviewAnswer : function(){
			//getSWF("TitleSet").setTitleFontSize();
			var _this = this;
			_this.$questionHead.css('font-size','18px');
			_this.loadAnswerWrap("interview"); 
			//加载样式
			$('#anserHead').addClass('col3');
			$('#question-wrap').addClass('col3');
			$('#questionHead').addClass('col3');
			$('#keyword').addClass('col3');
			$('#viewbody').css({"z-index":"10"});
			$(getSWF("VideoOper")).attr("width","558").attr("height","419"); 
			var w = _this.operateOffset;
			var y = w.left-698;
			interview_open(); //显示摄像头
			$("#camera").offset({top:0,left:0}).offset({top:120,left:y});
		    $(window).on("scroll",function() {
			    $("#camera").offset({top:0,left:0}).offset({top:120,left:y});
		    });
			//调用摄像头接口
			getSWF("VideoOper").setCameraType('EXERCISE');
			getSWF("VideoOper").ready2Interview(_this.questionId);
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
				_this.$selectwrap.empty();	//编程容器
				 _this.$codematrix.removeClass("hidden").show();
			}else if(type=="text"){
				_this.$codematrix.hide();
				_this.$selectwrap.empty();	//编程容器
				_this.$textwrap.removeClass("hidden").show(); //选择题容器
			}else if(type=="interview"){
				_this.$codematrix.hide();
				_this.$selectwrap.empty();	//编程容器
				_this.$textwrap.hide(); //选择题容器
			}
		},
		/*根据题号获取题目信息*/
		getQuestionByIndex:function(index,a){
			var _this = this;
			var questionId = a.question_id;
			var param = JSON.stringify(a);
			var isSuccess = false;
			$.ajax({
				url:root+"/exam/query",
				type:"POST",
				contentType:"application/json",
				dataType:"json",
				data:param,
				success:function(result){
					if(result.code=="0"){
						//设置题目
						if(result.data.title){
							_this.$questionIndex.html(index);
							_this.$questionLength.html(_this.samplePart.length);
							if(result.data.editType==7){
								$("#tag").text('面试');
							}else{
								$("#tag").text('【'+_this.partDesc+'】'+result.data.qbName);
							}
							_this.setQuestionHead(result.data.title);
							//getSWF("TitleSet").setTitle(result.data.title);
						}
						//加载答题容器
						if(result.data.editType){
							var wrapType = trasferQuestionWrap(result.data.editType);
							if(wrapType){
								$.publish("test-"+wrapType,result.data);
							}
						}
						if(_this.isGotoNext){
							_this.updateQuestion();
						}
						//记录成功状态
						isSuccess = true;
					}else if(result.code==12){
						//window.location.href=root+"/goToError";
						return false;
					}else if(result.code==13){
						//session失效
						alertSessionInvalid(_this,index,a);
					}else{
						//alert("获取题目信息服务（exam/query）的返回状态码异常：状态码为"+result.code+":"+result.message);
						//window.location.href=root+"/error";
						return false;
					}
				},
				complete : function(){
					if(isSuccess === false){
						_this.$next.html('获取题目失败').attr('disabled','disabled');
					}else{
						_this.$next.html('下一题').removeAttr("disabled");
					}
				}
			}).fail(function(jqXHR, textStatus) {
				_this.$next.html('获取题目失败').attr('disabled','disabled');
			});
		},
		/*初始化样式*/
		toInitStyle: function(){
			$("#submitPaper").hide();
			$('#tryout').show();
			var _this = this;
			_this.$submitPart.hide();
			if(_this.samplePart.length==1 && _this.samplePart[0].questionLength==1){
				_this.$next.hide();
				if(exam.examModal===1){
					$(_this.$submitPart).html('<span class="glyphicon glyphicon-send mr10 f20"></span>开始考试').removeAttr('disabled').show();
				}else{
					_this.$submitPart.html("未到考试时间").attr("disabled","disabled").show();
				}
			}
			$("#feedbackControls").hide();
		},
		/*绑定事件*/
		bindEvent : function(){
			var _this = this;
			//1.绑定记录答案
			_this.$textarea.on("change",function(){
				_this.programAnswer = $(this).val();
			});
			//2.绑定答题
			_this.$selectwrap.on("click","li >a",function() {
				_this.$selectwrap.find('i').remove();
				_this.$selectwrap.find('a').removeClass("answer-right answer-wrong");
				  //判题
				  var recovery=_this.recoveryAnswer($(this).attr("data-select"));
				  if(recovery=="right"){
					  $(this).addClass("answer-right").append('<i class="icon-ok pull-right mt5 "></i>');
				  }else if(recovery=="wrong"){
					  $("#select-"+_this.optAnswers).css({"color":"#53bf6b"}).append('<i class="icon-ok pull-right mt5 "></i>');
					  $(this).addClass("answer-wrong").append('<i class="icon-remove pull-right mt5 "></i>');
				  }
				  _this.answer=$(this).text();
				//记录上一题的答案
				  _this.prev=_this.$selectwrap.html();
			});
			//3.绑定下一题
		   _this.$next.on("click",function(e){
			   stopDefault(e);
			   $(this).attr("disabled","disabled");
			   $("#error").hide();
				$("#recovery-answer").hide();
		   			//跳题
	   				_this.gotoNext();
	   			 $(this).removeAttr("disabled");
		   });
		  /*开始考试*/
		  _this.$submitPart.on("click",function(){
			  if($(this).text()=="开始考试"){
				  alertBox();
			  }
		  });
			 
			  /*6.清除模态框缓存*/
			  $(document).on('hidden.bs.modal', '.modal', function () {
				  $(this).removeData('bs.modal');
			  }); 
			 
			  //7.绑定试答
			  $("#tryout,#gameover").on("click",function(){
				  alertBox();
			  });
			  
		},
		/*订阅事件*/
		toSubscribe : function(){
			var _this = this;
			//选择题
			$.subscribe('test-singleSelect',function(event,data){
				_this.initTestSelectAnswer(data);
			});
			//编程题
			$.subscribe('test-program',function(event,data){
				_this.initTestProgramAnswer(data);
			});
			//附加题
			$.subscribe('test-textarea',function(event,data){
				//_this.initTextAnswer(data);
				
			});
			//面试题
			$.subscribe('test-interview',function(event,data){
				if(viewType=="MONITOR"){
					_this.initTestInterviewAnswer();
				}else{
					exam.nextPublicStep = 'test-interview';
				}
			});
		},
		/*加载编程引导*/
		initProgramGuide : function(){
			//1.检查是否进行了初始化引导
			if(!window.isInitGuide){
				processguide.nextGuide = initProgramGuide;
				return;
			}
			initProgramGuide();
		},
		/*下一题*/
		gotoNext : function(){
			var _this =this;
			_this.isGotoNext=true;
			//3.换题
			_this.partSeq=_this.samplePart[_this.partIndex].partSeq;//当前题型 seq;
			_this.partDesc=_this.samplePart[_this.partIndex].partDesc;//题型描述
			_this.questionId=_this.samplePart[_this.partIndex].questionIds[0].questionId;//当前题号
			  var question = {"question_id":_this.questionId,"partSeq":_this.partSeq};
			  _this.getQuestionByIndex(parseInt(_this.questionIndex)+1,question);
		}, 
		/*
		 * 更新下一题信息
		 * */
		updateQuestion : function(){
			var _this =this;
			 _this.isGotoNext=false;
			//5.判断是否最后一题
			  _this.questionIndex++;
			  _this.partIndex++;
			  if(_this.questionIndex==_this.samplePart.length){
				  _this.$next.hide();
					if(exam.examModal===1){
						$(_this.$submitPart).html('<span class="glyphicon glyphicon-send mr10 f20"></span>开始考试').show();
					}else{
						_this.$submitPart.html("未到考试时间").attr("disabled","disabled").show();
					}
			  }
		},
		/*判断题对错*/
		recoveryAnswer :function(answer){
			var _this = this;
			if(answer){
				//获取当前题
				var rightAnswer=_this.optAnswers;
				if(answer==rightAnswer){
					//注入答案
					if(!$("#error").hasClass("hidden")){
						$("#error").hide();
					}
					$("#rightAnswer").html(rightAnswer);
					 return "right";
				}else{
					$("#rightmsg").empty();
					$("#error").show();
					$("#rightAnswer").html(rightAnswer);
				}
				return "wrong";
			}
		}
	};
})(jQuery);
