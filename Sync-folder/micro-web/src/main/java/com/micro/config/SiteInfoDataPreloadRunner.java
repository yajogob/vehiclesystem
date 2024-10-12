package com.micro.config;

import javax.annotation.Resource;

import org.springframework.boot.CommandLineRunner;

import com.micro.kafka.consumer.LprNvmsDeviceNotifyConsumer;

public class SiteInfoDataPreloadRunner implements CommandLineRunner {

	@Resource
	private LprNvmsDeviceNotifyConsumer lprNvmsDeviceNotifyConsumer;
	
	@Override
	public void run(String... args) throws Exception {
		
		lprNvmsDeviceNotifyConsumer.init();
	}

}
