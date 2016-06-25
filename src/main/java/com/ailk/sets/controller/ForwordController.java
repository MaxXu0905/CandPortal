package com.ailk.sets.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ailk.sets.common.Constant;
import com.ailk.sets.platform.intf.cand.service.IExamineService;
import com.ailk.sets.platform.intf.common.FuncBaseResponse;
import com.ailk.sets.platform.intf.empl.domain.CandidateTest;
import com.ailk.sets.thread.PaperCreateThread;

/**
 * 
 * sets
 * 
 * @Description 页面跳转
 * @author zengjie
 * @Date 2014年2月19日
 * @version
 * 
 */
@Controller
public class ForwordController {
	private static Logger logger = LoggerFactory.getLogger(ForwordController.class);

	@Autowired
	private IExamineService examineService;

	@RequestMapping(value = "goToError")
	public String goToError(HttpSession session) {
		logger.error("call goToError jump to error");
		session.setAttribute(Constant.STATUS, FuncBaseResponse.EXCEPTION);
		return "error";
	}

	/**
	 * 
	 * @Description: 跳转补充信息
	 * @return zengjie 2014年2月19日
	 */
	@RequestMapping("regist/{invitationId}/{passport}")
	public String regist(HttpSession session, @PathVariable long invitationId, @PathVariable String passport) {
		String status = (String) session.getAttribute(Constant.STATUS);
		if (status.equals(FuncBaseResponse.SUCCESS) || status.equals(FuncBaseResponse.ACCESSABLE)) {
			examineService.updateCandidateExamStatus(invitationId, Constant.EXAM_PAGE_REGIST);
			String paperState = examineService.getCandidateTestPaperState(invitationId).getCode();
			if("-1".equals(paperState)){//如果是-1 则改为0
				examineService.updateCandidateTestPaperState(invitationId, 0);
			}
			new Thread(new PaperCreateThread(examineService, invitationId, passport)).start();
			return "regist/regist";
		} else
			return "error";
	}

	/**
	 * 
	 * @Description: 跳转答题
	 * @return zengjie 2014年2月19日
	 */
	@RequestMapping("exam/{pattern}")
	public String exam(HttpServletRequest request, HttpSession session, @PathVariable String pattern) {
		if ("sample".equals(pattern)) {
			request.setAttribute("pattern", "sample");
			CandidateTest candidateSession = (CandidateTest) session.getAttribute(Constant.CANDIDATE);
			examineService.updateCandidateExamStatus(candidateSession.getTestId(), Constant.EXAM_PAGE_TEST);
		} else if ("formal".equals(pattern)) {
			CandidateTest candidateSession = (CandidateTest) session.getAttribute(Constant.CANDIDATE);
			examineService.updateCandidateExamStatus(candidateSession.getTestId(), Constant.EXAM_PAGE_ANSWERING);
			request.setAttribute("pattern", "formal");
		}
		return "exam/examIndex";
	}

	@RequestMapping("login/{invitationId}/{passport}")
	public String login(HttpSession session, @PathVariable long invitationId, @PathVariable String passport) {
		String status = (String) session.getAttribute(Constant.STATUS);
		if (status.equals(FuncBaseResponse.SUCCESS) || status.equals(FuncBaseResponse.ACCESSABLE))
			return "index";
		else
			return "error";
	}

	@RequestMapping("tempIndex")
	public String tempIndex() {
		return "tempIndex";
	}
	
	@RequestMapping("accessError")
	public String accessError(HttpServletRequest request){
		if(!StringUtils.isBlank(request.getParameter("errMessage"))){
			request.setAttribute("errMessage", request.getParameter("errMessage"));
		}
		return "accessError";
	}
	

	@RequestMapping("examfinish")
	public String examfinish() {
		return "exam/examfinish";
	}
}
