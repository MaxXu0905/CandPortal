<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<script src="http://libs.baidu.com/jquery/1.9.1/jquery.min.js"></script>
<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
<script type="text/javascript">
	var root = "${pageContext.request.contextPath}";
	var testID="${sessionScope.candidate.testId}",passport="${ sessionScope.candidate.passport}"; 
	var screen_width,screen_height;
	window.jQuery || document.write("<script src='"+root+"/lib/jquery-1.9.1.min.js'>"
			+ "<"+"/script>");
	document.write("<script src='"+root+"/lib/bootstrap/js/bootstrap.min.js'>" + "<"+"/script>");
</script>
<%--   <script src="${pageContext.request.contextPath}/plugin/css3-mediaqueries.js"></script> --%>
<!--[if lt IE 9]>
  <script src="${pageContext.request.contextPath}/plugin/html5.js"></script>
  <script src="${pageContext.request.contextPath}/plugin/respond.min.js"></script>
  <![endif]-->
<script>
/*获取时间戳*/
function getRootTimestamp(){
	var date = new Date(); 
	var year = date.getFullYear(); 
	var month = date.getMonth()+1; 
	var day = date.getDate();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds(); 
	var timestamp = String(year)+String(month)+String(day)+String(hours)+String(minutes)+String(seconds);
	return timestamp;
}
/*设置cookie*/
 function getCookie(c_name)
{
if (document.cookie.length>0){
  var c_start=document.cookie.indexOf(c_name + "=");
  if (c_start!=-1)
    { 
    c_start=c_start + c_name.length+1 ;
    var c_end=document.cookie.indexOf(";",c_start);
    if (c_end==-1) c_end=document.cookie.length;
    return document.cookie.substring(c_start,c_end);
    } 
  }
return ""
}
 function setCookie(c_name,value,expiredays)
 {
 var exdate=new Date()
 exdate.setDate(exdate.getDate()+expiredays);
 document.cookie=c_name+ "=" +value+
 ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
 }

 function checkCookie(c_name)
 {
  var username=getCookie(c_name)
 if (username!=null && username!=""){
	return username;
 }
 }
 function setPageHeight(){
		var windowHeight = $(window).height()-150;
		var contentHeight = $('#main').height();
		if(contentHeight<windowHeight){
			$("#footer").addClass('navbar-fixed-bottom');
		}else{
			$("#footer").removeClass('navbar-fixed-bottom');
		}
 }
/*end 设置cookie*/
     /*定位屏幕高度来固定底部，用来适应大屏*/
     (function($){
    	 $(function() {
    		 	setPageHeight();
    			$(window).on('resize',function(){
    				setPageHeight();
    			}); 
    	 });
     })(jQuery);
	/**
	 * 返回到顶部的小插件 约定页面底部区域使用id为footer的元素标识 样式对应在sets.css
	 */
	(function($) {
		$(function() {
			$(window).scroll(function() {
				if ($(this).scrollTop() > 100) {
					$('#backtotop').addClass('showme');
				} else {
					$('#backtotop').removeClass('showme');
				}
			});

			// 飞起来
			$('#backtotop').click(function() {
				$('body,html').animate({
					scrollTop : 0
				}, 400);
				return false;
			});
		});

		if ($(window).scrollTop() == 0) {
			$('#backtotop').removeClass('showme');
		} else {
			$('#backtotop').addClass('showme');
		}
	})(jQuery);
</script>
<!--[if lt IE 8]>
	<script type='text/javascript'>
		$(function(){
			document.write('对不起，您使用的浏览器版本过低(IE7或者更低)，请升级IE浏览器或者使用Chrome，Firefox，Safari等现代浏览器');	
   		});
	</script>
<![endif]-->

