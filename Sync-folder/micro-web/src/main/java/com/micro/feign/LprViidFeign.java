package com.micro.feign;


import com.alibaba.fastjson.JSONObject;
import com.kedacom.ctsp.web.controller.message.ResponseMessage;
import com.micro.feign.req.back.GpuLprTaskSaveDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8_VALUE;

/**
 *
 * @author lrj
 */
@FeignClient(name = "lprViidFeign", url = "${lpr.viid.feign.url:http://gbp-all-test.testdolphin.com:21318}")
public interface LprViidFeign {

    /**
     * @param json
     * @return
     */
    @PostMapping(value = "/VIID/Images?ResultObj=1", consumes = APPLICATION_JSON_UTF8_VALUE)
    JSONObject saveImage(@RequestBody JSONObject json);

}
