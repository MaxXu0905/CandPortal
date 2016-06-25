package com.ailk.sets.common;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.dubbo.common.utils.StringUtils;

public class SetsUtils {
	private static Logger logger = LoggerFactory.getLogger(SetsUtils.class);

	public static String getIpAddr(HttpServletRequest request) {
		String ip = null;
		try {
			ip = request.getHeader("x-forwarded-for");
			if (StringUtils.isEmpty(ip) || "unknown".equalsIgnoreCase(ip)) {
				ip = request.getHeader("Proxy-Client-IP");
			}
			if (StringUtils.isEmpty(ip) || "unknown".equalsIgnoreCase(ip)) {
				ip = request.getHeader("WL-Proxy-Client-IP");
			}
			if (StringUtils.isEmpty(ip) || "unknown".equalsIgnoreCase(ip)) {
				ip = request.getRemoteAddr();
			}
			if (StringUtils.isEmpty(ip) || "unknown".equalsIgnoreCase(ip)) {
				ip = request.getHeader("http_client_ip");
			}
			if (StringUtils.isEmpty(ip) || "unknown".equalsIgnoreCase(ip)) {
				ip = request.getHeader("HTTP_X_FORWARDED_FOR");
			}
			// 如果是多级代理，那么取第一个ip为客户ip
			if (ip != null && ip.indexOf(",") != -1) {
				ip = ip.substring(ip.indexOf(",") + 1, ip.length()).trim();
			}
		} catch (Exception e) {
			logger.error("error to get ip ", e);
		}
		return ip;
	}
}
