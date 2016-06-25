<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
</head>
<body>

<div class="video-wrapper">
	<video id="oVideo" width="100%" height="100%" class="video-main">
	</video>
	<canvas id="oCanvas" width="640" height="480" ></canvas>
	

</div>
	<script type="text/javascript"
			src="<%=request.getContextPath()%>/lib/jquery-1.9.1.min.js"></script>	
	<script src="<%=request.getContextPath()%>/lib/bootstrap/js/bootstrap.min.js"></script>
	<script type="text/javascript"
			src="<%=request.getContextPath()%>/plugin/spin.min.js"></script>	
	<script type="text/javascript"
			src="<%=request.getContextPath()%>/plugin/jpeg_encoder_basic.js"></script>
	<script type="text/javascript"
			src="<%=request.getContextPath()%>/page/exampaper/camera1.js"></script>
</body>
</html>