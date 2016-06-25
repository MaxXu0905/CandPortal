<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
<meta http-equiv="Cache-Control" content="no-store" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
<link rel="stylesheet" href="${pageContext.request.contextPath }/lib/bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" href="${pageContext.request.contextPath }/plugin/codematrix/lib/codemirror-3.21/lib/codemirror.css">
<link rel="stylesheet" href="${pageContext.request.contextPath }/plugin/codematrix/lib/codemirror-3.21/addon/hint/show-hint.css">
<link rel="stylesheet" href="${pageContext.request.contextPath }/plugin/codematrix/lib/codemirror-3.21/theme/monokai.css">
<script type="text/javascript" src="${pageContext.request.contextPath }/lib/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/lib/bootstrap/js/bootstrap.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/plugin/LAB.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath }/core/js/recodeLoginInfo.js"></script>
<script type="text/javascript">
	var root = "<%=basePath%>";
</script>