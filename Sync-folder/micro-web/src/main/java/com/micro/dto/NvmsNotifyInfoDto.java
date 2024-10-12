package com.micro.dto;

import com.alibaba.fastjson.JSONObject;

import lombok.Data;

@Data
public class NvmsNotifyInfoDto {

	private String operation;
	private String type;
	private JSONObject area;
	
	private JSONObject camera;
	
}
