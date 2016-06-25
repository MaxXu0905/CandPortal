package com.ailk.sets.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.ailk.sets.common.SetsUtils;

public class LogInterceptor extends HandlerInterceptorAdapter {
	private static Logger logger = LoggerFactory
			.getLogger(LogInterceptor.class);

	@Override
	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
		HttpSession session = request.getSession();
		logger.info("logger watcher1,{},{}," + System.currentTimeMillis() + ","
				+ SetsUtils.getIpAddr(request), request.getRequestURL(),
				session.getId());//url,sessionId,time,ip
		return super.preHandle(request, response, handler);
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		HttpSession session = request.getSession();
		logger.info("logger watcher2,{},{}," + System.currentTimeMillis() + ","
				+ SetsUtils.getIpAddr(request), request.getRequestURL(),
				session.getId());//url,sessionId,time,ip
		super.afterCompletion(request, response, handler, ex);
	}
}
