package com.ailk.sets.common;

import java.io.Serializable;
import java.util.List;

import com.ailk.sets.grade.intf.CommitFile;

public class ExamAnswerInfo implements Serializable {

	@Override
	public String toString() {
		return "ExamAnswerInfo [answerTime=" + answerTime + ", id=" + id + ", choice=" + choice + ", choiceDesc="
				+ choiceDesc + ", files=" + files + ", fileEdited=" + fileEdited + "]";
	}

	private static final long serialVersionUID = -2407213735133845081L;
	private Integer answerTime;
	private Long id;
	private String choice;
	private String choiceDesc;
	private List<CommitFile> files;
	private int fileEdited; //0文件未编辑  1已经编辑

	public Integer getAnswerTime() {
		return answerTime;
	}

	public void setAnswerTime(Integer answerTime) {
		this.answerTime = answerTime;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getChoice() {
		return choice;
	}

	public void setChoice(String choice) {
		this.choice = choice;
	}

	public String getChoiceDesc() {
		return choiceDesc;
	}

	public void setChoiceDesc(String choiceDesc) {
		this.choiceDesc = choiceDesc;
	}

	public List<CommitFile> getFiles() {
		return files;
	}

	public void setFiles(List<CommitFile> files) {
		this.files = files;
	}

	public int getFileEdited() {
		return fileEdited;
	}

	public void setFileEdited(int fileEdited) {
		this.fileEdited = fileEdited;
	}
	
}
