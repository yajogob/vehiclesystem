package com.micro.dto.imageAnalysis;

import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;

@Data
public class ImageAnalysisParam {
    @JSONField(name = "ImageAnalysisObject")
    private ImageAnalysisObject imageAnalysisObject;
}
