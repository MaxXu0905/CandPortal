<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<link href="${pageContext.request.contextPath }/lib/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath }/core/css/sets.css" rel="stylesheet" type="text/css" />
</head>
<body>
<body class="errorbg" style="margin:0px;padding:0px;">
   <div class="error_c"> 
   <div class="www">百一测评 www.101test.com</div>
   <div class="sorry_b">
      <div class="errortext">
         出错信息
      </div>
   </div>
   </div>
</body>



	
</body>
<script type="text/javascript">
	var status = "${sessionScope.status}";
	var msg = "${sessionScope.message}";
	var errormsg = document.getElementById('error');
	if (status == "EXCEPTION") {
		errormsg.innerText = "百一测评系统异常了，马上联系百一测评客服：010-82166778，或者发送邮件：101test@asiainfo-linkage.com。\n给您的带来的不便，敬请谅解。";
	} else {
		errormsg.innerText = msg;
	}
</script>
</html>