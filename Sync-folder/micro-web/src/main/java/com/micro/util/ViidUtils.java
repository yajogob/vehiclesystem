package com.micro.util;

import com.kedacom.kiaf.common.util.DateUtils;

import java.util.Date;

/**
 *
 *
 * @author chenxiaolei
 * @date 2019/10/17
 */
public class ViidUtils {

    public static final String RESPONSE_SUCCESS_CODE = "0";

    public static final String BUSINESS_OBJECT_ID_TYPE_DISPOSITION = "01";

    public static String RESPONSE_STATUS_OBJECT_KEY = "ResponseStatusObject";

    public static final String TOTAL_NUM = "TotalNum";

    public static final String PERSON_COUNT_KEY = "PersonListObject";


    public static String generateImageID (String baseStr, String type, Long id) {
        StringBuilder imageId = new StringBuilder(com.kedacom.kiaf.common.util.StringUtils.isNotEmpty(baseStr)? baseStr : "10000000000201");
        imageId.append(DateUtils.formatVIIDDate(new Date())).append(type);
        String idStr = String.valueOf(id);
        if (idStr.length() > 5) {
            imageId.append(idStr.substring(idStr.length() - 4));
        }
        else {
            imageId.append(String.format("%04d", id));
        }
        return imageId.toString();
    }
}
