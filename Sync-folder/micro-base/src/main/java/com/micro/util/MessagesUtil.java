package com.micro.util;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;

import java.util.ResourceBundle;

public class MessagesUtil {
    private static MessageSource messageSource = VisualSpringContextUtil.getBean(MessageSource.class);

    public static String getMessage(String code, Object... args){
        ResourceBundle bundle = ResourceBundle.getBundle("authority", LocaleContextHolder.getLocale());
        return bundle.getString(code);
//        return messageSource.getMessage(code, args, LocaleContextHolder.getLocale());
    }
}
