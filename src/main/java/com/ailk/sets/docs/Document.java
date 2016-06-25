package com.ailk.sets.docs;import java.io.InputStreamReader;import java.util.List;import java.util.Map;import java.util.TreeMap;import org.exolab.castor.mapping.Mapping;import org.exolab.castor.xml.Unmarshaller;import org.springframework.core.io.ClassPathResource;public class Document {	private String name; // 类名	private List<Item> fields;	private List<Item> constructors;	private List<Item> methods;	private Map<String, Item> fieldMap;	private Map<String, Item> constructorMap;	private Map<String, Item> methodMap;	public String getName() {		return name;	}	public void setName(String name) {		this.name = name;	}	public List<Item> getFields() {		return fields;	}	public void setFields(List<Item> fields) {		this.fields = fields;	}	public List<Item> getConstructors() {		return constructors;	}	public void setConstructors(List<Item> constructors) {		this.constructors = constructors;	}	public List<Item> getMethods() {		return methods;	}	public void setMethods(List<Item> methods) {		this.methods = methods;	}	public Map<String, Item> getFieldMap() {		return fieldMap;	}	public void setFieldMap(Map<String, Item> fieldMap) {		this.fieldMap = fieldMap;	}	public Map<String, Item> getConstructorMap() {		return constructorMap;	}	public void setConstructorMap(Map<String, Item> constructorMap) {		this.constructorMap = constructorMap;	}	public Map<String, Item> getMethodMap() {		return methodMap;	}	public void setMethodMap(Map<String, Item> methodMap) {		this.methodMap = methodMap;	}	@Override	public String toString() {		return "Clazz [name=" + name + "\n fields=" + fields				+ "\n constructors=" + constructors + "\n methods=" + methods				+ "]";	}	public static Document load(InputStreamReader reader) throws Exception {		Unmarshaller unmarshaller = new Unmarshaller(Document.class);		Mapping mapping = new Mapping();		mapping.loadMapping(new ClassPathResource("docs/class_mapping.xml")				.getURL());		unmarshaller.setMapping(mapping);		unmarshaller.setWhitespacePreserve(true);		Document document = (Document) unmarshaller.unmarshal(reader);		document.init();		return document;	}	private void init() {		if (fields != null && !fields.isEmpty()) {			fieldMap = new TreeMap<String, Item>();			for (Item field : fields) {				fieldMap.put(field.getSignature(), field);			}		}		if (constructors != null && !constructors.isEmpty()) {			constructorMap = new TreeMap<String, Item>();			for (Item constructor : constructors) {				constructorMap.put(constructor.getSignature(), constructor);			}		}		if (methods != null && !methods.isEmpty()) {			methodMap = new TreeMap<String, Item>();			for (Item method : methods) {				methodMap.put(method.getSignature(), method);			}		}	}}