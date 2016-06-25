package com.ailk.sets.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ailk.sets.common.CPResponse;
import com.ailk.sets.common.Constant;
import com.ailk.sets.common.SearchCondition;
import com.ailk.sets.common.SetsUtils;
import com.ailk.sets.common.SysBaseResponse;
import com.ailk.sets.grade.intf.BaseResponse;
import com.ailk.sets.grade.intf.IGradeService;
import com.ailk.sets.platform.intf.cand.domain.CandidateInfoExt;
import com.ailk.sets.platform.intf.cand.domain.InfoNeeded;
import com.ailk.sets.platform.intf.cand.service.ICandidateInfoService;
import com.ailk.sets.platform.intf.cand.service.ICandidateTest;
import com.ailk.sets.platform.intf.common.PFResponse;
import com.ailk.sets.platform.intf.empl.domain.CandidateTest;
import com.ailk.sets.platform.intf.empl.domain.EmployerOperationLog;
import com.ailk.sets.platform.intf.exception.PFServiceException;
import com.ailk.sets.platform.intf.model.Mapping;

/**
 * 应聘人信息控制器
 * 
 * @author 毕希研
 * 
 */
@RestController
@RequestMapping("info")
public class InfoController {

	@Autowired
	private ICandidateInfoService candidateInfoService;
	
	@Autowired
	private IGradeService gradeService;
	
	@Autowired
	private ICandidateTest candidateTestService;

	private Logger logger = LoggerFactory.getLogger(InfoController.class);

	@RequestMapping("/getQRCodePicUrl")
	public @ResponseBody
	CPResponse<String> getQRCodePicUrl(HttpSession session) {
		CPResponse<String> cpResponse = new CPResponse<String>();
		try {
			CandidateTest candidateSession = (CandidateTest) session.getAttribute(Constant.CANDIDATE);
			cpResponse.setData(candidateTestService.getQRPicUrl(candidateSession.getTestId()));
			cpResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (PFServiceException e) {
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("get input info error ", e);
		}
		return cpResponse;
	}

	/**
	 * 获取输入控件信息
	 * 
	 * @param session
	 * @return
	 */
	@RequestMapping("/getInput")
	public @ResponseBody
	CPResponse<List<InfoNeeded>> getInputInfo(HttpSession session,HttpServletRequest request) {
		CPResponse<List<InfoNeeded>> cpResponse = new CPResponse<List<InfoNeeded>>();
		try {
			CandidateTest candidateSession = (CandidateTest) session.getAttribute(Constant.CANDIDATE);
			long testId = candidateSession.getTestId();
			logger.debug("logger watcher3,{},{},"+System.currentTimeMillis()+"," + SetsUtils.getIpAddr(request),testId,session.getId());
			List<InfoNeeded> list = candidateInfoService.getCandConfigInfoExts(testId);
			logger.debug("InfoNeed size is {}", list.size());
			cpResponse.setData(list);
			cpResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			logger.error("get input info error ", e);
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
		}
		return cpResponse;
	}

	/**
	 * 获取输入控件信息
	 * 
	 * @param session
	 * @return
	 */
	@RequestMapping("/getBySearchCondition")
	public @ResponseBody
	CPResponse<List<Mapping>> getBySearchCondition(HttpSession session, @RequestBody SearchCondition condition) {
		logger.debug("searchCondition is {}", condition.toString());
		CPResponse<List<Mapping>> cpResponse = new CPResponse<List<Mapping>>();
		try {
			CandidateTest candidateSession = (CandidateTest) session.getAttribute(Constant.CANDIDATE);
			long testId = candidateSession.getTestId();
			logger.debug("get input info testId is {}", testId);
			String infoId = condition.getInfoId();
			String searchName = condition.getSearchName();
			if (StringUtils.isEmpty(searchName)) {
				searchName = "";
			}
			List<Mapping> list = candidateInfoService.getQueryInfoBySearchName(testId, infoId, searchName, Constant.SEARCH_SIZE);
			logger.debug("InfoNeed size is {}", list == null ? 0 : list.size());
			cpResponse.setData(list);
			cpResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			logger.error("get input info error ", e);
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
		}
		return cpResponse;
	}

	/**
	 * 提交应聘者信息
	 * 
	 * @param param
	 * @param response
	 * @throws IOException
	 */
	@RequestMapping(value = "/commit", method = RequestMethod.POST)
	public CPResponse<BaseResponse> commitInfo(HttpServletResponse response, HttpSession session, @RequestBody List<CandidateInfoExt> list) throws IOException {
		logger.debug("commit info start ...");
		CPResponse<BaseResponse> cpResponse = new CPResponse<BaseResponse>();
		try {
			CandidateTest ce = (CandidateTest) session.getAttribute(Constant.CANDIDATE);
			boolean result = candidateInfoService.saveCandidateInfo(ce.getTestId(), list);
			if (result == false) {
				logger.error("saveCandidateInfo error ");
				cpResponse.setCode(SysBaseResponse.ESYSTEM);
				cpResponse.setMessage("保存参数异常");
				return cpResponse;
			}
			// CandidateTest ce = (CandidateTest)
			// session.getAttribute(Constant.CANDIDATE);
			BaseResponse checkData = gradeService.chechEnv(ce.getTestId());
			if (checkData.getErrorCode() != BaseResponse.SUCCESS) {
				logger.error("check env error , code is {}, desc is {} ", checkData.getErrorCode(), checkData.getErrorDesc());
				cpResponse.setCode(checkData.getErrorCode() + "");
				cpResponse.setMessage(checkData.getErrorDesc());
				return cpResponse;
			}
			cpResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("commit info or checkEnv error ", e);
		}
		return cpResponse;
	}

	/**
	 * 检测答题环境
	 * 
	 * @param session
	 * @return
	 */
	@RequestMapping("/checkEnv")
	public CPResponse<BaseResponse> checkEnv(HttpSession session) {
		CPResponse<BaseResponse> cpResponse = new CPResponse<BaseResponse>();
		try {
			CandidateTest ce = (CandidateTest) session.getAttribute(Constant.CANDIDATE);
			cpResponse.setData(gradeService.chechEnv(ce.getTestId()));
			cpResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			logger.error("checkEnv error ", e);
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
		}
		return cpResponse;
	}
	
	
	@RequestMapping(value = "/saveOperLog", method = { RequestMethod.POST })
	public @ResponseBody
	CPResponse<PFResponse> saveOperLog(HttpServletRequest request,HttpSession session,@RequestBody EmployerOperationLog log) {
		CandidateTest ce = (CandidateTest) session.getAttribute(Constant.CANDIDATE);
		long testId = ce.getTestId();
		log.setClientIp(SetsUtils.getIpAddr(request));
		logger.debug("saveOperLog , logInfo is {} , testId  {} , ip is " + log.getClientIp(),log, testId);
		CPResponse<PFResponse> epResponse = new CPResponse<PFResponse>();
		try {
			PFResponse pf = candidateTestService.updateCandidateTestLog(testId, log);
			epResponse.setData(pf);
			epResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			epResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call cooperate error ", e);
		}
		return epResponse;
	}
}
