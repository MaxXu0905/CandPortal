package com.ailk.sets.controller;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;

import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.apache.commons.beanutils.BeanUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.ailk.sets.common.CPResponse;
import com.ailk.sets.common.Constant;
import com.ailk.sets.common.ExamAnswerInfo;
import com.ailk.sets.common.ExamQuestionAnswerInfo;
import com.ailk.sets.common.GetQInfoResponseExt;
import com.ailk.sets.common.SysBaseResponse;
import com.ailk.sets.grade.intf.BaseResponse;
import com.ailk.sets.grade.intf.CommitFile;
import com.ailk.sets.grade.intf.GetQInfoResponse;
import com.ailk.sets.grade.intf.IGradeService;
import com.ailk.sets.grade.intf.RunTestResponse;
import com.ailk.sets.platform.intf.cand.domain.CandidateExamInfo;
import com.ailk.sets.platform.intf.cand.domain.ExamineTimeInfo;
import com.ailk.sets.platform.intf.cand.domain.InvitationTimeInfo;
import com.ailk.sets.platform.intf.cand.domain.PaperData;
import com.ailk.sets.platform.intf.cand.domain.PaperMarkData;
import com.ailk.sets.platform.intf.cand.domain.QuestionExt;
import com.ailk.sets.platform.intf.cand.service.ICandidateTest;
import com.ailk.sets.platform.intf.cand.service.IExamineService;
import com.ailk.sets.platform.intf.common.FuncBaseResponse;
import com.ailk.sets.platform.intf.common.PFResponse;
import com.ailk.sets.platform.intf.common.PaperInstancePartStateEnum;
import com.ailk.sets.platform.intf.common.PaperPartSeqEnum;
import com.ailk.sets.platform.intf.empl.domain.CandidateTest;
import com.ailk.sets.platform.intf.empl.domain.QbQuestion;
import com.ailk.sets.platform.intf.empl.service.IInvite;
import com.ailk.sets.platform.intf.exception.PFServiceException;
import com.ailk.sets.platform.intf.model.candidateTest.CandidateTestSwitchPage;
import com.ailk.sets.platform.intf.model.candidateTest.CandidateTestSwitchPageId;
import com.ailk.sets.platform.intf.model.monitor.MonitorInfo;

/**
 * 正式答题控制器
 * 
 * @author 毕希研
 * 
 */
@Controller
@RequestMapping("exam")
public class ExamController {
	
	private static Logger logger = LoggerFactory
			.getLogger(ExamController.class);

	@Autowired
	private IGradeService gradeService;
	
	@Autowired
	private IExamineService examineService;
	
	@Autowired
	private ICandidateTest candidateTestService;
	@Autowired
	private IInvite invite;

