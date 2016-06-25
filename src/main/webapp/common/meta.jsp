<%	
	String path = request.getContextPath();			
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()					+ path + "/";
%>
<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Cache-Control" content="no-store" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
<link rel="stylesheet" href="lib/bootstrap/css/bootstrap.min.css">
<script type="text/javascript" src="lib/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="plugin/LAB.min.js"></script>
<script type="text/javascript" src="lib/bootstrap/js/bootstrap.min.js"></script>
<script type="text/javascript" src="common/utils.js"></script>
<script type="text/javascript" >
	var CTX = "<%=basePath %>";
</script>