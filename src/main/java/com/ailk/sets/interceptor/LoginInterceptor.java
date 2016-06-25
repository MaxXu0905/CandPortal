package com.ailk.sets.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.ailk.sets.common.Constant;
import com.ailk.sets.common.RequestOrder;
import com.ailk.sets.platform.intf.cand.service.IExamineService;
import com.ailk.sets.platform.intf.common.FuncBaseResponse;
import com.ailk.sets.platform.intf.empl.domain.CandidateTest;
import com.ailk.sets.platform.intf.empl.service.IInvite;
import com.ailk.sets.platform.intf.model.candidateTest.CandidateInfo;

public class LoginInterceptor extends HandlerInterceptorAdapter {
	private static Logger logger = LoggerFactory.getLogger(LoginInterceptor.class);
	@Autowired
	@Qualifier("iInviteService")
	private IInvite iInvite;
	@Autowired
	private IExamineService examineService;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		HttpSession session = request.getSession();
		CandidateTest candidateSession = (CandidateTest) session.getAttribute(Constant.CANDIDATE);
		StringBuffer url = request.getRequestURL();
		String passport = url.substring(url.lastIndexOf("/") + 1, url.length());
		url = new StringBuffer(url.substring(0, url.lastIndexOf("/")));
		String invitationId = url.substring(url.lastIndexOf("/") + 1, url.length());
		try {
			// if (candidateSession == null) {
			// 进行登录验证
			long invitationIdInt = Long.parseLong(invitationId);
			CandidateInfo info = iInvite.certify(invitationIdInt, passport);
			session.setAttribute(Constant.STATUS, info.getCode());
			if (info.getCode().equals(FuncBaseResponse.ACCESSABLE)) {
				CandidateTest test = info.getCandidateTest();
				session.setAttribute(Constant.CANDIDATE, test);
				//TODO:此处还应该验证一下info.getCandidateTest()是否是空，空的话，应该直接跳错误页面
				session.setAttribute(Constant.CANDIDATE_NAME, info.getCandidateName());
				session.setAttribute(Constant.CANDIDATE_DESC,  info.getCandidateDesc());
				candidateSession = info.getCandidateTest();

			} else {
				session.setAttribute(Constant.CANDIDATE, null);
				session.setAttribute(Constant.MESSAGE, info.getMessage());
				logger.error("jump to error because info.getCode() {} not equals FuncBaseResponse.ACCESSABLE", info.getCode());
				String redirectPath = request.getContextPath();
				if (info.getCode().equals(FuncBaseResponse.FINISHEXAM))
					redirectPath += "/finish";
				else
					redirectPath += "/error";
				response.sendRedirect(redirectPath);
				return false;
			}
			// }
			// 同一浏览器，同时进行考试的拦截暂时去掉
			// else if
			// ((!invitationId.equals(candidateSession.getInvitationId().toString()))
			// || (!candidateSession.getPassport().equals(passport))) {
			// logger.error("candidateSession.getInvitationId is " +
			// candidateSession.getInvitationId() + "--------invitationId is " +
			// invitationId);
			// logger.error("candidateSession.getPassport is " +
			// candidateSession.getPassport() + "----------passport is " +
			// passport);
			// session.setAttribute(Constant.STATUS, SysBaseResponse.EPERM);
			// response.sendRedirect(request.getContextPath() + "/error");
			// return false;
			// }
			// else {
			candidateSession = examineService.getCandidateExamByInviId(candidateSession.getTestId());
			if(candidateSession.getTestId().longValue()  != invitationIdInt){
				logger.warn("the testId is not equal ,please check ,candidateSession testId {}, url testId is  {} ",candidateSession.getTestId(),invitationId);
			}
			// }
			logger.debug("candidateSession for testId {} , status is {} ", invitationId,candidateSession == null ? "" : candidateSession.getSessionState());
			if (candidateSession != null && candidateSession.getSessionState() != null && candidateSession.getSessionState() != Constant.EXAM_PAGE_REGIST) {
				// 从后台获取访问历史
				response.sendRedirect(request.getContextPath() + "/" + RequestOrder.getController(candidateSession.getSessionState()));
				return false;
			}
		} catch (Exception e) {
			logger.error("login exception ", e);
			session.setAttribute(Constant.STATUS, FuncBaseResponse.EXCEPTION);
		}
		return super.preHandle(request, response, handler);
	}

}
