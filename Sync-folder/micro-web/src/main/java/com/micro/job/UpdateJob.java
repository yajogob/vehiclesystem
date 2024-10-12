package com.micro.job;


import com.micro.service.FakeAlgService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class UpdateJob {
    @Autowired
    private FakeAlgService fakeAlgService;

    private static Logger logger  = LoggerFactory.getLogger(UpdateJob.class);
    @Scheduled(cron = "0 */5 * * * ?")
    public void update(){
        fakeAlgService.setCache();
    }
}
