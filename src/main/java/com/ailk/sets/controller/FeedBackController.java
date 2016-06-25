package com.ailk.sets.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ailk.sets.common.CPResponse;
import com.ailk.sets.common.Constant;
import com.ailk.sets.common.SysBaseResponse;
import com.ailk.sets.platform.intf.cand.service.ICandidateTest;
import com.ailk.sets.platform.intf.common.ConfigCodeType;
import com.ailk.sets.platform.intf.common.PFResponse;
import com.ailk.sets.platform.intf.empl.domain.CandidateTest;
import com.ailk.sets.platform.intf.empl.domain.ConfigCodeName;
import com.ailk.sets.platform.intf.empl.service.IConfig;
import com.ailk.sets.platform.intf.exception.PFServiceException;
import com.ailk.sets.platform.intf.model.Mapping;
import com.ailk.sets.platform.intf.model.feedback.CandidateTestFeedback;

@Controller
@RequestMapping("feedback")
public class FeedBackController {
	private static Logger logger = LoggerFactory.getLogger(FeedBackController.class);
	@Autowired
	@Qualifier("candidateTestService")
	private ICandidateTest candidateTestService;

	@Autowired
	@Qualifier("configServ")
	private IConfig configServ;

	/**
	 * 获取反馈信息选择项
	 * 
	 * @return
	 */
	@RequestMapping("/getFeedBackChoice")
	public @ResponseBody
	CPResponse<List<Mapping>> getFeedBackChoice() {
		CPResponse<List<Mapping>> cpResponse = new CPResponse<List<Mapping>>();
		try {
			List<ConfigCodeName> list = configServ.getConfigCode(ConfigCodeType.TEST_FEEDBACK_ITEM);
			List<Mapping> map;
			if (!CollectionUtils.isEmpty(list)) {
				map = new ArrayList<Mapping>();
				for (ConfigCodeName configCodeName : list) {
					Mapping mapping = new Mapping();
					mapping.setKey(configCodeName.getId().getCodeId());
					mapping.setValue(configCodeName.getCodeName());
					map.add(mapping);
				}
				cpResponse.setData(map);
			}
			cpResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			logger.error("error call getFeedBackChoice", e);
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
		}
		return cpResponse;
	}

	/**
	 * 保存反馈信息
	 * 
	 * @return
	 */
	@RequestMapping(value = "/saveFeedBack", method = RequestMethod.POST)
	public @ResponseBody
	CPResponse<PFResponse> saveFeedBack(HttpSession session, @RequestBody CandidateTestFeedback candidateTestFeedback) {
		CPResponse<PFResponse> cpResponse = new CPResponse<PFResponse>();
		try {
			CandidateTest candidateSession = (CandidateTest) session.getAttribute(Constant.CANDIDATE);
			long testId;
			if (candidateSession != null)
				testId = candidateSession.getTestId();
			else
				testId = (Integer) session.getAttribute(Constant.TESTID);
			candidateTestFeedback.setTestId(testId);
			cpResponse.setData(candidateTestService.saveFeedBack(candidateTestFeedback));
			cpResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (PFServiceException e) {
			logger.error("error call saveFeedBack", e);
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
		}
		return cpResponse;
	}
}
