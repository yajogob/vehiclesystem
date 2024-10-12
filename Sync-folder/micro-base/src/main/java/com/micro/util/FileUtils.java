package com.micro.util;

import com.kedacom.kidp.base.web.exception.ServiceException;
import org.apache.commons.lang3.StringUtils;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;


public class FileUtils {

    private static Base64.Encoder encoder = Base64.getEncoder();

    public static String httpToBase64(String url){
        if(StringUtils.isBlank(url)){
            return url;
        }
        try {
            HttpURLConnection httpUrl = (HttpURLConnection) new URL(url).openConnection();
            httpUrl.connect();
            return encodeToString(inputStreamToFile(httpUrl.getInputStream()));
        } catch (Exception e) {
            throw new ServiceException("fail convert image to base64");
        }
    }

    private static byte[] inputStreamToFile(InputStream ins) throws Exception{
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        int bytesRead;
        int len = 8192;
        byte[] buffer = new byte[len];
        while ((bytesRead = ins.read(buffer, 0, len)) != -1) {
            out.write(buffer, 0, bytesRead);
        }
        byte[] data = out.toByteArray();
        out.close();
        ins.close();
        return data;
    }

    private static String encodeToString(byte[] data) {
        return encoder.encodeToString(data);
    }
}
