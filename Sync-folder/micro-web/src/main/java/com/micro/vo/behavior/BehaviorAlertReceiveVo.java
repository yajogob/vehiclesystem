package com.micro.vo.behavior;

import lombok.Data;

import java.util.List;

@Data
public class BehaviorAlertReceiveVo {

    private String analysisType;

    private String alertId;

    private List<BehaviorAlertObjectReceiveVo> behaviorObject;

}
