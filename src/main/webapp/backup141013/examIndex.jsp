<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>百一测评-考试中...</title>
<%@include file="../common/toper.jsp"%>
<link href="<%=request.getContextPath() %>/page/exampaper/exam.css"
	rel="stylesheet" />
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/plugin/codematrix/lib/codemirror-3.21/lib/codemirror.css">
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/plugin/codematrix/lib/codemirror-3.21/addon/hint/show-hint.css">
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/plugin/codematrix/lib/codematrix.css">
</head>

<body class="bluebody" >

	<!--header -->
	<%@include file="/WEB-INF/common/evalheader.jsp"%>
	<!-- end header -->
	<!-- 主页面 -->
		<div id="exam-wrap" class="main-wrap">
			<!-- 答题区页面 -->
			<div id="exam-answer" class="clearfix">
			<div id="exam-answer-mask" class="exam-mask" style="display:none">
				<div class="mask-body">
						<span id="exam-mask-spinner" class="spinner"></span> <span id="exam-mask-title" class="title pull-left"></span>
				</div>
			</div>
				<div id="anserHead" class="anserHead">
					<!-- 题干图标区 -->
					<div id="keyword" class="keyword clearfix">
					  <ul >
					    <li>  <span class="keyword_numb"><label id="questionIndex"></label>/<label id="questionLength"></label></span><span id="tag" class="keyword_name"></span></li>
	                     </ul>
	                     <div class="clearboth"></div>
					</div>
					<!--end 题干图标区 -->
					<!--题干-->
					<div id="questionHead" class="question-header" onselectstart="return false;" >
					
						<!--[if lt IE 10]>
						
						<![endif]-->
					</div>
					<!--end 题干-->
				</div>
				<div id="question-wrap" class="question-wrap">
					<!--答案/编辑区-->
					<div class="answerArea">
						<!--编程题容器-->
						<div id="codematrix" class="hidden"></div>
						<!--end 编程题容器-->
						
						
						<!--文本框容器-->
						<div id="text-wrap" class="hidden">
							<textarea class="form-control" rows="12" placeholder="请在此作答"></textarea>
						</div>
						<!--end 文本框容器-->
						
						<!--视频容器-->
						<!-- <div id="interview-wrap"></div> -->
						<!--end 视频容器-->
						
						<!--选择题容器-->
						<ul id="select-wrap" class="question-answer p-answerlist">
						</ul>
						<!--end 选择题容器-->
					</div>
					<!--end 答案/编辑区-->
	
					<!-- end 答题区 -->
				</div>
				<!--end 答题区页面 -->
	
				<div id="oTitleSetDiv" style="display: none"></div>
			</div>
			<!-- 操作区-->
			<div class="operate-wrap" id="operate-wrap">
					<!-- 操作区上部分 -->
					<div class="top_content">
					<!-- 监控 -->
					<div id = "monitor" class="monitor"><span>监考中</span></div>
					<div id = "examStartmonitor" class="examTimeMonitor" style="display:none;"><span>距离测评开始还剩</span></div>
					<!--end 监控 -->
					<!-- 倒计时 -->
					<div id="clock" class="clock">
	     				<div id="countdown_dashboard"><span id="minutes"></span><span id="seconds"></span></div>
	   				</div>
					<!-- end 倒计时 -->
					
					</div>
					<!--end 操作区上部分 -->
					
					<!-- 跳转按钮区 -->
					<div id="bottombtnarea" class="bottom_content">
						<div id="feedbackControls"class="clearfix">
					<form id="feedback-Form"  >
					<div class="feedback">
					<div class="btn-group">
					  <input id="type_positive" type="radio" name="opinion" value="1" style="display:none;">
					  <button id="up-tucao" type="button" class="btn btn-default"><i class="fa fa-thumbs-up fa-2x"></i></button>
					  <input id="type_downvote" type="radio" name="opinion" value="-1" style="display:none;">
					  <button id="down-tucao" type="button" class="btn btn-default"><i class="fa fa-thumbs-down fa-2x"></i></button>
					
					  <div class="btn-group">
					    <input type='hidden' id="fbItems" name="fbItems"/>
					    <button id="drop-tucao" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
					      <i class="fa fa-comments-o  fa-2x"></i> 吐槽一下
					      <span class="caret"></span>
					    </button>
					    <ul id="menu-tucao" role="menu" class="reportOptions"  style="display: none;">
						</ul>
					  </div>
					</div>
					</div>
					<div id="reportComment" style="display: none;">
						<label for="comment" id="commentLabel" >给点意见，说点啥呗:</label>
						<textarea id="comment" name="fbMore"></textarea>
						<input id="report_submit" type="submit" value="提交吐槽">
					</div>
					</form>
					</div>
						<div class="btnarea" >
						<button id="next" type="button" class="nextbtn">下一题</button> 
						<button id="submitPart" type="button" class="nextbtn" style="display:none;">提交该部分</button>
						<button id="submitPaper" type="button" class="nextbtn" style="display:none;">我要交卷</button>
						<div class="skipbtn"><a id="tryout">跳过练习 <i class="fa fa-arrow-right "></i></a></div>
						</div>
					</div>
					<!--end  跳转按钮区 -->
				</div>
			<!--end 操作区-->
			<div class="clearfix"></div>
		</div>
	<!-- end 主页面 -->

	<!-- 做题引导 -->
	<div id='guide' class='hidden'>
		<div id="guide-mark" class="i-skill-mask"></div>
		<div id="guide-popover">
			<div  id="guide-content" class="guide-popover-content">
			<button type="button" id="guideClose" class="close" data-dismiss="alert" aria-hidden="true">×</button>
				<span id="guide-popover-title" ></span>
				<div id="guide-popover-content"></div>
				<div class="guidetextbtn"><button id="guidetextbtn">下一步</button></div>
			</div>
			<div id="nexticon" class="nexticon_bottom"><i class="icon-sort-down icon-2x"></i></div>
			<div id="offsetimg"></div>
		</div>
	</div>
	<!--end 做题引导 -->
	<!-- 记录离开次数 -->
	<div id="leaveTimes-temp" class="hidden">
		<div class="i-skill-mask"></div>
		<div
			style="margin-left: -280px; z-index: 10002; top: 60px; position: fixed;"
			class="leave">
			<div id="leaveTimes-body" class="l_t">
				<div >${sessionScope.CandidateName}:<span
						id="leaveTimes-title"></span>
				</div>
				<p id="leaveTimes-msg"></p>
			</div>
			<div class="l_b tac">
				<span id="leaveTimes-alertmsg">为了避免影响您的成绩，请谨慎作答。</span>
				<button class="btn btn-default " id="goOnExam">继续考试</button>
				<button class="btn btn-default hidden" id="endExam">结束考试</button>
			</div>
		</div>
	</div>
	<!--end 记录离开次数 -->
	<!--end main -->
	<!-- 确认模态层 -->
	<div id="confirmModal" class="modal fade">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">&times;</button>
					<h4 class="modal-title modal_h">提示</h4>
				</div>
				<div id="confirmmsg" class="modal-body">
					<!--  <p>同学，你的选择题还没有答完，确定提交吗？&hellip;</p> -->
				</div>
				<div class="modal-footer">
					<button id="confirmbtn" type="button" class="btn btn-primary">确认</button>
					<button id="cancelbtn" type="button" class="btn btn-default"
						data-dismiss="modal">取消</button>
				</div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal-dialog -->
	</div>
	<!-- /.modal -->
	<!-- 确认模态层 -->
	
	<!-- 确认模态层  摄像头video-->
	<div id="confirmModalVideo"  style="z-index:100010;display:none;">
		<div  class="i-skill-mask" style="z-index: 10008"></div>
		<div class="modal-dialog" style="z-index: 10009">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">&times;</button>
					<h4 class="modal-title modal_h">提示</h4>
				</div>
				<div id="confirmmsgVideo" class="modal-body">
				</div>
				<div class="modal-footer">
					<button id="confirmbtnVideo" type="button" class="btn btn-primary">确认</button>
					<button id="cancelbtnVideo" type="button" class="btn btn-default"
						data-dismiss="modal">取消</button>
				</div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal-dialog -->
	</div>
	<!-- /.modal -->
	<!-- 确认模态层 -->
	
	<!-- 提示模态层 -->
	<!-- 确认模态层 -->
	<div id="alertModal" class="modal fade">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">&times;</button>
					<h4 class="modal-title">测评须知</h4>
				</div>
				<div id="alertmmsg" class="modal-body"></div>
				<div class="modal-footer">
					<button id="alertBtn" type="button" class="btn btn-primary">确认</button>
				</div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal-dialog -->
	</div>
	<div id="timeoverModal" class="modal fade">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title">提示</h4>
				</div>
				<div class="modal-body">很抱歉，本次测评时间已到，系统已经自动帮你交卷。</div>
				<div class="modal-footer">
					<button id="timeOverBtn" type="button" class="btn btn-primary">确认</button>
				</div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal-dialog -->
	</div>
	<!-- /.modal -->
	<div id="viewModal" aria-hidden="false" style="display: block;">
		<div id="camera-mask0" class="i-skill-mask"></div>
		<div id="viewbody" class="view-model"
			style="margin-left: -308px; width: 598px; height: auto; z-index: 10001; top: 23px; position: absolute;">
			<div id="camera">

			</div>
			<div id="view-footer" class="view-footer pl10 pr10">
				<p class="text-left">本次测评须使用摄像头和麦克风，务请允许。</p>
				<p class="text-left">
					请点击【允许】，若误点击【拒绝】，请<a onClick="window.location.reload();"
						class="light-blue">【刷新】</a>页面。
				</p>
				<p class="text-left">如果不能正常拍照，请检查浏览器中摄像头权限设置是否为允许。</p>
				<p class="text-left">如果仍然不能正常拍照，请检查网络并重新刷新页面重试，谢谢！</p>
			</div>
		</div>
	
	</div>
	<!-- 提示框 -->
	<div class="modal fade watting_modal" id="modal_waiting">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-body">
					<span class="spinner"></span> <span class="title pull-left"></span>
				</div>
			</div>
		</div>
	</div>
	<!--end 提示框 -->
	
	<!-- 错误提示 -->
