package com.ailk.sets.controller;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ailk.sets.common.CPResponse;
import com.ailk.sets.common.Constant;
import com.ailk.sets.common.SysBaseResponse;
import com.ailk.sets.platform.intf.cand.service.ICandidateTest;
import com.ailk.sets.platform.intf.cand.service.IPaperInstance;
import com.ailk.sets.platform.intf.common.PFResponse;
import com.ailk.sets.platform.intf.empl.domain.CandidateTest;
import com.ailk.sets.platform.intf.exception.PFServiceException;
import com.ailk.sets.platform.intf.model.candidateTest.CandidateTestMonitorClone;
import com.google.gson.Gson;

@Controller
public class MonitorController {
	@Autowired
	@Qualifier("candidateTestService")
	private ICandidateTest candidateTestService;

	@Autowired
	@Qualifier("paperInstanceService")
	private IPaperInstance paperInstanceService;

	@RequestMapping("/checkCandidatePic")
	public void checkCandidatePic(HttpServletRequest request, HttpServletResponse response) throws IOException {
		CPResponse<PFResponse> cpResponse = new CPResponse<PFResponse>();
		CandidateTest candidateSession = (CandidateTest) request.getSession().getAttribute(Constant.CANDIDATE);
		try {
			cpResponse.setCode(SysBaseResponse.SUCCESS);
			cpResponse.setData(candidateTestService.checkCandidatePic(candidateSession.getTestId()));
		} catch (PFServiceException e) {
			cpResponse.setCode(SysBaseResponse.ESYSTEM);
		}
		response.setContentType("text/html;charset=UTF-8");
		response.getWriter().write(new Gson().toJson(cpResponse)); // 上传成功
	}
	
	
	/**
	 * 保存异常图片地址
	 * 
	 * @author Mia
	 * @param request
	 * @param response
	 * @throws IOException
	 * @return
	 */
	@RequestMapping("/uploadAbnormalSnapShot")
	public void uploadAbnormalSnapShot(HttpServletRequest request, HttpServletResponse response) throws IOException {

		CPResponse<Object> cpreponse = new CPResponse<Object>();

//		String paramsStr = CandStringUtil.convertIStoStr(request.getInputStream());
		
//		Map<String,String> params = new Gson().fromJson(paramsStr, Map.class);
		String imgUrl = request.getParameter("imgUrl");
		int faceNum = Integer.parseInt(request.getParameter("faceNum"));
		long invitationId = Long.parseLong(request.getParameter("invitationId"));
		
		try {
			CandidateTestMonitorClone clone = new CandidateTestMonitorClone();
			clone.setTestId(invitationId);
			clone.setCreateTime(new Timestamp(new Date().getTime()));
			clone.setIsAbnormal(1); // 异常
			clone.setPicFile(imgUrl);
			clone.setPicType(1); // 拍照
			clone.setFaceNum(faceNum);
			candidateTestService.saveTestMonitor(clone);
			cpreponse.setCode(SysBaseResponse.SUCCESS);
		} catch (PFServiceException e) {
			// TODO Auto-generated catch block
			cpreponse.setCode(SysBaseResponse.ESYSTEM);
			e.printStackTrace();
		}

		response.setContentType("text/html;charset=UTF-8");
		response.getWriter().write(new Gson().toJson(cpreponse)); // 上传成功
	}
	
	/**
	 * 
	 * 保存头像地址
	 * 
	 * @author Mia
	 * @param request
	 * @param response
	 * @throws IOException
	 * @return
	 */
	@RequestMapping("/updateCandidatePic")
	public void updateCandidatePic(HttpServletRequest request, HttpServletResponse response) throws IOException {

		PFResponse pfReponse = new PFResponse();

		try {
			CandidateTest ce = (CandidateTest) request.getSession().getAttribute(Constant.CANDIDATE);
			long invitationId = ce.getTestId();

//			int invitationId = 111111;
			String imgUrl = request.getParameter("imgUrl");
//			String imgUrl = CandStringUtil.convertIStoStr(request.getInputStream());

			pfReponse = candidateTestService.updateCandidatePic(invitationId, imgUrl);
			pfReponse.setCode(SysBaseResponse.SUCCESS);
			pfReponse.setMessage(imgUrl);
		} catch (PFServiceException e) {
			// TODO Auto-generated catch block
			pfReponse.setCode(SysBaseResponse.ESYSTEM);
			e.printStackTrace();
		}

		response.setContentType("text/html;charset=UTF-8");
		response.getWriter().write(new Gson().toJson(pfReponse)); // 上传成功
	}
	
	/**
	 * 
	 * 保存视频地址
	 * 
	 * @author Mia
	 * @param request
	 * @param response
	 * @throws IOException
	 * @return
	 */
	@RequestMapping("/updatePaperInstanceQuesUrl")
	public void updatePaperInstanceQuesUrl(HttpServletRequest request, HttpServletResponse response) throws IOException {

		PFResponse pfReponse = new PFResponse();

		try {

//			String paramsStr = CandStringUtil.convertIStoStr(request.getInputStream());
//			Map<String,String> params = new Gson().fromJson(paramsStr, Map.class);
			String imgUrl = request.getParameter("videoUrl");
			int interviewId = Integer.parseInt(request.getParameter("interviewId"));
			long invitationId = Long.parseLong(request.getParameter("invitationId"));
			
			pfReponse = paperInstanceService.updatePaperInstanceQuesUrl(invitationId, interviewId, imgUrl);
			pfReponse.setCode(SysBaseResponse.SUCCESS);
//			pfReponse.setMessage(imgUrl);
		} catch (PFServiceException e) {
			// TODO Auto-generated catch block
			pfReponse.setCode(SysBaseResponse.ESYSTEM);
			e.printStackTrace();
		}
		
		response.setContentType("text/html;charset=UTF-8");
		response.getWriter().write(new Gson().toJson(pfReponse)); // 上传成功
	}
	

}
