package com.micro.dto.imageAnalysis;

import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;

@Data
public class AnalysisType {
    @JSONField(name = "Type")
    private Integer type;
}