	/**
	 * 获取切换次数配置信息
	 * 
	 * @return
	 */
	@RequestMapping(value = "/getSwitchTimesConfig")
	public @ResponseBody
	CPResponse<MonitorInfo> getSwitchTimesConfig(HttpSession session) {
		CPResponse<MonitorInfo> cpResponse = new CPResponse<MonitorInfo>();
		try {
			CandidateTest candidateSession = (CandidateTest) session
					.getAttribute(Constant.CANDIDATE);
			cpResponse.setData(examineService.getMonitorInfo(candidateSession
					.getTestId()));
			cpResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (PFServiceException e) {
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call getSwitchTimesConfig error ", e);
		}
		return cpResponse;
	}

	/**
	 * 更新切换次数+1
	 * 
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/updateSwitchTimes", method = RequestMethod.POST)
	public @ResponseBody
	CPResponse<PFResponse> updateSwitchTimes(HttpSession session,
			@RequestBody CandidateTestSwitchPage candidateTestSwitchPage) {
		CPResponse<PFResponse> cpResponse = new CPResponse<PFResponse>();
		try {
			CandidateTest candidateSession = (CandidateTest) session
					.getAttribute(Constant.CANDIDATE);
			CandidateTestSwitchPageId id = new CandidateTestSwitchPageId();
			id.setTestId(candidateSession.getTestId());
			id.setSwitchTime(new Timestamp(System.currentTimeMillis()));
			candidateTestSwitchPage.setId(id);
			cpResponse.setData(candidateTestService
					.updateSwitchTimes(candidateTestSwitchPage));
			cpResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (PFServiceException e) {
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call updateSwitchTimes error ", e);
		}
		return cpResponse;
	}

	/**
	 * 更新刷新次数+1
	 * 
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/updateFreshTimes")
	public @ResponseBody
	CPResponse<PFResponse> updateFreshTimes(HttpSession session) {
		CPResponse<PFResponse> cpResponse = new CPResponse<PFResponse>();
		try {
			CandidateTest candidateSession = (CandidateTest) session
					.getAttribute(Constant.CANDIDATE);
			cpResponse.setData(candidateTestService
					.updateFreshTimes(candidateSession.getTestId()));
			cpResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (PFServiceException e) {
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("call updateFreshTimes error ", e);
		}
		return cpResponse;
	}

	/**
	 * 获取试题基本信息
	 * 
	 * @param invitationId
	 * @return
	 */
	@RequestMapping(value = "/getInfo")
	public @ResponseBody
	CPResponse<PaperData> getQuestionInfo(HttpSession session) {
		CPResponse<PaperData> cpResponse = new CPResponse<PaperData>();
		try {
			CandidateTest candidateSession = (CandidateTest) session
					.getAttribute(Constant.CANDIDATE);
			System.out.println(candidateSession.getTestId()
					+ "--------------------" + candidateSession.getPassport());
			PaperData paperData = examineService.getPaperData(
					candidateSession.getTestId(),
					candidateSession.getPassport());
			cpResponse.setData(paperData);
			cpResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			logger.error("get paper info error ", e);
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			cpResponse.setMessage(e.getMessage());
		}
		return cpResponse;

	}
	
	
	/**
	 * 获取试题试答部分基本信息
	 * 
	 * @return
	 */
	@RequestMapping(value = "/getTestInfo")
	public @ResponseBody
	CPResponse<PaperData> getTestInfo(HttpSession session) {
		CPResponse<PaperData> cpResponse = new CPResponse<PaperData>();
		try {
			CandidateTest candidateSession = (CandidateTest) session
					.getAttribute(Constant.CANDIDATE);
			logger.debug("getTestInfo  testId {} , passport {} ",candidateSession.getTestId(),candidateSession.getPassport());
			PaperData paperData = examineService.getTestPaperData(
					candidateSession.getTestId(),
					candidateSession.getPassport());
			cpResponse.setData(paperData);
			cpResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			logger.error("get getTestInfo  error ", e);
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			cpResponse.setMessage(e.getMessage());
		}
		return cpResponse;

	}

	/**
	 * 查询某试题，可以带上上一题的答案
	 * 
	 * @param param
	 * @return
	 */
	@RequestMapping(value = "/query", method = RequestMethod.POST)
	public @ResponseBody
	CPResponse<GetQInfoResponseExt> getQuestion(HttpSession session,@RequestBody ExamQuestionAnswerInfo info) {
		
		CPResponse<GetQInfoResponseExt> cpResponse = new CPResponse<GetQInfoResponseExt>();
		cpResponse.setCode(BaseResponse.SUCCESS + "");
		try {
			CandidateTest candidateSession = (CandidateTest) session.getAttribute(Constant.CANDIDATE);
			logger.debug("getQuestion testId is {} , the param is {}",candidateSession.getTestId(), info);
			Long qId = info.getQuestion_id();
			Integer partSeq = info.getPartSeq();// -1;
			ExamAnswerInfo answer = info.getAnswer();
			if (answer != null) {
				Long id = answer.getId();
				String choice = answer.getChoice();
				List<CommitFile> files = answer.getFiles();
				if(partSeq != PaperPartSeqEnum.INTEVEIW.getValue() && partSeq != PaperPartSeqEnum.TEST_INTERVIEW.getValue()){
				if (!CollectionUtils.isEmpty(files)) {// 笔试题
					if(answer.getFileEdited() == 1){//有文件编辑
						BaseResponse res = gradeService.commitFiles(candidateSession.getTestId(), id, files);
						if (res.getErrorCode() != BaseResponse.SUCCESS) {
							cpResponse.setMessage(res.getErrorDesc());
							cpResponse.setCode(res.getErrorCode() + "");
							logger.error("commitFiles error for testId {} , id {} " + res.getErrorDesc(),
									candidateSession.getTestId(), id);
							return cpResponse;
						}
					}else{
						logger.warn("the answered is not changed for testId {} ,  answer {} ", candidateSession.getTestId(), answer);
					}
					
				} else {
					logger.debug("the qid is {}, the choice is {}", id, choice);
					BaseResponse res2 = gradeService.commitChoice(candidateSession.getTestId(), id, choice,
							answer.getChoiceDesc());
					if (res2.getErrorCode() != BaseResponse.SUCCESS) {
						cpResponse.setMessage(res2.getErrorDesc());
						cpResponse.setCode(res2.getErrorCode() + "");
						logger.error("commitChoice error for testId {} , id {} " + res2.getErrorDesc(),
								candidateSession.getTestId(), id);
						return cpResponse;
					}
				}
				}
				Integer answerTime = answer.getAnswerTime();
				if (answerTime != null) {
					if (answerTime > 1) {
						examineService.addTimeToPaperInstanceQuestion(candidateSession.getTestId(), id, answerTime);
					} else {
						logger.debug("not need to add answerTime to PaperInstanceQuestion for id {}, answerTime {} ",
								id, answerTime);
					}
				}
				logger.debug("begin to end  question {} in testId {} ", id, candidateSession.getTestId());
				examineService.updatePaperInstanceQuestionInfo(candidateSession.getTestId(), partSeq, id, 2);// 更新结束答题时间
			}
			logger.debug("start get next question id {} ", qId);
			if (qId != null) {// 取下一题
				if (qId != null && partSeq != null && partSeq < 20) {// 试答题不需要
					examineService.updatePartSeqAndQuesitonId(candidateSession.getTestId(), partSeq, qId,
							info.getPartIndex(), info.getQuestionIndex());
				}
				GetQInfoResponseExt resExt = new GetQInfoResponseExt();
				if (partSeq != null
						&& (partSeq == PaperPartSeqEnum.INTEVEIW.getValue() || partSeq == PaperPartSeqEnum.TEST_INTERVIEW
								.getValue())) {// 面试题
					QbQuestion question = examineService.getQuestionById(qId);
					resExt.setTitle(question.getQuestionDesc());
					resExt.setEditType(7);
				} else {
					GetQInfoResponse res = gradeService.getQInfo(candidateSession.getTestId(), qId);
					BeanUtils.copyProperties(resExt, res);
				}
				QuestionExt ext = examineService.getQuestionExt(candidateSession.getTestId(), qId);
				logger.debug("the  left time is for qId {}  is {} ", ext.getLeftTime(), qId);
				resExt.setSuggestTime(ext.getLeftTime());
				if (partSeq != null && partSeq < 20 && partSeq != PaperPartSeqEnum.INTEVEIW.getValue()) {// 试答题不需要 ，面试题在点击开始考试时才计时
					examineService.updatePaperInstanceQuestionInfo(candidateSession.getTestId(), partSeq, qId, 1);// 更新开始答题时间
				}
				cpResponse.setData(resExt);
				logger.debug("end get question for id {} ", qId);
			}
		} catch (Exception e) {
			logger.error("save or get question error ", e);
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			cpResponse.setMessage(e.getMessage());
		}
		return cpResponse;
	}

	/**
	 * 标记问题(已经与取消合并为一个)
	 * 
	 * @param session
	 * @param qId
	 */
	@RequestMapping(value = "/markQuestion/{partSeq}/{qId}")
	public @ResponseBody
	CPResponse<Boolean> markQuestion(HttpSession session,
			@PathVariable int partSeq, @PathVariable long qId) {
		CPResponse<Boolean> cpResponse = new CPResponse<Boolean>();
		try {
			CandidateTest candidateSession = (CandidateTest) session
					.getAttribute(Constant.CANDIDATE);
			boolean result = examineService.markQuestion(
					candidateSession.getTestId(), partSeq, qId);
			if (result) {
				cpResponse.setData(result);
				cpResponse.setCode(SysBaseResponse.SUCCESS);
			} else {
				logger.error("unmark error for {} , please check platform log",
						qId);
				cpResponse.setCode(SysBaseResponse.ESYSTEM);
			}

		} catch (Exception e) {
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			cpResponse.setMessage(e.getMessage());
			logger.error("mark question error for qId  " + qId, e);
		}

		return cpResponse;

	}

	/**
	 * 标记问题
	 * 
	 * @param session
	 * @param qId
	 */
	@RequestMapping(value = "/markOrCancelQuestion/{partSeq}/{qId}")
	public @ResponseBody
	CPResponse<Boolean> markOrCancelQuestion(HttpSession session,
			@PathVariable int partSeq, @PathVariable long qId) {
		CPResponse<Boolean> cpResponse = new CPResponse<Boolean>();
		try {
			logger.debug("mark or unmark partSeq {}, qId {}", partSeq, qId);
			CandidateTest candidateSession = (CandidateTest) session
					.getAttribute(Constant.CANDIDATE);
			boolean result = examineService.markOrUnMarkQuestin(
					candidateSession.getTestId(), partSeq, qId);
			if (result) {
				cpResponse.setData(result);
				cpResponse.setCode(SysBaseResponse.SUCCESS);
			} else {
				logger.error("unmark error for {} , please check platform log",
						qId);
				cpResponse.setCode(SysBaseResponse.ESYSTEM);
			}

		} catch (Exception e) {
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			cpResponse.setMessage(e.getMessage());
			logger.error("mark question error for qId  " + qId, e);
		}

		return cpResponse;

	}

	/**
	 * 标记问题(已经与取消合并为一个)
	 * 
	 * @param session
	 * @param qId
	 */
	@RequestMapping(value = "/unMarkQuestion/{partSeq}/{qId}")
	public @ResponseBody
	CPResponse<Boolean> unMarkQuestion(HttpSession session,
			@PathVariable int partSeq, @PathVariable long qId) {
		CPResponse<Boolean> cpResponse = new CPResponse<Boolean>();
		try {
			CandidateTest candidateSession = (CandidateTest) session
					.getAttribute(Constant.CANDIDATE);
			boolean result = examineService.unMarkQuestion(
					candidateSession.getTestId(), partSeq, qId);
			cpResponse.setData(result);
			cpResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			logger.error("unmark question error for qId  " + qId, e);
		}

		return cpResponse;
	}

	/**
	 * 进入试卷某部分
	 * 
	 * @param session
	 * @param qId
	 */
	@RequestMapping(value = "/goPaperPart/{partSeq}")
	public @ResponseBody
	CPResponse<PFResponse> goPaperPart(HttpSession session,
			@PathVariable int partSeq) {
		CPResponse<PFResponse> cpResponse = new CPResponse<PFResponse>();
		try {
			CandidateTest candidateSession = (CandidateTest) session
					.getAttribute(Constant.CANDIDATE);
			logger.debug("goPaperPart for testId {}, partSeq {} ",
					candidateSession.getTestId(), partSeq);
			PFResponse result = examineService.updatePaperInstancePartStatus(
					candidateSession.getTestId(), partSeq,
					PaperInstancePartStateEnum.ANSWERING.getValue());
			if (FuncBaseResponse.SUCCESS.equals(result.getCode())) {
				cpResponse.setData(result);
				cpResponse.setCode(SysBaseResponse.SUCCESS);
				return cpResponse;
			}
			logger.warn("goPaperPart for testId {}, partSeq {} , code is  "
					+ result.getCode() + ", message is" + result.getMessage(),
					candidateSession.getTestId(), partSeq);
			cpResponse.setData(result);
			cpResponse.setCode(result.getCode());
			cpResponse.setMessage(result.getMessage());
		} catch (Exception e) {
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			cpResponse.setMessage(e.getMessage());
			logger.error("goPaperPart error for partSeq  " + partSeq, e);
		}

		return cpResponse;
	}

	/**
	 * 提交试卷部分
	 * 
	 * @param session
	 * @param qId
	 */
	@RequestMapping(value = "/handInPaperPart/{partSeq}")
	public @ResponseBody
	CPResponse<PFResponse> handInPaperPart(HttpSession session,
			@PathVariable int partSeq) {
		CPResponse<PFResponse> cpResponse = new CPResponse<PFResponse>();
		try {
			CandidateTest candidateSession = (CandidateTest) session
					.getAttribute(Constant.CANDIDATE);
			logger.debug("handInPaperPart for testId {}, partSeq {} ",
					candidateSession.getTestId(), partSeq);
			PFResponse result = examineService.updatePaperInstancePartStatus(
					candidateSession.getTestId(), partSeq,
					PaperInstancePartStateEnum.COMMIT_MANUAL.getValue());
			if (FuncBaseResponse.SUCCESS.equals(result.getCode())) {
				cpResponse.setData(result);
				cpResponse.setCode(SysBaseResponse.SUCCESS);
				return cpResponse;
			}
			logger.warn("handInPaperPart for testId {}, partSeq {} , code is  "
					+ result.getCode() + ", message is" + result.getMessage(),
					candidateSession.getTestId(), partSeq);
			cpResponse.setData(result);
			cpResponse.setCode(result.getCode());
			cpResponse.setMessage(result.getMessage());
		} catch (Exception e) {
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			cpResponse.setMessage(e.getMessage());
			logger.error("goPaperPart error for partSeq  " + partSeq, e);
		}

		return cpResponse;
	}

	/**
	 * 提交试卷
	 * 
	 * @param session
	 * @param qId
	 */
	@RequestMapping(value = "/handInPaper")
	public @ResponseBody
	CPResponse<PFResponse> handInPaper(HttpSession session) {
		CPResponse<PFResponse> cpResponse = new CPResponse<PFResponse>();
		try {
			CandidateTest candidateSession = (CandidateTest) session
					.getAttribute(Constant.CANDIDATE);
			logger.debug("handInPaper .... for testId  {}",
					candidateSession.getTestId());
			PFResponse result = examineService.updatePaperInstance(
					candidateSession.getTestId(), 2);// 更新试卷状态，交卷
			if (FuncBaseResponse.SUCCESS.equals(result.getCode())) {
				cpResponse.setData(result);
				cpResponse.setCode(SysBaseResponse.SUCCESS);
				// logger.debug("remove session info ... ");
				// session.removeAttribute(Constant.CANDIDATE);
				// session.removeAttribute(Constant.CANDIDATE_NAME);
				// session.removeAttribute(Constant.CANDIDATE_DESC);
				return cpResponse;
			}
			cpResponse.setData(result);
			cpResponse.setCode(result.getCode());
			cpResponse.setMessage(result.getMessage());
		} catch (Exception e) {
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			cpResponse.setMessage(e.getMessage());
			logger.error("handIn paper error   ", e);
		}

		return cpResponse;

	}
	
	/**
	 * 更新试题开始考试，面试题不能在获取题目时更新开始考试时间，在答题时更新
	 * 
	 * @param session
	 * @param qId
	 */
	@RequestMapping(value = "/startCandidateTestQuestion/{questionId}")
	public @ResponseBody
	CPResponse<PFResponse> startCandidateTestQuestion(HttpSession session, @PathVariable long questionId) {
		CPResponse<PFResponse> cpResponse = new CPResponse<PFResponse>();
		try {
			CandidateTest candidateSession = (CandidateTest) session.getAttribute(Constant.CANDIDATE);
			logger.debug("startCandidateTestQuestion .... for testId  {}, questionId {} ",
					candidateSession.getTestId(), questionId);
			PFResponse result = examineService.updatePaperInstanceQuestionInfo(candidateSession.getTestId(),
					PaperPartSeqEnum.INTEVEIW.getValue(), questionId, 1);// 更新答题状态，开始答题
			cpResponse.setData(result);
			cpResponse.setCode(SysBaseResponse.SUCCESS);
			return cpResponse;
		} catch (Exception e) {
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			cpResponse.setMessage(e.getMessage());
			logger.error("startCandidateTestQuestion error   ", e);
		}

		return cpResponse;

	}

	/**
	 * 提交某部分答题
	 * 
	 * @param param
	 * @return
	 */
	@RequestMapping(value = "/commit")
	public ModelAndView commitAnswer(@RequestParam int param) {

		return new ModelAndView("exam", "message", "");
	}

	/**
	 * 获取剩余时间（已经与getCandidateExamInfo的platform的服务合并为一个)
	 * 
	 * @param paperInstId
	 * @param partSeq
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = "/getTimeLeft/{partSeq}")
	public @ResponseBody
	CPResponse<ExamineTimeInfo> getTimeLeft(@PathVariable int partSeq,
			HttpSession session) throws IOException {
		CPResponse<ExamineTimeInfo> cpResponse = new CPResponse<ExamineTimeInfo>();
		CandidateTest candidateSession = (CandidateTest) session
				.getAttribute(Constant.CANDIDATE);
		logger.debug("getTimeLeft for testId {}, partSeq {} ",
				candidateSession.getTestId(), partSeq);
		ExamineTimeInfo timeLeft = null;
		try {
			timeLeft = examineService.getExamineTimeLeft(
					candidateSession.getTestId(), partSeq);
		} catch (Exception e) {
			logger.error(" get paper info error ", e);
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			cpResponse.setMessage(e.getMessage());
			return cpResponse;
		}
		cpResponse.setCode(SysBaseResponse.SUCCESS);
		cpResponse.setData(timeLeft);
		return cpResponse;
	}

	/**
	 * 获取试卷信息,用于还原原来答题部分和题目id
	 * 
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = "/getCandidateExamInfo")
	public @ResponseBody
	CPResponse<CandidateExamInfo> getCandidateExamInfo(HttpSession session) {
		CPResponse<CandidateExamInfo> res = new CPResponse<CandidateExamInfo>();
		CandidateTest candidateSession = (CandidateTest) session
				.getAttribute(Constant.CANDIDATE);
		logger.debug("getCandidateExamInfo for testId {} ",
				candidateSession.getTestId());
		try {
			CandidateExamInfo info = examineService.getCandidateExamInfo(
					candidateSession.getTestId(), 2);// 1 按部分 2按题目
			logger.debug("getCandidateExamInfo testId is {} , info is {} ",candidateSession.getTestId(), JSONObject.fromObject(info).toString());
			if (info != null) {
				/*if(info.getQuestionId() == null){//没有答过题需要将info置空，否则前台会认为有记录，将直接跳到考试页面
					info = null;
				}*/
				res.setData(info);
				res.setCode(SysBaseResponse.SUCCESS);
				return res;
			}
			logger.debug("not found any examInfo for id {}",
					candidateSession.getTestId());
			res.setCode(SysBaseResponse.ESYSTEM);
			res.setMessage("not found");
			return res;
		} catch (Exception e) {
			logger.error("  getCandidateExamInfo info error ", e);
			res.setCode(SysBaseResponse.ESYSTEM);
			res.setMessage(e.getMessage());
			return res;
		}
	}

	/**
	 * 获取标记信息
	 * 
	 * @param paperInstId
	 * @param partSeq
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = "/getPaperMarkData")
	public @ResponseBody
	CPResponse<List<PaperMarkData>> getPaperMarkData(HttpSession session)
			throws IOException {
		CPResponse<List<PaperMarkData>> cpResponse = new CPResponse<List<PaperMarkData>>();
		CandidateTest candidateSession = (CandidateTest) session
				.getAttribute(Constant.CANDIDATE);
		List<PaperMarkData> infos = null;
		try {
			infos = examineService.getPaperMarkDatas(candidateSession
					.getTestId());
			logger.debug("the infos size  is {} for testId {}",
					infos == null ? 0 : infos.size(),
					candidateSession.getTestId());
		} catch (Exception e) {
			logger.error(" get paper info error ", e);
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			cpResponse.setMessage(e.getMessage());
			return cpResponse;
		}
		cpResponse.setCode(SysBaseResponse.SUCCESS);
		cpResponse.setData(infos);
		return cpResponse;
	}

	/**
	 * 运行编程题测试，输入由用户提供
	 * 
	 * @param session
	 * @param questionId
	 * @param items
	 * @param arg
	 *            自定义参数
	 * @return
	 */
	@RequestMapping(value = "/runTestByArg/{questionId}", method = RequestMethod.POST)
	public @ResponseBody
	CPResponse<RunTestResponse> runTestByArg(HttpSession session,
			@PathVariable long questionId, @RequestBody List<CommitFile> items,
			@RequestParam String arg) {
		CPResponse<RunTestResponse> cpResponse = new CPResponse<RunTestResponse>();
		try {
			CandidateTest candidateExam = (CandidateTest) session
					.getAttribute(Constant.CANDIDATE);
			cpResponse.setData(gradeService.runTest(candidateExam.getTestId(),
					questionId, items, arg));
			cpResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			logger.error("run test error ", e);
			cpResponse.setMessage(e.getMessage());
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
		}
		return cpResponse;
	}

	/**
	 * 运行编程题测试，使用样例
	 * 
	 * @param session
	 * @param questionId
	 * @param items
	 * @param sampleId
	 * @return
	 */
	@RequestMapping(value = "/runTestBySampleId/{questionId}/{sampleId}", method = RequestMethod.POST)
	public @ResponseBody
	CPResponse<RunTestResponse> runTestBySampleId(HttpSession session,
			@PathVariable long questionId, @RequestBody List<CommitFile> items,
			@PathVariable int sampleId) {
		CPResponse<RunTestResponse> cpResponse = new CPResponse<RunTestResponse>();
		try {
			CandidateTest candidateExam = (CandidateTest) session
					.getAttribute(Constant.CANDIDATE);
			cpResponse.setData(gradeService.runTest(candidateExam.getTestId(),
					questionId, items, sampleId));
			cpResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			logger.error("run test error ", e);
			cpResponse.setMessage(e.getMessage());
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
		}
		return cpResponse;
	}

	/**
	 * 更新考试中断次数
	 * 
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/interrupt")
	public @ResponseBody
	CPResponse<PFResponse> interrupt(HttpSession session) {
		CandidateTest candidateSession = (CandidateTest) session
				.getAttribute(Constant.CANDIDATE);
		CPResponse<PFResponse> cpResponse = new CPResponse<PFResponse>();
		try {
			PFResponse pfResponse = examineService
					.updateInterrupt(candidateSession.getTestId());
			cpResponse.setData(pfResponse);
			cpResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (PFServiceException e) {
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			cpResponse.setMessage(e.getMessage());
			logger.error("call interrupt error", e);
		}
		return cpResponse;
	}

	/**
	 * 开始考试
	 * 
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/startExam")
	public @ResponseBody
	CPResponse<PFResponse> startExam(HttpSession session) {
		CandidateTest candidateSession = (CandidateTest) session
				.getAttribute(Constant.CANDIDATE);
		logger.debug("start exam for testId {}", candidateSession.getTestId());
		CPResponse<PFResponse> cpResponse = new CPResponse<PFResponse>();
		try {
			PFResponse pfResponse = examineService
					.startExamPaper(candidateSession.getTestId());
			cpResponse.setData(pfResponse);
			cpResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			cpResponse.setMessage(e.getMessage());
			logger.error("call startExam error", e);
		}
		return cpResponse;
	}

	/**
	 * 获取时间状态
	 * 
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/getPaperState")
	public @ResponseBody
	CPResponse<PFResponse> getPaperState(HttpSession session) {
		CandidateTest candidateSession = (CandidateTest) session
				.getAttribute(Constant.CANDIDATE);
		logger.debug("getPaperState exam for testId {}",
				candidateSession.getTestId());
		CPResponse<PFResponse> cpResponse = new CPResponse<PFResponse>();
		try {
			PFResponse pfResponse = examineService
					.getCandidateTestPaperState(candidateSession.getTestId());
			cpResponse.setData(pfResponse);
			cpResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			cpResponse.setMessage(e.getMessage());
			logger.error("call getPaperState error", e);
		}
		return cpResponse;
	}
	
	/**
	 * 获取时间状态
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/getInvitationTimeInfo")
	public @ResponseBody
	CPResponse<InvitationTimeInfo> getInvitationTimeInfo(HttpSession session) {
		CandidateTest candidateSession = (CandidateTest) session
				.getAttribute(Constant.CANDIDATE);
		logger.debug("getInvitationTimeInfo  for testId {}",
				candidateSession.getTestId());
		CPResponse<InvitationTimeInfo> cpResponse = new CPResponse<InvitationTimeInfo>();
		try {
			InvitationTimeInfo info = invite.getInvitationTimeInfo(candidateSession.getTestId());
			cpResponse.setData(info);
			cpResponse.setCode(SysBaseResponse.SUCCESS);
		} catch (Exception e) {
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
			cpResponse.setMessage(e.getMessage());
			logger.error("call getInvitationTimeInfo error", e);
		}
		return cpResponse;
	}
}
