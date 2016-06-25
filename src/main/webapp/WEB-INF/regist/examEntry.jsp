<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en" ng-app="registApp">
<head>
<meta charset="UTF-8" />
<title>百一测评</title>
<%@include file="../common/toper.jsp"%>
<style>
.fontcolor{
   color: #34495e;
  font-weight:600;
   font-size:22px;
	padding-top:14px;
	font-family: 'Open Sans',Arial,'Hiragino Sans GB','Microsoft YaHei','微软雅黑','STHeiti','WenQuanYi Micro Hei','SimSun,sans-serif';
}
ul.list {
	list-style-type: disc;font-size:18px;
	margin-left: 21px;
	margin-top: 15px;
}
li{
	padding-bottom: 15px;
}
.contentbox{
	width:85%;margin:40px auto;
}
.alertText{
	color:#ff7800;
	font-size:16px;
}
</style>
</head>
<body>
<!--header -->
<%@include file="../common/evalheader.jsp" %>
<!-- end header -->

<!-- content -->
	<div id="main" style="border:1px solid #dddddd;width:75%;margin:50px auto;">
		<div id="content" class="contentbox">
			<h1 class="fontcolor">请准备好考试环境</h1>
			<ul class="list">
				<li>请使用IE8以上版本或者其他主流浏览器答题</li>
				<li>确保您的电脑摄像头运行正常</li>
				<li>关闭易出现弹窗的应用</li>
			</ul>
			<button id="iknow" class="btn btn-success btn-lg" style="background: #53bf6b;width:178px" type="button">我知道啦</button>
		</div>
		
		<div id="entry" class="contentbox none">
				<h1 class="fontcolor">输入通行证开始考试</h1>
				<div class="input-group">
				  <input id="toExamText"  type="text" class="form-control" placeholder="请输入您的通行证" >
				   <span class="input-group-btn">
				  <button id="toExamBtn" class="btn btn-success" style="background: #53bf6b;" type="button" disabled="disabled">开始考试</button>
				  </span>
				</div>
				
				<div class="pt20">
					<span id="errorText" class="alertText"></span>
				</div>
		</div>
	</div>
<!--end content -->

	<!-- 错误提示 -->
<div id="errorAlert" class="modal fade">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        <h4 class="modal-title">错误提示</h4>
      </div>
      <div id="errorAlertMsg" class="modal-body">
        <p>您的网络出现问题了，请检查网络后重试</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal">确定</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
	<!--end 错误提示 -->
</body>
<%@include file="../common/footer.jsp" %>
<%@include file="../common/meta.jsp" %>
<script src="<%=request.getContextPath() %>/plugin/jquery.html5-placeholder-shim.js" type="text/javascript"></script>
<script>
$(function(){
	$.placeholder.shim();//初始化placeholder
	$("#iknow").on('click',function(){
	 $(this).hide();
	 $("#entry").slideDown("slow");
	 //$("#entry").show();
	});
	$('#toExamBtn').on('click',function(){
		var param = $('#toExamText').val();
		if(!param){
			return;
		}
		toExam(param);
	});
	
	$('#toExamText').on('keyup',function(e){
		if($(this).val().trim()){
			$('#toExamBtn').removeAttr('disabled');
		}else{
			$('#toExamBtn').attr('disabled','disabled');
		}
	});
	$('#toExamText').on('keydown',function(e){
		var key = e.keyCode || e.which;
		if(key===13){
			$('#toExamBtn').triggerHandler('click');
		}
	});
	function toExam(param){
		$.ajax({
			url : root+"/getInvitationOnLineByPassport/"+param,
			type:"GET",
			contentType:"application/json",
			dataType:"json",
			timeout:4000,
			success: function(result){
				if(result.code==0){
					if(result.data && result.data.invitationUrl){
						window.location.href=result.data.invitationUrl;
					}else{
						 if(result.data && result.data.code=="PASSPORTERROR"){
							 $('#errorText').html("没有该通行证，请重新输入。");
						 }else if(result.data && result.data.code=="TIMEOUT"){
							 $('#errorText').html("通行证已过期，无法继续考试。");
						 }else if(result.data && result.data.code=="FINISHEXAM"){
							 $('#errorText').html("已经完成测评，无法继续考试。");
						 }
					}
				}
			},
			error:function(jqXHR,textStatus,errorThrown){
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
	}
});
</script>
</html>