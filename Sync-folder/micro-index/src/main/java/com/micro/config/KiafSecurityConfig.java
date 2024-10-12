package com.micro.config;

import com.kedacom.ctsp.authz.oauth2.client.OAuth2WebSecurityConfigurerAdaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;

@Configuration
@ConditionalOnProperty(name = "common.security.disable", havingValue = "true")
public class KiafSecurityConfig extends OAuth2WebSecurityConfigurerAdaptor {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.headers().frameOptions().disable();
        super.configure(http);
    }
    @Autowired
    private UserDetailsService userDetailsService;
    @Override
    protected void configure(AuthenticationManagerBuilder auth) {
        if (userDetailsService != null) {
            DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
            authProvider.setPreAuthenticationChecks(preAuthenticationChecker());
            authProvider.setPostAuthenticationChecks(postAuthenticationChecker());
            authProvider.setPasswordEncoder(passwordEncoder());
            authProvider.setUserDetailsService(userDetailsService);
            auth.authenticationProvider(authProvider);
        }
    }

}
