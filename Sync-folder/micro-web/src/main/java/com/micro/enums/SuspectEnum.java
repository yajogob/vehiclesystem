package com.micro.enums;

public enum SuspectEnum {
    FAKE_RECORD(0),
    DECK_RECORD(1);


    private SuspectEnum(int suspect){
        this.value = suspect;
    }

    @Override
    public String toString() {
        return String.valueOf(value);
    }

    private int value;
}
