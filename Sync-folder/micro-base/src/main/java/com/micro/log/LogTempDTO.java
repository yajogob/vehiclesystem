package com.micro.log;

import lombok.Data;

/**
 */
@Data
public class LogTempDTO {

    private Long logTempId;

    private String requestUrl;

    private String methodType;

    private String ip;

    private String classMethod;

    private String methodArgs;

    private String zipArgs;

    private String module;
}

