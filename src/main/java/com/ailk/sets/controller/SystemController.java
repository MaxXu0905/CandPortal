package com.ailk.sets.controller;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ailk.sets.common.CPResponse;
import com.ailk.sets.common.Constant;
import com.ailk.sets.common.SysBaseResponse;
import com.ailk.sets.platform.intf.cand.service.ICandidateTest;
import com.ailk.sets.platform.intf.common.FuncBaseResponse;
import com.ailk.sets.platform.intf.common.PFResponse;
import com.ailk.sets.platform.intf.empl.domain.CandidateTest;
import com.ailk.sets.platform.intf.empl.service.IInvite;
import com.ailk.sets.platform.intf.exception.PFServiceException;
import com.ailk.sets.platform.intf.model.candidateTest.CandidateInfo;
import com.ailk.sets.platform.intf.model.candidateTest.InvitationOnLine;

@Controller
public class SystemController {
	private static Logger logger = LoggerFactory.getLogger(SystemController.class);
	@Autowired
	@Qualifier("iInviteService")
	private IInvite iInvite;

	@Autowired
	private ICandidateTest candidateTestService;
	@RequestMapping("error")
	public String error() {
		return "error";
	}

	@RequestMapping("finish")
	public String finish() {
		return "finish";
	}

	@RequestMapping("reCreateSession/{testId}/{passport}")
	public @ResponseBody
	CPResponse<PFResponse> reCreateSession(HttpSession session, @PathVariable long testId, @PathVariable String passport) {
		CPResponse<PFResponse> cpResponse = new CPResponse<PFResponse>();
		try {
			CandidateInfo info = iInvite.certify(testId, passport);
			cpResponse.setCode(SysBaseResponse.SUCCESS);
			cpResponse.setData(info);
			if (info.getCode().equals(FuncBaseResponse.ACCESSABLE)) {
				session.setAttribute(Constant.STATUS, info.getCode());
				session.setAttribute(Constant.CANDIDATE, info.getCandidateTest());
				session.setAttribute(Constant.CANDIDATE_NAME, info.getCandidateName());
				session.setAttribute(Constant.CANDIDATE_DESC, info.getCandidateDesc());
			} else {
//				cpResponse.setCode(SysBaseResponse.ESYSTEM);
				logger.error("reCreateSession failed ,code is " + info.getCode() + ",message is" + info.getMessage());
			}
		} catch (PFServiceException e) {
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("error call reCreateSession ", e);
		}
		return cpResponse;
	}

	/**
	 * 给前台手动调用清理session
	 * 
	 * @param session
	 * @return
	 */
	@RequestMapping("clearSession")
	public @ResponseBody
	CPResponse<Long> clearSession(HttpSession session) {
		CPResponse<Long> cpResponse = new CPResponse<Long>();
		try {
			CandidateTest candidateSession = (CandidateTest) session.getAttribute(Constant.CANDIDATE);
			if (candidateSession != null) {
				session.setAttribute(Constant.TESTID, candidateSession.getTestId());
				cpResponse.setData(candidateSession.getTestId());
			}
			session.removeAttribute(Constant.CANDIDATE);
			cpResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call clearSession error ", e);
		}
		return cpResponse;
	}

	@RequestMapping("candidateTest")
	public @ResponseBody
	CPResponse<CandidateTest> getCandidateTest(HttpSession session) {
		CPResponse<CandidateTest> cpResponse = new CPResponse<CandidateTest>();
		try {
			CandidateTest ct = (CandidateTest) session.getAttribute(Constant.CANDIDATE);
			logger.debug("CandidateTest is id {}  " + ct.getTestId());
			cpResponse.setData(ct);
			cpResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("error call getCandidateTest ", e);
		}
		return cpResponse;
	}
	
	@RequestMapping("getInvitationOnLineByPassport/{passport}")
	public @ResponseBody
	CPResponse<InvitationOnLine> getInvitationOnLineByPassport(@PathVariable String passport) {
		CPResponse<InvitationOnLine> cpResponse = new CPResponse<InvitationOnLine>();
		try {
			cpResponse.setData(candidateTestService.getInvitationOnLineByPassport(passport));
			cpResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("error call getInvitationOnLineByPassport ", e);
		}
		return cpResponse;
	}
}
