<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>百一测评</title>
<%@include file="common/toper.jsp"%>
<link href="<%=request.getContextPath() %>/page/regist.css" rel="stylesheet" />
<style>
  .form-horizontal input.ng-invalid.ng-dirty,.form-horizontal select.ng-invalid.ng-dirty{
        border-color: red;
          outline: 0;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px red;
    box-shadow: inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px red
      }

      .form-horizontal input.ng-valid.ng-dirty,.form-horizontal select.ng-valid.ng-dirty {
  border-color: #66afe9;
    outline: 0;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(102,175,233,0.6);
    box-shadow: inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(102,175,233,0.6)
   }
.fontcolor{
   color: #364658;
  /* font-weight: 700;*/
   font-size:30px;
	padding-top:15px;
	font-family: 'Open Sans',Arial,'Hiragino Sans GB','Microsoft YaHei','微软雅黑','STHeiti','WenQuanYi Micro Hei','SimSun,sans-serif';
}
.htext{
font-size:18px;
}
body{
font-family: 'Open Sans',Arial,'Hiragino Sans GB','Microsoft YaHei','微软雅黑','STHeiti','WenQuanYi Micro Hei','SimSun,sans-serif';
}
.loading{font-size:20px;width:40%;margin-top:30px;}
.contentbox{
	width:85%;margin:40px auto;
}
.fontcolor {
color: #34495e;
font-weight: 600;
font-size: 22px;
padding-top: 14px;
font-family: 'Open Sans',Arial,'Hiragino Sans GB','Microsoft YaHei','微软雅黑','STHeiti','WenQuanYi Micro Hei','SimSun,sans-serif';
}
ul.list {
font-size: 18px;
margin-top: 50px;
margin-bottom: 30px;
}
</style>
</head>
<body  ng-cloak>
<!--header -->
<%@include file="common/evalheader.jsp" %>
<div id="main" style="border:1px solid #dddddd;width:75%;margin:50px auto;">
	<div class="contentbox">
	 		 <h1 class="fontcolor">Hello,${sessionScope.CandidateName}</h1>
		    <h1 class="fontcolor">欢迎参加${sessionScope.CandidateDesc}</h1>
     		 <ul class="list">
				<li>  您已答完<span id="prevPart" style="color:#38afd4;"></span>部分，现在可以继续<span id="nextPart"></span>考试。</li>
			</ul>
         			 <p><button id="goOn" class="btn btn_a" style="width:200px;" >继续考试</button></p>
    </div>
</div>	              			
		  
	<!--bottom -->
<%@include file="common/footer.jsp" %>
<%@include file="common/meta.jsp" %>
<script type="text/javascript">
	(function($){
			var formalPart = [];
			var partobj;
			var getInfoUrl = convertURL(root+"/exam/getInfo");
			var getExamInfoUrl = convertURL(root+"/exam/getCandidateExamInfo");
			var nextPartSeq=null;

			function getInfo(){
				$.ajax({
					  type: "POST",
					  url: getInfoUrl,
					  success: function(msg){
						  if(msg.code=="0"){
								if(msg.data.partDatas){
									//遍历题型，默认前2个是试答题型，后面为正式题型
									var partdata = msg.data.partDatas;
									for(var i=0  in partdata){
											formalPart.push(partdata[i]);
									}
									getExamInfo();
								}else{
									alert("接口服务传值异常，没有传入partDatas");
								}
							}else{
								alert("服务异常，请联系管理员!");
							}
					  },
					  error :function(result){
						  alert("连接服务器接口失败！");
					  }
					});
			}

		function getExamInfo(){
			$.ajax({
				url:getExamInfoUrl,
				success : function(result){
					if(result.code=="0"){
						if(result.data){
							if(result.data.partSeq){
								//还原部分
								partobj= {"questionId":result.data.questionId,"partSeq":result.data.partSeq,"timeLeft":result.data.timeLeft};
							}
							for(var i =0;i<formalPart.length;i++ ){
								if(formalPart[i].partSeq==result.data.partSeq){
									$("#nextPart").text(formalPart[i].partDesc);
									nextPartSeq = formalPart[i].partSeq;
									$("#prevPart").text(formalPart[i-1].partDesc);
								}
							}
						}
					}else{
						alert("服务处理状态异常！");
					}
				},error : function(){
					alert("服务请求失败！");
					return false;
				}
			});
		}
		
		function goPaperPart(){
			if(nextPartSeq===null){
				return false;
			}
			$.ajax({
				url:root+"/exam/goPaperPart/"+nextPartSeq,
				success : function(){
					window.location.href=root+"/exam/formal";
				}
			});
		}
		$(function(){
			getInfo();
			$("#goOn").on("click",function(){
				if(testID && passport){
					$.get(root+'/reCreateSession/'+testID+'/'+passport, function(data) {
						goPaperPart();
					});
				}
			});
		});
	})(jQuery);
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
</script>
</body>
</html>
