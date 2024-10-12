package com.micro.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
public enum NvmsNotifyAreaTypeEnum {

    City("City", "City"),

    Emirate("Emirate", "Emirate"),

    Site("Site", "Site");

    @Getter
    private String value;

    @Getter
    private String label;
}
