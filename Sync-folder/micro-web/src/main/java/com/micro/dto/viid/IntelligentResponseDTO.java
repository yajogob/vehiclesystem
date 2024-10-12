package com.micro.dto.viid;

import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * @author chenxiaolei
 * @date 2020/5/15
 */
@Data
public class IntelligentResponseDTO {

    private String id;

    private Integer statusCode;

    private String statusString;

    private String requestURL;

    private Date localTime;

    private Object data;

    private List<FailedObject> failedObjectList;

    @Data
    public static class IntelligentResponseObject {

        private List<IntelligentResponseDTO> responseStatusObject;

    }

    @Data
    public static class IntelligentResponseObjectSingle {

        private IntelligentResponseDTO responseStatusObject;

    }

    @Data
    public static class IntelligentResponseListObject {

        private IntelligentResponseObject responseStatusListObject;

    }

}
