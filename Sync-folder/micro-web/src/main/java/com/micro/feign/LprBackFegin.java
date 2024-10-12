package com.micro.feign;


import com.kedacom.ctsp.web.controller.message.ResponseMessage;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import com.micro.feign.req.back.GpuLprTaskSaveDto;

import java.util.List;

/**
 *
 * @author lrj
 */
@FeignClient(name = "lprBackFeign", url = "${lpr.back.feign.url:https://ezview.devdolphin.com/ezview-structuredservice}")
public interface LprBackFegin {

    /**
     * send analysis task
     * @param gpuLprTaskSaveDto
     * @return
     */
    @PostMapping("/lpr/algorithms/gpuLprTaskSave")
    ResponseMessage sendAnalysisTask(@RequestBody GpuLprTaskSaveDto gpuLprTaskSaveDto);

    /**
     * send analysis task
     * @param gpuLprTaskSaveDto
     * @return
     */
    @PostMapping("/lpr/algorithms/gpuLprTaskStop")
    ResponseMessage stopAnalysisTask(@RequestBody GpuLprTaskSaveDto gpuLprTaskSaveDto);

}
