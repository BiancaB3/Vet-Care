package VetCare.Back.infra.config;

import VetCare.Back.services.TokenService;
import VetCare.Back.services.VeterinarioUserDetailsService;
import com.auth0.jwt.exceptions.JWTVerificationException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private VeterinarioUserDetailsService veterinarioUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        if (isPublicPath(path, request.getMethod())) {
            filterChain.doFilter(request,response);
            return;
        }

        String header = request.getHeader("Authorization");

        if(header != null&& header.startsWith("Bearer ")){
            String token = header.replace("Bearer ","");

            try {
                var retornotoken = tokenService.validarToken(token);
                var usuarioLogado = veterinarioUserDetailsService.loadUserByUsername(retornotoken.getSubject());

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                usuarioLogado,
                                null,
                                usuarioLogado.getAuthorities()
                        );

                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (JWTVerificationException ex) {
                SecurityContextHolder.clearContext();
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token invalido ou expirado.");
                return;
            }
        }else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token não informado ou invalido");
            return;
        }

        filterChain.doFilter(request,response);



    }

    private boolean isPublicPath(String path, String method) {
        return path.equals("/auth/login")
                || path.startsWith("/swagger-ui")
                || path.startsWith("/webjars")
                || path.startsWith("/swagger-resources")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/v2/api-docs")
                || path.equals("/swagger-ui.html")
                || (path.equals("/veterinarios/bootstrap") && HttpMethod.POST.matches(method))
                || HttpMethod.OPTIONS.matches(method);
    }
}