package com.ailk.sets.common;

import java.io.Serializable;

public class ExamQuestionAnswerInfo implements Serializable {
	private static final long serialVersionUID = -6549252464671565699L;
	private Long question_id;
	private Integer partSeq;
	private ExamAnswerInfo answer;
	private Integer partIndex;
	private Integer questionIndex; 
	
	@Override
	public String toString() {
		return "ExamQuestionAnswerInfo [question_id=" + question_id + ", partSeq=" + partSeq + ", answer=" + answer
				+ ", partIndex=" + partIndex + ", questionIndex=" + questionIndex + "]";
	}

	public Integer getPartIndex() {
		return partIndex;
	}

	public void setPartIndex(Integer partIndex) {
		this.partIndex = partIndex;
	}

	public Integer getQuestionIndex() {
		return questionIndex;
	}

	public void setQuestionIndex(Integer questionIndex) {
		this.questionIndex = questionIndex;
	}

	


	public Long getQuestion_id() {
		return question_id;
	}

	public void setQuestion_id(Long question_id) {
		this.question_id = question_id;
	}

	public Integer getPartSeq() {
		return partSeq;
	}

	public void setPartSeq(Integer partSeq) {
		this.partSeq = partSeq;
	}

	public ExamAnswerInfo getAnswer() {
		return answer;
	}

	public void setAnswer(ExamAnswerInfo answer) {
		this.answer = answer;
	}
}
