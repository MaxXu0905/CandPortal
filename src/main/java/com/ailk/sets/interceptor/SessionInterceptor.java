package com.ailk.sets.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.ailk.sets.common.Constant;
import com.ailk.sets.common.SysBaseResponse;
import com.ailk.sets.platform.intf.common.FuncBaseResponse;
import com.ailk.sets.platform.intf.common.PFResponse;
import com.ailk.sets.platform.intf.empl.domain.CandidateTest;
import com.ailk.sets.platform.intf.empl.service.IInvite;

public class SessionInterceptor extends HandlerInterceptorAdapter {
	private static Logger logger = LoggerFactory.getLogger(SessionInterceptor.class);
	@Autowired
	@Qualifier("iInviteService")
	private IInvite iInvite;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		HttpSession session = request.getSession();
		String type = request.getHeader(Constant.X_REQUEST_TYPE);
		CandidateTest candidateSession = (CandidateTest) session.getAttribute(Constant.CANDIDATE);

		if (candidateSession == null) {
			if ((StringUtils.isNotEmpty(type) && type.equals(Constant.X_REQUEST_VALUE)) || request.getHeader(Constant.X_FLASH_VERSION) != null) {
				// 这是一个 ajax 请求
				JSONObject jo = new JSONObject();
				jo.put("code", SysBaseResponse.ETIME);
				response.getWriter().write(jo.toString());
				session.setAttribute(Constant.STATUS, SysBaseResponse.ETIME);
				return false;
			} else {
				session.setAttribute(Constant.STATUS, SysBaseResponse.ETIME);
				logger.error("jump error because overtime");
				response.sendRedirect(request.getContextPath() + "/error");
				return false;
			}
		} else {
			// System.out.println(candidateSession.getSessionTicket());
			// 验证session的ticket有效性
			PFResponse info = iInvite.certify(candidateSession.getTestId(), candidateSession.getPassport(), candidateSession.getSessionTicket());
			session.setAttribute(Constant.STATUS, info.getCode());
			session.setAttribute(Constant.MESSAGE, info.getMessage());
		}

		String status = (String) session.getAttribute(Constant.STATUS);
		if (!status.equals(FuncBaseResponse.ACCESSABLE)) {
			if (StringUtils.isNotEmpty(type) && type.equals(Constant.X_REQUEST_VALUE)) {
				// 这是一个 ajax 请求
				JSONObject jo = new JSONObject();
				jo.put("code", SysBaseResponse.ETIME);
				response.getWriter().write(jo.toString());
				return false;
			} else {
				logger.error("jump error because status {} not equals FuncBaseResponse.ACCESSABLE", status);
				String redirectPath = request.getContextPath();
				if (status.equals(FuncBaseResponse.FINISHEXAM))
					redirectPath += "/finish";
				else
					redirectPath += "/error";
				response.sendRedirect(redirectPath);
				return false;
			}
		}
		return super.preHandle(request, response, handler);
	}

}
