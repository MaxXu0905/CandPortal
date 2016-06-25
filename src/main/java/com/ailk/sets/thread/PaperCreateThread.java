package com.ailk.sets.thread;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.ailk.sets.platform.intf.cand.service.IExamineService;

public class PaperCreateThread implements Runnable {
	private Logger logger = LoggerFactory.getLogger(PaperCreateThread.class);
	private IExamineService examineService;
	private long testId;
	private String passport;
	private static Map<Long,Long> createedTestIds = new HashMap<Long,Long>();
	public PaperCreateThread( IExamineService examineService,long testId, String passport){
		this.examineService = examineService;
		this.testId = testId;
		this.passport = passport;
	}
	@Override
	public void run() {
		try{
			logger.debug("begin to create paper for testId {}",testId);
			synchronized (createedTestIds) {//防止两个相同url同时进来，同时生成试卷
				if(createedTestIds.containsKey(testId)){
					logger.warn("the testId is created , not more than once , testId {} ", testId);
					return;
				}
				logger.debug("put testId {} ", testId);
				createedTestIds.put(testId, testId);
			}
			String paperState = examineService.getCandidateTestPaperState(testId).getCode();
			if(paperState.equals("0") || paperState.equals("-1")){
				examineService.updateCandidateTestPaperState(testId,1);//修改为正在生产，防止重复刷新页面重复生成
				examineService.createPaper(testId, passport);
				logger.debug("end create paper for testId {},paperState {} ",testId, paperState);
			}else{
				logger.debug("the paper state is not 0 or -1 for testId {}, so direct return, state is {} ", testId,paperState);
			}
			
		}catch(Exception e){
			examineService.updateCandidateTestPaperState(testId, -1);
			logger.error("error create paper testId " + testId, e);
		}finally{
			logger.debug("remove testId {} ", testId);
			createedTestIds.remove(testId);
		}
	}

}
