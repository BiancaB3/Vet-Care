package VetCare.Back.infra.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http.cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                PublicApiPaths.AUTH_LOGIN,
                                PublicApiPaths.SWAGGER_UI,
                                PublicApiPaths.SWAGGER_UI_HTML,
                                PublicApiPaths.WEBJARS,
                                PublicApiPaths.SWAGGER_RESOURCES,
                                PublicApiPaths.V2_API_DOCS,
                                PublicApiPaths.V3_API_DOCS,
                                PublicApiPaths.V3_API_DOCS_ROOT
                        ).permitAll()
                        .requestMatchers(
                                HttpMethod.GET,
                                PublicApiPaths.ENDERECOS + "/**"
                        ).permitAll()
                        .requestMatchers(
                                HttpMethod.POST,
                                PublicApiPaths.VETERINARIOS_CADASTRO
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
