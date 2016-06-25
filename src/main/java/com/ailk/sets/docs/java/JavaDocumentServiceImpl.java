package com.ailk.sets.docs.java;

import javax.annotation.PostConstruct;

import org.springframework.stereotype.Service;

import com.ailk.sets.docs.BaseDocumentServiceImpl;

@Service
public class JavaDocumentServiceImpl extends BaseDocumentServiceImpl {

	@PostConstruct
	public void init() {
		super.init("java");
	}

}
