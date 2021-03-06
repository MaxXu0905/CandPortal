package com.ailk.sets.common;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.springframework.util.StringUtils;

public class CandStringUtil extends StringUtils{
	public static String convertIStoStr(InputStream is) {
		StringBuilder sb = new StringBuilder();
		String readline = "";
		try {
			/**
			 * 若乱码，请改为new InputStreamReader(is, "GBK").
			 */
			BufferedReader br = new BufferedReader(new InputStreamReader(is));
			while (br.ready()) {
				readline = br.readLine();
				sb.append(readline);
			}
			br.close();
		} catch (IOException ie) {
			System.out.println("converts failed.");
		}
		return sb.toString();
	}

}
