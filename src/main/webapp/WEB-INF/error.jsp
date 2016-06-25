<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link
	href="${pageContext.request.contextPath }/lib/bootstrap/css/bootstrap.min.css"
	rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath }/core/css/sets.css"
	rel="stylesheet" type="text/css" />
<title>错误</title>
</head>
<body class="errorbg" style="margin: 0px; padding: 0px;">
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
	var status = "${sessionScope.status}";
	var msg = "${sessionScope.message}";
	var errormsg = document.getElementById('error');
	if (status == "EXCEPTION") {
		errormsg.innerHTML = "百一系统异常了，马上联系百一客服：010-82166778，<br/>或者发送邮件：service@101test.com。<br/>给您的带来的不便，敬请谅解。";
	}
	/*else if (status == 8) {
		errormsg.innerHTML = "请不要同时进行考试。如果不能进入另一次考试，请尝试清空浏览器缓存或者重启浏览器进入。如果不能进行正常考试，马上联系百一客服：010-82166778，或者发送邮件：service@101test.com。\n给您的带来的不便，敬请谅解。";
	} */
	else if (status == 13) {
		errormsg.innerHTML = "考试会话超时，请重新从邮件中拷贝考试链接到浏览器。如果不能进行正常考试，马上联系百一客服：010-82166778，或者发送邮件：service@101test.com。\n给您的带来的不便，敬请谅解。";
	} else {
		errormsg.innerHTML = msg;
	}
</script>
</html>