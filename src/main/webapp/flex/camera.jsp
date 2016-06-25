<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />

	<link href="<%=request.getContextPath() %>/flex/style/camera.css"
		rel="stylesheet" />
	<link href="<%=request.getContextPath()%>/lib/bootstrap/css/bootstrap.min.css" rel="stylesheet">

	<script type="text/javascript">
		var browserMark=null,nVersion=navigator.appVersion;
		var browserName = navigator.userAgent.toLowerCase();
		alert("browserName"+browserName);
		if(/msie/i.test(browserName) && !/opera/.test(browserName)){  
	        alert("IE");  
	    }
		
		if(/360/i.test(nVersion) || /360/i.test(navigator.userAgent)){
	      browserMark='360';
	    }
	    
	    if(!!window.ActiveXObject || "ActiveXObject" in window){
	        browserMark='ie';
	    }
	    
	    alert(browserMark);
	    
	</script>
</head>
<body>


</body>
</html>