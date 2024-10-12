package com.micro.feign;


import com.kedacom.ctsp.web.controller.message.ResponseMessage;
import com.micro.feign.req.back.GpuLprTaskSaveDto;
import com.micro.feign.req.nvms.NvmsGetRtspReq;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 *
 * @author lrj
 */
@FeignClient(name = "lprBackFeign", url = "${nvms.feign.url:http://10.144.36.156:30013}")
public interface NvmsFegin {

    /**
     * get rtsp url by nvmsId
     * @param nvmsGetRtspReq
     * @return
     */
    @PostMapping("/nvms/camera/liveurl")
    String getRtspByNvmsId(@RequestBody NvmsGetRtspReq nvmsGetRtspReq);
}
