package com.ailk.sets.common;

import com.ailk.sets.grade.intf.GetQInfoResponse;

public class GetQInfoResponseExt extends GetQInfoResponse {
	
	private static final long serialVersionUID = 1L;
	private Integer suggestTime;
	public Integer getSuggestTime() {
		return suggestTime;
	}
	public void setSuggestTime(Integer suggestTime) {
		this.suggestTime = suggestTime;
	}
}