<div id="errorAlert" class="modal fade">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        <h4 class="modal-title">错误提示</h4>
      </div>
      <div class="modal-body">
        <p>您的网络出现问题了，请检查网络后重试</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal">确定</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
	<!--end 错误提示 -->
	
		<!--footer -->
		<%@include file="../common/meta.jsp"%>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/plugin/LAB.min.js"></script>
		<script src="<%=request.getContextPath()%>/plugin/jsviews.min.js"></script>
		<script src="<%=request.getContextPath()%>/plugin/spin.min.js"></script>
		<script src="<%=request.getContextPath() %>/plugin/jquery.html5-placeholder-shim.js" type="text/javascript"></script>
		<script src="<%=request.getContextPath() %>/plugin/guide-highlight.js" type="text/javascript"></script>
		<!-- html5摄像头 -->
		<link href="<%=request.getContextPath() %>/flex/style/camera.css"
		rel="stylesheet" />
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/plugin/jpeg_encoder_basic.js"></script>
	    <script type="text/javascript"
			src="<%=request.getContextPath()%>/page/exampaper/camera.js"></script>
		<!--end html5摄像头  -->
		<script type="text/javascript">
 	   var pattern ="${pattern}";
 	   var canWithoutCamera="${sessionScope.candidate.canWithOutCamera}"=="0"?true:false;
 </script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/page/exampaper/exam.js"></script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/page/exampaper/examformal.js"></script>
		<script type="text/javascript"
			src="<%=request.getContextPath()%>/page/exampaper/examIndex.js"></script>
		<!--end footer -->
