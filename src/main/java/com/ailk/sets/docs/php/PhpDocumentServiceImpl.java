package com.ailk.sets.docs.php;

import javax.annotation.PostConstruct;

import org.springframework.stereotype.Service;

import com.ailk.sets.docs.BaseDocumentServiceImpl;

@Service
public class PhpDocumentServiceImpl extends BaseDocumentServiceImpl {

	@PostConstruct
	public void init() {
		super.init("php");
	}

}
