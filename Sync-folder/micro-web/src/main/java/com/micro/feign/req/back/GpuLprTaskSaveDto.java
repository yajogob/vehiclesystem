package com.micro.feign.req.back;

import lombok.Data;

/**
 * @author lrj
 */
@Data
public class GpuLprTaskSaveDto {

    private String taskName;

    private String deviceId;

    private String rtspUrl;

    private String nvmsId;
}
