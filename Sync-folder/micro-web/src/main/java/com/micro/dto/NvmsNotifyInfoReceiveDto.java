package com.micro.dto;

import com.alibaba.fastjson.JSONObject;
import lombok.Data;

@Data
public class NvmsNotifyInfoReceiveDto {

	private String operation;
	private String type;
	private JSONObject mapping;

}
