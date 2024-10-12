package com.micro.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
public enum FakeVehiclePlateAnalyseTypeEnum {
    MOTOR_VEHICLE("MOTOR_VEHICLE", "MOTOR_VEHICLE"),
    KDMOTOR_VEHICLE("KDMOTOR_VEHICLE", "KEDA_MOTOR_VEHICLE");

    @Getter
    private String value;

    @Getter
    private String label;
}
