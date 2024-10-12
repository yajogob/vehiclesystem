package com.micro.feign.req.nvms;

import lombok.Data;

/**
 * @author lrj
 */
@Data
public class NvmsGetRtspReq {

    private String cameraId;

    private String protocol;

    private String location;


}
