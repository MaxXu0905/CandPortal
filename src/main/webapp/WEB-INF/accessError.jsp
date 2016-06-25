<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link href="${pageContext.request.contextPath }/lib/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath }/core/css/sets.css" rel="stylesheet" type="text/css" />
<title>错误</title>
</head>
<body class="errorbg" style="margin:0px;padding:0px;">
   <div class="error_c"> 
   <div class="www">百一测评 www.101test.com</div>
   <div class="sorry">
      <div class="errortext">
         <div id="error"></div>
      </div>
   </div>
   </div>
</body>
<script type="text/javascript">
	var msg = "${errMessage}";
	var errormsg = document.getElementById('error');
	if(msg){
		errormsg.innerHTML = msg;
	}else{
		errormsg.innerHTML = "百一测评答题服务端访问异常，请检查您的本地网络是否连接正常，如本地网络正常请马上联系百一测评客服：010-82166778，或者发送邮件：101test@asiainfo-linkage.com。\n给您的带来的不便，敬请谅解。";
	}
	
</script>
</html>