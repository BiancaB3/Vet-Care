package VetCare.Back.infra.config;

import org.springframework.http.HttpMethod;

final class PublicApiPaths {

    static final String AUTH_LOGIN = "/auth/login";
    static final String SWAGGER_UI = "/swagger-ui/**";
    static final String SWAGGER_UI_HTML = "/swagger-ui.html";
    static final String WEBJARS = "/webjars/**";
    static final String SWAGGER_RESOURCES = "/swagger-resources/**";
    static final String V2_API_DOCS = "/v2/api-docs/**";
    static final String V3_API_DOCS = "/v3/api-docs/**";
    static final String V3_API_DOCS_ROOT = "/v3/api-docs";
    static final String VETERINARIOS_CADASTRO = "/veterinarios/cadastro";
    static final String ENDERECOS = "/api/enderecos";

    private PublicApiPaths() {
    }

    static boolean isPublic(String path, String method) {
        return AUTH_LOGIN.equals(path)
                || path.startsWith("/swagger-ui")
                || path.startsWith("/webjars")
                || path.startsWith("/swagger-resources")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/v2/api-docs")
                || path.startsWith(ENDERECOS)
                || SWAGGER_UI_HTML.equals(path)
                || (VETERINARIOS_CADASTRO.equals(path) && HttpMethod.POST.matches(method))
                || HttpMethod.OPTIONS.matches(method);
    }
}