<script id="selectAnswer" type="text/x-jsrender">
<li>
	<a id="select-{{:select}}" data-select="{{:select}}" class="options">{{:select}}、{{:answer}}</a>
</li> 
</script>
<script id="noticeModel" type="text/x-jsrender">
	<ul>
      	<li>1、{{:partTimeStr}}</li>
		<li>2、每道题都单独计时，时间紧张，务请集中精力作答；</li>
		<li>3、注意：答题过程中，请勿离开答题页面，或者关闭和刷新页面。答题过程中的所有操作会呈现在测评报告中；</li>
     </ul>
</script>
<script id="feedbackModel" type="text/x-jsrender">
<li><input type="radio" id="fbItem{{:key}}"   value="{{:key}}" style="display:none"><label  class="r_option">{{:value}}</label></li>
</script>
<script id="stepModel" type="text/x-jsrender">
<li class="stephead"></li>
{{for steps}}
<li class={{:state}}><label >{{:partDesc}}</label></li>
 {{/for}}
<li class="steptail"></li>
</script>
<script id="countDownTmpl" type ="text/x-jsrender">
	<span>{{:desc}}</span>
	<span class="day">{{:day}}</span>
	<span class="hours">{^{:hours}}</span>
	<span class="minutes">{^{:minutes}}</span>
