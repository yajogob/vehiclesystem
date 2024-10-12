package com.micro.handler;


import com.alibaba.fastjson.JSONException;
import com.kedacom.ctsp.web.controller.message.ResponseMessage;
import com.kedacom.kidp.base.web.exception.ServiceException;
import com.kedacom.kidp.base.web.support.ResponseGenerator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * @author kedacom
 * @date 2018-11-16
 */

@ControllerAdvice
@Slf4j
@Order(KiafExceptionHandler.Order.GLOBAL_PRECEDENCE)
public class KiafExceptionHandler {


    @ExceptionHandler(ServiceException.class)
    @ResponseBody
    public ResponseMessage handleServiceException(ServiceException be) {
        log.error(be.getMsg(),be);
        return ResponseGenerator.genFailResult("Service exception :"+be.getMsg());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseBody
    public ResponseMessage handleIllegalParamException(MethodArgumentNotValidException e) {
        List<ObjectError> errors = e.getBindingResult().getAllErrors();
        StringBuilder tips = new StringBuilder("Parameter invalid : ");
        if (errors.size() > 0) {
            for (ObjectError error : errors) {
                tips.append(error.getDefaultMessage()).append("; ");
            }
            tips.deleteCharAt(tips.length() - 1);
        }
        return ResponseGenerator.genFailResult(tips);
    }


    @ExceptionHandler(JSONException.class)
    @ResponseBody
    public ResponseMessage handleJSONException(JSONException be) {
        log.error(be.getMessage(), be);
        return ResponseGenerator.genFailResult("The string must be in JSON format");
    }


    @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
    @ResponseBody
    public ResponseMessage handleVersionException(ObjectOptimisticLockingFailureException oplfe) {
        log.error(oplfe.getMessage(), oplfe);
        return ResponseGenerator.genFailResult("The data has been changed,Please update the data before modifying it.");
    }

    @ExceptionHandler(Throwable.class)
    @ResponseBody
    public ResponseMessage exceptionHandle(Throwable e) {
        String errorMsg = "java.util.LinkedHashMap cannot be cast to com.kedacom.ctsp.web.controller.message.ResponseMessage";
        log.error(e.getMessage(), e);
        if (errorMsg.equals(e.getMessage())) {
            return ResponseGenerator.genFailResult("The accessed interface does not exist");
        }
        return ResponseGenerator.genFailResult("Server internal error");
    }

    public interface Order {
        int GLOBAL_PRECEDENCE=Ordered.LOWEST_PRECEDENCE-11000;
    }
}
