package com.ailk.sets.controller;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ailk.sets.common.CPResponse;
import com.ailk.sets.common.SysBaseResponse;
import com.ailk.sets.docs.IDocumentService;
import com.ailk.sets.docs.IDocumentService.DocumentSummary;
import com.ailk.sets.docs.java.JavaDocumentServiceImpl;
import com.ailk.sets.docs.php.PhpDocumentServiceImpl;

/**
 * 文档查询
 * 
 * @author 徐艮权
 * 
 */
@Controller
@RequestMapping("/document/{lang}")
public class DocController {

	private static final Logger logger = Logger.getLogger(DocController.class);

	@Autowired
	private JavaDocumentServiceImpl javaDocumentService;

	@Autowired
	private PhpDocumentServiceImpl phpDocumentService;

	/**
	 * 获取类名列表
	 * 
	 * @return
	 */
	@RequestMapping(value = "/getClassNames")
	public @ResponseBody
	CPResponse<String[]> getClassNames(@PathVariable String lang) {
		logger.info("getClassNames: lang=" + lang);

		CPResponse<String[]> cpResponse = new CPResponse<String[]>();

		IDocumentService service = getService(lang);
		if (service == null) {
			cpResponse.setCode(SysBaseResponse.ENOENT);
			return cpResponse;
		}

		String[] classNames = service.getClassNames();
		cpResponse.setData(classNames);

		if (classNames == null)
			cpResponse.setCode(SysBaseResponse.ENOENT);
		else
			cpResponse.setCode(SysBaseResponse.SUCCESS);

		return cpResponse;
	}

	/**
	 * 获取类的概述
	 * 
	 * @return
	 */
	@RequestMapping(value = "/getByClassName")
	public @ResponseBody
	CPResponse<DocumentSummary> getByClassName(@PathVariable String lang,
			@RequestParam String className) {
		logger.info("getByClassName: lang=" + lang + ", className=" + className);

		CPResponse<DocumentSummary> cpResponse = new CPResponse<DocumentSummary>();

		IDocumentService service = getService(lang);
		if (service == null) {
			cpResponse.setCode(SysBaseResponse.ENOENT);
			return cpResponse;
		}

		DocumentSummary documentSummary = service.getByClassName(className);
		cpResponse.setData(documentSummary);

		if (documentSummary == null)
			cpResponse.setCode(SysBaseResponse.ENOENT);
		else
			cpResponse.setCode(SysBaseResponse.SUCCESS);

		return cpResponse;
	}

	/**
	 * 获取关键字相关的概述
	 * 
	 * @return
	 */
	@RequestMapping(value = "/getByName")
	public @ResponseBody
	CPResponse<DocumentSummary> getByName(@PathVariable String lang,
			@RequestParam String name) {
		logger.info("getByName: lang=" + lang + ", name=" + name);

		CPResponse<DocumentSummary> cpResponse = new CPResponse<DocumentSummary>();

		IDocumentService service = getService(lang);
		if (service == null) {
			cpResponse.setCode(SysBaseResponse.ENOENT);
			return cpResponse;
		}

		DocumentSummary documentSummary = service.getByName(name);
		cpResponse.setData(documentSummary);

		if (documentSummary == null)
			cpResponse.setCode(SysBaseResponse.ENOENT);
		else
			cpResponse.setCode(SysBaseResponse.SUCCESS);

		return cpResponse;
	}

	/**
	 * 获取关键字相关的概述
	 * 
	 * @return
	 */
	@RequestMapping(value = "/getDescription")
	public @ResponseBody
	CPResponse<String> getDescription(@PathVariable String lang,
			@RequestParam String className, @RequestParam int type,
			@RequestParam String signature) {
		logger.info("getDescription: lang=" + lang + ", className=" + className
				+ ", type=" + type + ", signature" + signature);

		CPResponse<String> cpResponse = new CPResponse<String>();

		IDocumentService service = getService(lang);
		if (service == null) {
			cpResponse.setCode(SysBaseResponse.ENOENT);
			return cpResponse;
		}

		String description = service.getDescription(className, type, signature);
		cpResponse.setData(description);

		if (description == null)
			cpResponse.setCode(SysBaseResponse.ENOENT);
		else
			cpResponse.setCode(SysBaseResponse.SUCCESS);

		return cpResponse;
	}

	private IDocumentService getService(String lang) {
		if (lang.equals("java"))
			return javaDocumentService;
		else if (lang.equals("php"))
			return phpDocumentService;
		else
			return null;
	}

}