</script>
<script id="videoTmpl" type="text/x-jsrender">
	<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
					width="598" height="436"
					codebase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab"
					id="VideoOper">
					<param name="movie"
						value="<%=request.getContextPath() %>/flex/VideoOper.swf?contextPath=<%=request.getContextPath() %>" />
					<param name="quality" value="high" />
					<param name="wmode" value="transparent">
					<param name="allowScriptAccess" value="always" />
					<param name="allowFullScreen" value="true" />
					<embed
						src="<%=request.getContextPath() %>/flex/VideoOper.swf?contextPath=<%=request.getContextPath() %>"
						quality="high" FlashVars width="598" height="436" align="middle"
						wmode="transparent" play="true" loop="false" quality="high"
						allowScriptAccess="always" allowFullScreen="true"
						type="application/x-shockwave-flash"
						pluginspage="http://www.adobe.com/go/getflashplayer">
				</object>
</script>
<script id="html5VideoTmpl" type="text/x-jsrender">
<div class="video-wrapper">
	<video id="oVideo" width="598" height="448" class="video-main" >
	</video>
	<canvas id="oCanvas" width="598" height="448"></canvas>
	
	<!-- 拍照  start -->
	<div class="video-bottom-back"></div>
	<div class="video-bottom">
		<span class="block-inline interview-label" id="oTakePhotoTip" style="display: none;">
		请端正坐姿拍一张靓照，给面试官留下好印象！点击拍照&gt;&gt;&gt;</span>
		<img id="oTakePhotoImg" style="display: none;" src="<%=request.getContextPath() %>/flex/assets/loading.png">
		<img id="oTakePhoto" alt="咔嚓拍照" src="<%=request.getContextPath() %>/flex/assets/takephoto.png" style="display: none;">
		<img id="oSurePhoto" alt="确定这张" src="<%=request.getContextPath() %>/flex/assets/surephoto.png" style="display: none;">
		<img id="oCancelPhoto" alt="取消重拍" src="<%=request.getContextPath() %>/flex/assets/cancelphoto.png" style="display: none;">
	</div>
	
	<!-- 允许摄像头的提示  start -->
	<div class="tip-arrow" id="oTipDiv" style="display: none;">
		<img class="block-center" src="<%=request.getContextPath() %>/flex/assets/topArrow.png">
		<p class="block-center uparrow-label">
			此次考试需要用到您的摄像头.<br>请点击上面的“允许”或者“共享选中的设备”。
		</p>
	</div>
	<!-- 允许摄像头的提示  end -->
</div>
</script>
</body>
</html>