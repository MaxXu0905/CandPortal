package com.ailk.sets.docs;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public interface IDocumentService {

	public static final int TYPE_FIELD = 0;
	public static final int TYPE_CONSTRUCTOR = 1;
	public static final int TYPE_METHOD = 2;

	@SuppressWarnings("serial")
	public static class ItemSummary implements Serializable {
		private String className;
		private String name;
		private String signature;

		public String getClassName() {
			return className;
		}

		public void setClassName(String className) {
			this.className = className;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public String getSignature() {
			return signature;
		}

		public void setSignature(String signature) {
			this.signature = signature;
		}
	}

	@SuppressWarnings("serial")
	public static class DocumentSummary implements Serializable {
		private List<ItemSummary> fields;
		private List<ItemSummary> constructors;
		private List<ItemSummary> methods;

		public DocumentSummary() {
		}

		public DocumentSummary(Document document) {
			if (document.getFieldMap() != null
					&& !document.getFieldMap().isEmpty()) {
				fields = new ArrayList<ItemSummary>();
				for (Item field : document.getFieldMap().values()) {
					ItemSummary itemSummary = new ItemSummary();
					itemSummary.setClassName(document.getName());
					itemSummary.setName(field.getName());
					itemSummary.setSignature(field.getSignature());
					fields.add(itemSummary);
				}
			}

			if (document.getConstructorMap() != null
					&& !document.getConstructorMap().isEmpty()) {
				constructors = new ArrayList<ItemSummary>();
				for (Item field : document.getConstructorMap().values()) {
					ItemSummary itemSummary = new ItemSummary();
					itemSummary.setClassName(document.getName());
					itemSummary.setName(field.getName());
					itemSummary.setSignature(field.getSignature());
					constructors.add(itemSummary);
				}
			}

			if (document.getMethodMap() != null
					&& !document.getMethodMap().isEmpty()) {
				methods = new ArrayList<ItemSummary>();
				for (Item field : document.getMethodMap().values()) {
					ItemSummary itemSummary = new ItemSummary();
					itemSummary.setClassName(document.getName());
					itemSummary.setName(field.getName());
					itemSummary.setSignature(field.getSignature());
					methods.add(itemSummary);
				}
			}
		}

		public List<ItemSummary> getFields() {
			return fields;
		}

		public void setFields(List<ItemSummary> fields) {
			this.fields = fields;
		}

		public List<ItemSummary> getConstructors() {
			return constructors;
		}

		public void setConstructors(List<ItemSummary> constructors) {
			this.constructors = constructors;
		}

		public List<ItemSummary> getMethods() {
			return methods;
		}

		public void setMethods(List<ItemSummary> methods) {
			this.methods = methods;
		}
	}

	public String[] getClassNames();

	public DocumentSummary getByClassName(String className);

	public DocumentSummary getByName(String name);

	public String getDescription(String className, int type, String signature);

}
