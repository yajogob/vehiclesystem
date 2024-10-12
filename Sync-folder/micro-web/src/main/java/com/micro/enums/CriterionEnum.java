package com.micro.enums;

public enum CriterionEnum {
    VEHICLE_ADMIN(1),
    DISTANCE(2),
    COMPARE(3);

    private CriterionEnum(int criterion){
        this.criterion = criterion;
    }

    @Override
    public String toString() {
        return String.valueOf(criterion);
    }

    private int criterion;

    public static CriterionEnum getCriterionEnumByCriterion(int cri) {
        for (CriterionEnum value : CriterionEnum.values()) {
            if (value.criterion == cri) {
                return value;
            }
        }
        return null;
    }
}
