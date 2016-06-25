<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en" ng-app="registApp">
<head>
<meta charset="UTF-8" />
<title>百一测评</title>
<%@include file="../common/toper.jsp"%>
<link href="<%=request.getContextPath() %>/page/regist.css" rel="stylesheet" />
<style>
  .form-horizontal input.ng-invalid.ng-dirty,.form-horizontal select.ng-invalid.ng-dirty{
        border-color: red;
          outline: 0;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px red;
    box-shadow: inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px red
      }
  .submited input.ng-invalid,.submited select.ng-invalid{
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
#imgtop{
/*
background:url("<%=request.getContextPath() %>/core/images/topImg.png") top center;
*/ 
}
.fontcolor{
   color: #34495e;
  font-weight:600;
   font-size:22px;
	padding-top:14px;
	font-family: 'Open Sans',Arial,'Hiragino Sans GB','Microsoft YaHei','微软雅黑','STHeiti','WenQuanYi Micro Hei','SimSun,sans-serif';
}
.htext{
font-size:18px;
}
body{
font-family: 'Open Sans',Arial,'Hiragino Sans GB','Microsoft YaHei','微软雅黑','STHeiti','WenQuanYi Micro Hei','SimSun,sans-serif';
}
.loading{font-size:20px;width:40%;margin-top:30px;}
</style>
</head>
<body  >
<!--header -->
<%@include file="../common/evalheader.jsp" %>
<div id="main" class="center-block">
<div style="border:1px solid #dddddd;width:90%;margin:10px auto;">
	<div class="form-group" id="imgtop" style="border-bottom:4px solid #ddecf3;width:90%;margin:0px auto;padding-bottom:10px;margin-bottom:20px;"> 
		<div class="row">
		    <div class="col-md-12">
		    <!--   -->
		    <h1 class="fontcolor">Hello，${sessionScope.CandidateName}，欢迎参加${sessionScope.CandidateDesc}</h1>
		  <!--   <span class="f16">欢迎参加${sessionScope.CandidateDesc}</span> -->
		    </div>
		 </div>  				
	</div>
	<div id="loading" class="text-center clearfix center-block loading">
             <div class="alert alert-warning">
      		     <i class="fa fa-spinner fa-spin  fa-3x"></i><br>正在加载个人资料....
      		</div>
    </div>
	<!--基本信息 -->
	    <div id="regist-wrap-inner" class="hidden panel"  ng-controller="RegistController">

	   		<div class="alert alert-warning fade in " ng-show="alertShow" >
        	<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
        	  {{alertInfo}}
      		</div> 
	   		<div class="row" ng-show="!loading" style="padding:0px 14px;">
			<form ng-cloak  name="registForm" class="form-horizontal {{registForm.submittedClass}}" novalidate ng-submit="submitInfo(items)">
			<!-- AngulaJs 封装模板 -->	
