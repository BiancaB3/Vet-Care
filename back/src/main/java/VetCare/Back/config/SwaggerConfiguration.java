package VetCare.Back.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfiguration {

    @Bean
    public OpenAPI customOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("VetCare API")
                        .version("1.0")
                        .description("API responsável por gerenciar o sistema veterinário VetCare!")
                        .termsOfService("http://localhost:3000")
                );
    }
}