package VetCare.Back.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import VetCare.Back.model.entities.Token;
import VetCare.Back.model.entities.Veterinario;
import VetCare.Back.model.repository.TokenRepository;
import VetCare.Back.model.repository.VeterinarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;


@Service
public class TokenService {

    @Value("${spring.secretkey}")
    private String secret;

    @Value("${spring.emissor}")
    private String emissor;

    @Value("${spring.tempoExpiracao}")
    private Long tempoExpiracao;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private VeterinarioRepository veterinarioRepository;


    public Veterinario validarToken(String token) {

        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);

            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer(emissor)
                    .build();

            verifier.verify(token);

            var tokenBanco = tokenRepository.findTokenByToken(token)
                    .orElseThrow(() -> new RuntimeException("Token nao localizado"));

            return tokenBanco.getVeterinario();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    public String gerarToken(String email) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            String token = JWT.create()
                    .withIssuer(emissor)
                    .withSubject(email)
                    .withExpiresAt(gerarDataExpiracao())
                    .sign(algorithm);

            var veterinario = veterinarioRepository.findByEmail(email).orElse(null);
            tokenRepository.save(new Token(token, veterinario));

            return token;
        } catch (Exception e) {
            return null;
        }
    }

    private Instant gerarDataExpiracao() {

        return LocalDateTime.now().plusMinutes(tempoExpiracao).toInstant(ZoneOffset.of("-03:00"));
    }

}
