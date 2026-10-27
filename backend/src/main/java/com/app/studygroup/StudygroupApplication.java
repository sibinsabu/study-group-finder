package com.app.studygroup;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.server.servlet.context.ServletComponentScan;

@SpringBootApplication
@ServletComponentScan(basePackages = "com.app.studygroup.servlet")
public class StudygroupApplication {

	public static void main(String[] args) {
		SpringApplication.run(StudygroupApplication.class, args);
	}

}