<!-- 继续答题  -->	 		              			
<!-- end  -->			
	
			 <div  ng-repeat="item in items" ng-switch on="item.valueType" >
			 	 <div class="form-group" >
			 	 	 <label  class="col-xs-12 col-sm-2 col-md-2 control-label" ng-bind="item.infoName"></label>
			 	 	 <div ng-switch-when="select" ng-form="select">
			 	 	 	<div class="col-sm-5 col-md-5" >
			 	 	 	<select class="select" id="{{item.infoId}}" ng-model="item.value" ng-options="m.key as m.value for m in item.range" set-real-value required>
  							<option value="">请选择</option>
						</select>
			 	 	 	<span  ng-show="(select.$dirty && select.$error.required ) || (select.$error.required && registForm.submitted)" style="color:red">请选择{{item.infoName}}</span>
			 	 	 	</div>
			 	 	 </div>
			 	 	 <div class="col-sm-5 col-md-5" ng-switch-when="label">
			 	 	  		<label for="name" ng-bind="item.value"></label></input>
			 	 	 </div>
			 	  	 <div ng-switch-when="input" ng-form="input">
			 	 	  <div class="col-sm-5 col-md-5"  >
			 	 	  	 <input type="text" ng-model="item.value" class="form-control"  name="{{item.infoId}}" placeholder="请输入{{item.infoName}}" ng-focus="clearInput($event.target,item.value)" ng-maxlength="{{item.valueLength}}" ng-pattern="/{{item.verifyExp}}/"  required />
			 	 	 </div><span class="col-xs-4 col-sm-4 col-md-4" ng-show="(input.$dirty && input.$error.required ) || (input.$error.required && registForm.submitted)" style="color:red">请填写{{item.infoName}}</span> 
			 	 	       <span class="col-xs-4 col-sm-4 col-md-4" ng-show="(input.$dirty && input.$error.pattern ) || (input.$error.pattern && registForm.submitted)" style="color:red">请填写正确的{{item.infoName}}</span> 
				     	   <span class="col-xs-4 col-sm-4 col-md-4" ng-show="(input.$dirty && input.$error.maxlength) || (input.$error.maxlength && registForm.submitted)" style="color:red">{{item.infoName}}不能超过{{item.valueLength}}位</span> 
			 	 	 </div>
			 	 	  <div ng-switch-when="query" ng-form="query">
			 	 	  <div class="col-sm-5 col-md-5" >
			 	 	 	  <input type="text" ng-model="item.value" id="{{item.infoId}}" name="{{item.infoId}}"  ng-focus="onFocusQuery($event.target)" ng-blur="onBlurQuery($event.target)" ng-keydown="queryFocus($event)" to-search="{{item.infoId}}" class="form-control" placeholder="请输入{{item.infoName}}" ng-focus="clearInput($event.target,item.value)"  ng-maxlength="{{item.valueLength}}" required />
			 	 	 	  	<ul  class="query-menu" ng-show="$parent.$parent.showQuery" ng-mouseover="queryHover($event.target)" ng-mouseleave="$parent.$parent.isqueryHover=false">
								<li role="presentation" ng-repeat="i in queryitems" ng-click="setQueryValue($event.target,item.infoId)">
									<a role="menuitem">{{i.value}}</a>
								</li>
							</ul> 
			 	 	 </div><span class="col-xs-2 col-sm-2 col-md-2" ng-show="(query.$dirty && query.$error.required) || (query.$error.required && registForm.submitted)" style="color:red">请填写{{item.infoName}}</span> 
				     <span class="col-xs-2 col-sm-2 col-md-2" ng-show="(query.$dirty && query.$error.pattern) || (query.$error.pattern && registForm.submitted)" style="color:red">请填写正确的{{item.infoName}}</span> 
				     <span class="col-xs-2 col-sm-2 col-md-2" ng-show="(query.$dirty && query.$error.maxlength ) || (query.$error.maxlength && registForm.submitted)" style="color:red">{{item.infoName}}不能超过{{item.valueLength}}位</span> 
				    </div>
				     <div class="col-xs-12 col-sm-10 col-md-10 form-inline" ng-switch-when="address"  >
				     <input type="hidden" id="{{item.infoId}}" value="{{item.value}}"/>
				     <select class="col-sm-4 col-md-4 col-xs-4 form-control" name="{{item.infoId}}-province"  ng-options="p.regionId as p.regionName for p in item.extendInfo" ng-model="item.currentProvince"  change-province ng-change="changeProvince(item.infoId,item.currentProvince,$event)" ng-init="initAddress($index,item.currentProvince)" required>
				     	<option value="">省份</option>
				     </select>
				     <select ie-select-fix="item.city" class="col-sm-4 col-md-4 col-xs-4 form-control" name="{item.infoId}}-city" ng-options="c.regionId as c.regionName for c in item.city" ng-model="item.currentCity" change-city required>
				     	 <option value="">市</option>
					 </select>
					 <span class="col-xs-4 col-sm-4 col-md-4" ng-show="(registForm.city.$dirty && registForm.city.$error.required) || (registForm.city.$error.required && registForm.submitted)" style="color:red">请选择{{item.infoName}}</span> 
				     </div>
			 	 </div>
			 </div>
			 <!--end AngulaJs 封装模板 -->
			  <div class="form-group">
			    <div class="col-xs-offset-2 col-xs-10 col-md-10" ng-init="getInvitationTimeInfo()">
			      <input type="submit"  class="btn btn_a"  value="{{btnValue}}" ng-disabled="btnIsDisabled" />
			    </div>
			  </div>  
			</form>  
				<div class="alert alert-warning alert-dismissible fade in" role="alert" style="width:90%;margin:0px auto;padding-bottom:10px;margin-bottom:20px;" ng-show="isSecToEffDate">
			      <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
			          距离考试时间还有 <strong class="red" style="font-size:1.5em" ng-model="secToEffDate"> {{secToEffDate.day}}{{secToEffDate.hours}}{{secToEffDate.minutes}}</strong> ，现在你可以开始做个练习或者调整个舒服的姿势。
    			</div>
			</div> 
	  	 </div>
</div>
</div>
	<!--bottom -->
<%@include file="../common/footer.jsp" %>
<%@include file="../common/meta.jsp" %>
<script src="<%=request.getContextPath() %>/plugin/angular.min.js" type="text/javascript"></script>
<script src="<%=request.getContextPath() %>/plugin/jquery.html5-placeholder-shim.js" type="text/javascript"></script>
<script src="<%=request.getContextPath() %>/page/recodeLoginInfo.js" type="text/javascript"></script>
<script src="<%=request.getContextPath() %>/page/registController.js" type="text/javascript"></script>

</body>
</html>
