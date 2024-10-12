package com.micro.log;

import com.alibaba.fastjson.JSON;
import com.kedacom.kidp.base.data.common.audit.support.AuditContext;
import com.kedacom.kidp.base.data.common.audit.support.AuditType;
import com.kedacom.kidp.base.web.audit.event.AuditEvent;
import com.kedacom.kidp.base.web.audit.impl.DefaultAuditLog;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.velocity.VelocityContext;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.util.Map;
import java.util.zip.GZIPOutputStream;


/**
 * @author kedacom
 * @date 2018-11-16
 */
@Component
@Slf4j
public class KiafLogAudit extends DefaultAuditLog {


    @Value("${log.aspect.db:null}")
    private String accessLogDb;
    @Value("${log.aspect.file:null}")
    private String accessLogFile;

    @Override
    public boolean accept(AuditEvent auditEvent) {
        return auditEvent.getAuditContext().getControllerClass().getPackage().getName().startsWith("com.kedacom.kiaf");
    }

    @Override
    public void log(AuditEvent auditEvent) {

        if (AuditType.ACCESS.equals(auditEvent.getType())) {

            if (null == auditEvent.getAuditContext()) {
                log.error("log(), auditContext = null");
                return;
            }
            try {
                LogTempDTO savedTempLog = preProcessLog(auditEvent.getAuditContext());
                String[] logFiles = accessLogFile.split(",");
                boolean isNotFile = true;
                if (auditEvent.getAuditContext() != null && StringUtils.isNotEmpty(auditEvent.getAuditContext().getModule())) {
                    for (String logName : logFiles) {
                        if (logName.equals(auditEvent.getAuditContext().getModule())) {
                            org.slf4j.Logger logger = LoggerFactory.getLogger(logName);
                            logger.info(savedTempLog.toString());
                            isNotFile = false;
                            break;
                        }
                    }
                }
                if (isNotFile) {
                    log.info(savedTempLog.toString());
                }

            } catch (Exception e) {
                log.error(e.getMessage(), e);
            }
        }
    }


    /**
     * log
     */
    private LogTempDTO preProcessLog(AuditContext auditContext) {

        LogTempDTO logTempDTO = new LogTempDTO();
        logTempDTO.setRequestUrl(auditContext.getUrl());
        logTempDTO.setMethodType(auditContext.getRequestMethod());
        logTempDTO.setIp(auditContext.getIp());
        logTempDTO.setClassMethod(auditContext.getControllerClass().getName());
        logTempDTO.setModule(auditContext.getModule());

        if (null != auditContext.getContext()) {
            log.debug("preProcessLog(), context = " + JSON.toJSONString(auditContext.getContext()));
            String args = getArgs(auditContext.getContext());
            logTempDTO.setZipArgs(zipString(args));
        }

        return logTempDTO;
    }

    private String zipString(String str) {
        try {
            ByteArrayOutputStream bos = null;
            GZIPOutputStream os = null;
            Object bs = null;

            String var4;
            try {
                bos = new ByteArrayOutputStream();
                os = new GZIPOutputStream(bos);
                os.write(str.getBytes());
                os.close();
                bos.close();
                byte[] bss = bos.toByteArray();
                var4 = new String(bss, "iso-8859-1");
            } finally {
                bs = null;
                bos = null;
                os = null;
            }

            return var4;
        } catch (Exception var9) {
            return str;
        }
    }

    private String getArgs(VelocityContext velocityContext) {
        String args = "";
        String param = "param";
        String body = "body";
        if (velocityContext.internalContainsKey(param)) {
            Map paramsMap = (Map) velocityContext.internalGet(param);
            if (paramsMap != null && paramsMap.size() > 0) {
                args = JSON.toJSONString(paramsMap);
            }
        }

        if (velocityContext.internalContainsKey(body)) {
            Object bodyObj = velocityContext.internalGet(body);
            if (bodyObj != null) {
                args = JSON.toJSONString(bodyObj);
            }
        }
        return args;
    }
}
