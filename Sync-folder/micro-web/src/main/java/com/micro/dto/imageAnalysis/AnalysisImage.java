package com.micro.dto.imageAnalysis;

import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;

import java.util.List;

@Data
public class AnalysisImage {
    @JSONField(name = "ImageID")
    private String imageId;

    @JSONField(name = "StoragePath")
    private String storagePath;

    @JSONField(name = "Data")
    private String data;

    @JSONField(name = "AnalysisAreaList")
    private List<Position> analysisAreaList;

    @JSONField(name = "AnalysisTargetList")
    private List<AnalysisTarget> analysisTargetList;

    @JSONField(name = "TabID")
    private String tabId;
}
