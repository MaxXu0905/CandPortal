<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>考试完成</title>
<%@include file="common/toper.jsp"%>
<style type="text/css">
<!--

body {
	padding: 10px;
	background-color: #E1E1E1;
}

.weixin {
	width: 600px;
	border: 1px solid #e4e4e4;
	font-size: 14px;
	background-color: #FFFFFF;
	height: 400px;
	margin: 50px auto;
}

.cont {
	margin: 0px auto;
	border-top: 12px solid #38afd4;
	padding: 32px 38px;
}

.title {
	font-size: 24px;
	line-height: 38px;
}

.cord {
	padding-top: 25px;
	border-top: 1px solid #e4e4e4;
	width: 530px;
	margin: 0px auto;
}

.c_l {
	float: left;
	width: 190px;
	text-align: right;
}

.c_l img {
	border: 1px solid #e4e4e4;
}

.c_r {
	float: right;
	width: 310px;
}

.c_r>h2 {
	font-size: 20px;
	line-height: 36px;
	font-weight: 300 !important;
	color: #38afd4;
	margin-bottom: 8px;
}

.c_r>div {
	line-height: 36px;
	background-image: url(core/images/contacticon.png);
	background-repeat: no-repeat;
	background-position: left 2px;
	padding-left: 40px;
	font-size: 14px;
}
-->
</style>
</head>

<body>
	<div class="weixin">
		<div class="cont">
			<div class="title">${sessionScope.message}：<br />您好，您已经完成技术测评，请静候佳音。
			</div>
		</div>
		<div class="cord">
			<!--   <div class="c_l"><img src="core/images/code.gif" alt="" width="186" height="186" /></div> -->
			<!--   <div class="c_r">  -->
			<div>
				<!--   <h2>扫一扫，<br />测评结果早知道！</h2> -->
<!-- 				<div> -->
<!-- 					公众号：百一微测试<br /> -->
<!-- 					客服电话：010-82166778<br />邮箱：employee@101test.com<br /> -->
<!-- 				</div> -->
			</div>
<!-- 			<div style="clear: both;"></div> -->
		</div>

	</div>
</body>
</html>
