package com.micro.dto.imageAnalysis;

import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;

import java.util.List;

@Data
public class AnalysisTarget {
    @JSONField(name = "Type")
    private Integer type;

    @JSONField(name = "Position")
    private Position position;

    @JSONField(name = "LocalPosition")
    private List<Position> localPosition;
}
