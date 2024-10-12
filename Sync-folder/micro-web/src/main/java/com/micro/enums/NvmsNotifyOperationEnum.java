package com.micro.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
public enum NvmsNotifyOperationEnum {

		ADD("ADD", "ADD"),
		DELETE("DELETE", "DELETE"),
		UPDATE("UPDATE", "UPDATE");

	    @Getter
	    private String value;

	    @Getter
	    private String label;
}
