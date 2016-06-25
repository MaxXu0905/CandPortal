package com.ailk.sets.common;

import java.io.Serializable;

public class SearchCondition implements Serializable {

	@Override
	public String toString() {
		return "SearchCondition [infoId=" + infoId + ", searchName="
				+ searchName + "]";
	}

	private static final long serialVersionUID = 1L;
	private String infoId;
	private String searchName;

	public String getInfoId() {
		return infoId;
	}

	public void setInfoId(String infoId) {
		this.infoId = infoId;
	}

	public String getSearchName() {
		return searchName;
	}

	public void setSearchName(String searchName) {
		this.searchName = searchName;
	}
}
