package com.ailk.sets.common;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class RequestOrder {
	private static Properties properties;
	static {
		properties = new Properties();
		InputStream inputStream = RequestOrder.class.getClassLoader().getResourceAsStream("request-order.properties");
		try {
			properties.load(inputStream);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public static String getController(int index)
	{
		return properties.getProperty(index+"");
	}
}
