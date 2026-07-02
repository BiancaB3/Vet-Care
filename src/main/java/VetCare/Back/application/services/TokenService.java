package VetCare.Back.application.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import VetCare.Back.domain.entities.Token;
import VetCare.Back.domain.repository.TokenRepository;
import VetCare.Back.domain.repository.VeterinarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private VeterinarioRepository veterinarioRepository;

    @Value("${spring.secretkey}")
    private String secret;


    @Value("${spring.emissor}")
    private String emissor;

    @Value("${spring.tempoExpiracao}")
    private Long tempoExpiracao;


    public DecodedJWT validarToken(String token){
        Algorithm algoritomo = Algorithm.HMAC256(secret);
        JWTVerifier verifier = JWT.require(algoritomo)
                .withIssuer(emissor)
                .build();

        DecodedJWT decoded = verifier.verify(token);

        tokenRepository.findTokenByToken(token)
            .orElseThrow(() -> new JWTVerificationException("Token não encontrado na base."));

        return decoded;
    }


    public String gerarToken(String email) {

        try{
            Algorithm algoritomo = Algorithm.HMAC256(secret);
            String token = JWT.create()
                    .withIssuer(emissor)
                    .withSubject(email)
                    .withExpiresAt(gerarDataExpiracao())
                    .sign(algoritomo);

                var veterinario = veterinarioRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Veterinário não encontrado para o token."));

                tokenRepository.save(new Token(token, veterinario));

            return token;


        }catch (Exception e){

            return  null;
        }

    }

    private Instant gerarDataExpiracao(){

        return LocalDateTime.now().plusMinutes(tempoExpiracao).toInstant(ZoneOffset.of("-03:00"));
    }

}