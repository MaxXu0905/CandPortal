<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>百一测评-完成测评</title>
<%@include file="../common/toper.jsp"%>
<link href="<%=request.getContextPath() %>/page/exampaper/exam.css"
	rel="stylesheet" />
<style>
/*扫描二维码*/
#qrcode-pic{
	margin-left: 47px;
	margin-top: 140px;
}
#closeqrCode{
	cursor:pointer;
}


.slogan {
margin-left: 220px;
margin-top: -30px;
font-size: 24px;
font-weight: 600;
color: #38afd4;
}
.code_top {
background-image: url(<%=request.getContextPath() %>/core/images/codetop.png);
height: 65px;
width: 700px;
background-repeat: no-repeat;
position: absolute;
left: -63px;
top: 15px;
color: #FFFFFF;
line-height: 40px;
padding-left: 80px;
}
.codetext {
width: auto;
height: 400px;
padding: 20px;
font-size: 14px;
color: #34495e;
border-radius: 6px;
background-color: #fff;
background-image: url(<%=request.getContextPath() %>/core/images/codebg.png);
background-repeat: no-repeat;
background-position: 45px 75px;
}
/*end 扫描二维码*/
</style>
</head>
<body>
<!--header -->
	<%@include file="/WEB-INF/common/evalheader.jsp"%>
<!-- end header -->

<!-- 主页面 -->
	<div class="mt50 container">
		<div class="row">
			<!-- left -->
			 <div class="pull-left" style="width:50%">
			 <!-- 考试完成 -->
			<div id="examfinish">
					<div class="header">${sessionScope.CandidateName}：</div>
					<div id="detailbody" class="detailbody">
						<span id="go-timeoveralert"></span><br>
						感谢您参加"${sessionScope.CandidateDesc}"。<br>
						请保持电话、邮箱畅通，如果通过测评，我们会很快联系您面谈。<br> 祝您成功！
						<p class="mt50">
							<a class="mr30" style="color: #46ad5d;" id="goTucao">感觉不爽，一起来吐槽！</a>
						</p>
					</div>
				</div>
			 <!--end 考试完成 -->
			 	
			 		<!-- 吐槽 -->
		<div id="feedback" style="display: none;">
			<div>
				<div id="feedback-header" class="header">不满意我们的服务？</div>
				<div id="feedback-detailbody" class="tucaobody">
					<form id="feedbackForm" role="form">
						<div class="form-group form-inline" id="feedBackChoice"></div>
						<div class="form-group">
							<textarea class="form-control " name="fbMore" rows="10"
								placeholder="更多吐槽..."></textarea>
						</div>
						<div class="form-group tar">
							<button type="submit" class="btn btn_a" id="feedbackbtn" style="display:none">吐槽一下</button>
						</div>
					</form>
				</div>
				<div id="feedback-backmsg" class="detailbody hidden">
					感谢对百一测评的关注和支持，您的吐槽将是我们最大的动力，除此之外，您还可以继续发送邮件至service@101test.com吐槽。
				</div>
			</div>
		</div>
		<!--end  吐槽 -->
			 </div>
			 <!--end left -->
		</div>
	</div>
<!--end 主页面 -->
<%@include file="../common/meta.jsp" %>
	<script src="<%=request.getContextPath()%>/plugin/jsviews.min.js"></script>
	<script src="<%=request.getContextPath() %>/plugin/jquery.html5-placeholder-shim.js" type="text/javascript"></script>
<script>
(function($){
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
	//2.调接口提交试卷
	$.ajax({
		async : false,
		url : convertURL(root +"/exam/handInPaper")
	});
	$(function(){
		   $.fn.serializeToObject = function(){
		    	var obj=new Object();  
		    	var arr = this.serializeArray();
		    	for(var i in arr){
		    		if(!arr[i].value){
		    			break;
		    		}
		    		if(obj[arr[i].name]){
		    			obj[arr[i].name]= obj[arr[i].name]+","+arr[i].value;
		    		}else{
		    			obj[arr[i].name]=arr[i].value;
		    		}
		    	
		    	}
		    	return obj;
		    };
		   $('#feedbackForm').on('click','input[type=checkbox]',function(){
			   if( $("input[name='fbItems']:checked").length>0 || $("input[name='fbMore']").val()){
				   $('#feedbackbtn').show();
			   }else{
				   $('#feedbackbtn').hide();
			   }
			  
		   });
		   $('#feedbackForm').on('keyup','textarea',function(){
			   if($(this).val() || $("input[name='fbItems']:checked").length>0){
				   $('#feedbackbtn').show();
			   }else{
				   $('#feedbackbtn').hide();
			   }
			  
		   });
		   $("#goTucao").on("click",function(e){
		    	 $("#examfinish").remove();
			     $("#feedback").show();
			     getFeedBackChoice();
		    });
		   $("#feedbackForm").on("submit",function(e){
		    	var formdata = $(this).serializeToObject();
		    	if(formdata.fbItems || formdata.fbMore){
		    		saveFeedBack(2,formdata);
		    	}else{
		    		$("#feedbackForm")[0].reset();
		    	}
		    	return false;
		    });
		   window.onbeforeunload = function(event) {   
				 //3.清除session
				$.ajax({
					async : false,
					url : root +"/clearSession"
				});
			}
		  
	});
	// 获取反馈信息选择项
	function getFeedBackChoice(){
		$.getJSON(root+"/feedback/getFeedBackChoice",function(result){
			if(result && result.code==0 && result.data){
				//渲染选择题模板
				var htmlOutput = $("#feedbackChoiceModel").render(result.data);  
				$("#feedBackChoice").html(htmlOutput); 
				$.placeholder.shim();
			}
		});
	}
	//提交反馈信息
	function saveFeedBack(type,formData){
		$.ajax({
			url : root+"/feedback/saveFeedBack",
			type : "POST",
			dataType:'json',
  			contentType:"application/json",
  			data:JSON.stringify(formData),
			success:function(result){
				if(result && result.code==0 && result.data.code=='SUCCESS'){
					$("#feedback-detailbody").addClass("hidden");
					$("#feedback-backmsg").removeClass("hidden");
					$("#feedback-header").html("吐槽成功！");
				}else{
					$("#feedbackForm")[0].reset();
				}
			},
			beforeSend:function(){
		    	$('#feedbackbtn').val("提交吐槽中...").attr("disabled","disabled");
			},
			complete:function(){
				$("#feedbackbtn").removeAttr('disabled').html("吐槽一下");
			}
		});
	}
})(jQuery);
</script>
<script id="feedbackChoiceModel" type="text/x-jsrender">
	<label style="width:130px" class="mr30">
  		<input type="checkbox"   name="fbItems" value="{{:key}}" > {{:value}}
	</label>
</script>
</body>
</html>