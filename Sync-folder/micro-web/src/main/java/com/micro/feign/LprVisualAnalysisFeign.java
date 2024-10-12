package com.micro.feign;


import com.alibaba.fastjson.JSONObject;
import com.kedacom.ctsp.web.controller.message.ResponseMessage;
import com.micro.dto.imageAnalysis.ImageAnalysisParam;
import com.micro.feign.req.back.GpuLprTaskSaveDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

/**
 *
 * @author lrj
 */
@FeignClient(name = "lprVisualAnalysisFeign", url = "${lpr.visual.analysis.feign.url:http://lprcommon-test.testdolphin.com/analysis-platform}")
public interface LprVisualAnalysisFeign {

    /**
     * send image analysis task
     * @return
     */
    @PostMapping("/VIAS/ImageAnalysisSync")
    JSONObject imageAnalysisSync(@RequestBody ImageAnalysisParam imageAnalysisParam, @RequestHeader(value = "AlgorithmVendor")String algorithmVendor);

}
