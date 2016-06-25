package com.ailk.sets.controller;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.ailk.sets.platform.intf.cand.service.IWXCandService;
import com.ailk.sets.platform.intf.model.wx.req.ReqFactory;
import com.ailk.sets.platform.intf.model.wx.util.SignUtil;

@Controller
@RequestMapping("/wx")
public class WxController {
	private static String token = "baiyiyingpin";// 与接口配置信息中的Token要一致
	private Logger logger = LoggerFactory.getLogger(WxController.class);

	@Autowired
	@Qualifier("wxCandService")
	private IWXCandService wxService;

	@RequestMapping(method = RequestMethod.GET)
	public void getMethod(HttpServletRequest request, HttpServletResponse response) {
		logger.debug("call wx get method");
		try {
			String signature = request.getParameter("signature");// 时间戳
			String timestamp = request.getParameter("timestamp");// 随机数
			String nonce = request.getParameter("nonce");// 随机字符串
			String echostr = request.getParameter("echostr");
			PrintWriter out = response.getWriter();
	        logger.info("微信Get请求数据：{signature ="+signature+",timestamp="+timestamp+",nonce="+nonce+",echostr="+echostr+"}");
			// 通过检验signature对请求进行校验，若校验成功则原样返回echostr，表示接入成功，否则接入失败
			if (SignUtil.checkSignature(token, signature, timestamp, nonce)) {
				out.print(echostr);
			}
			out.close();
		} catch (IOException e) {
			logger.error("error call wx get ", e);
		}
	}

	@RequestMapping(method = RequestMethod.POST)
	public void postMethod(HttpServletRequest request, HttpServletResponse response) throws Exception {
		try {
			// 将请求、响应的编码均设置为UTF-8（防止中文乱码）
			request.setCharacterEncoding("UTF-8");
			response.setCharacterEncoding("UTF-8");
			logger.debug("call wx post method,wxService is " + wxService );
			ReqFactory reqFactory = new ReqFactory(request.getInputStream(), wxService);
			String result = reqFactory.getReq();
			logger.debug("call wx post method result  " + result );
			response.getWriter().print(result);
		} catch (Exception e) {
			logger.error("error call wx post ", e);
			throw new Exception(e);
		}
	}
}
