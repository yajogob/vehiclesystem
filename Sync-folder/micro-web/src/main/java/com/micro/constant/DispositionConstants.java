package com.micro.constant;

public interface DispositionConstants {
    interface NOTIFICATION_TPOIC {
        String KAFKA_TOPIC = "vehicle_disposition_notification";
        String REDIS_NOTIFICATION_ID = "vehicle_disposition_notification:notification-id";
    }

    interface LUOPAN_ALARM {
        String REDIS_ALARM_ID = "luopan:alarm_id";
        String KAFKA_TOPIC = "luopan_disposition_notification";
    }
}


