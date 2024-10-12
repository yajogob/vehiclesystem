package com.micro.dto;

import lombok.Data;

import java.util.List;

@Data
public class SiteDto {

    private String locationCode;

    private String siteCode;

    private List<String> cameraCodes;
}
