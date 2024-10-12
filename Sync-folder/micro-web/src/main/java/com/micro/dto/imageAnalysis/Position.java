package com.micro.dto.imageAnalysis;

import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;

@Data
public class Position {
    @JSONField(name = "LeftTopX")
    private Integer leftTopX;

    @JSONField(name = "LeftTopY")
    private Integer leftTopY;

    @JSONField(name = "RightBtmX")
    private Integer rightBtmX;

    @JSONField(name = "RightBtmY")
    private Integer rightBtmY;
}
