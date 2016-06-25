package com.ailk.sets.docs;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;

public class BaseDocumentServiceImpl implements IDocumentService {
	
	private static Logger logger = LoggerFactory.getLogger(BaseDocumentServiceImpl.class);

	private Map<String, Document> documentMap;
	private String[] classNames;
	private Map<String, DocumentSummary> summaryMap;

	public void init(String docName) {
		documentMap = new HashMap<String, Document>();
		summaryMap = new HashMap<String, DocumentSummary>();

		try {
			ClassPathResource classPathResource = new ClassPathResource(
					"docs/" + docName);
			File root = classPathResource.getFile();
			File[] files = root.listFiles();

			for (File file : files) {
				InputStreamReader reader = new InputStreamReader(
						new FileInputStream(file), "UTF-8");
				Document document = Document.load(reader);

				documentMap.put(document.getName(), document);
				addIndex(document);
			}

			classNames = new String[documentMap.size()];
			Collection<Document> documents = documentMap.values();
			int i = 0;
			for (Document document : documents) {
				classNames[i++] = document.getName();
			}
			Arrays.sort(classNames);
		} catch (Exception e) {
			logger.error("加载文档失败", e);
		}
	}

	@Override
	public String[] getClassNames() {
		return classNames;
	}

	@Override
	public DocumentSummary getByClassName(String className) {
		Document document = documentMap.get(className);
		if (document == null)
			return null;

		return new DocumentSummary(document);
	}

	@Override
	public DocumentSummary getByName(String name) {
		String lowerName = name.toLowerCase();

		return summaryMap.get(lowerName);
	}

	@Override
	public String getDescription(String className, int type, String signature) {
		Document document = documentMap.get(className);
		if (document == null)
			return null;

		switch (type) {
		case TYPE_FIELD: {
			Item field = document.getFieldMap().get(signature);
			if (field == null)
				return null;
			return field.getDescription();
		}
		case TYPE_CONSTRUCTOR: {
			Item constructor = document.getConstructorMap().get(signature);
			if (constructor == null)
				return null;
			return constructor.getDescription();
		}
		case TYPE_METHOD: {
			Item method = document.getMethodMap().get(signature);
			if (method == null)
				return null;
			return method.getDescription();
		}
		default:
			return null;
		}
	}

	private void addIndex(Document document) {
		if (document.getFields() != null) {
			for (Item field : document.getFields()) {
				ItemSummary itemSummary = new ItemSummary();
				itemSummary.setClassName(document.getName());
				itemSummary.setName(field.getName());
				itemSummary.setSignature(field.getSignature());

				Set<String> keySet = getKeySet(field.getName());
				for (String key : keySet) {
					DocumentSummary documentSummary = summaryMap.get(key);
					if (documentSummary == null) {
						documentSummary = new DocumentSummary();
						summaryMap.put(key, documentSummary);
					}

					List<ItemSummary> fields = documentSummary.getFields();
					if (fields == null) {
						fields = new ArrayList<ItemSummary>();
						documentSummary.setFields(fields);
					}
					fields.add(itemSummary);
				}
			}
		}

		if (document.getConstructors() != null) {
			for (Item constructor : document.getConstructors()) {
				ItemSummary itemSummary = new ItemSummary();
				itemSummary.setClassName(document.getName());
				itemSummary.setName(constructor.getName());
				itemSummary.setSignature(constructor.getSignature());

				Set<String> keySet = getKeySet(constructor.getName());
				for (String key : keySet) {
					DocumentSummary documentSummary = summaryMap.get(key);
					if (documentSummary == null) {
						documentSummary = new DocumentSummary();
						summaryMap.put(key, documentSummary);
					}

					List<ItemSummary> constructors = documentSummary
							.getConstructors();
					if (constructors == null) {
						constructors = new ArrayList<ItemSummary>();
						documentSummary.setConstructors(constructors);
					}
					constructors.add(itemSummary);
				}
			}
		}

		if (document.getMethods() != null) {
			for (Item method : document.getMethods()) {
				ItemSummary itemSummary = new ItemSummary();
				itemSummary.setClassName(document.getName());
				itemSummary.setName(method.getName());
				itemSummary.setSignature(method.getSignature());

				Set<String> keySet = getKeySet(method.getName());
				for (String key : keySet) {
					DocumentSummary documentSummary = summaryMap.get(key);
					if (documentSummary == null) {
						documentSummary = new DocumentSummary();
						summaryMap.put(key, documentSummary);
					}

					List<ItemSummary> methods = documentSummary.getMethods();
					if (methods == null) {
						methods = new ArrayList<ItemSummary>();
						documentSummary.setMethods(methods);
					}
					methods.add(itemSummary);
				}
			}
		}
	}

	private Set<String> getKeySet(String name) {
		String lowerName = name.toLowerCase();
		Set<String> keySet = new HashSet<String>();

		for (int i = 0; i < lowerName.length(); i++) {
			for (int j = i + 1; j <= lowerName.length(); j++) {
				keySet.add(lowerName.substring(i, j));
			}
		}

		return keySet;
	}

}
