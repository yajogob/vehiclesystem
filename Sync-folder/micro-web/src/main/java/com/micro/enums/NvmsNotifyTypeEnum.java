package com.micro.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
public enum NvmsNotifyTypeEnum {

	Area("Area", "Area"),
	Camera("Camera", "Camera"),

    City("City", "City"),

    Emirate("Emirate", "Emirate");

    @Getter
    private String value;

    @Getter
    private String label;
}
