package com.micro.dto.imageAnalysis;

import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;

import java.util.List;

@Data
public class ImageAnalysisObject {
    @JSONField(name = "AnalysisTypeList")
    private List<AnalysisType> analysisTypeList;

    @JSONField(name = "AnalysisImageList")
    private List<AnalysisImage> analysisImageList;
}
