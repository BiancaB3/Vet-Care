package VetCare.Back.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
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


    public DecodedJWT validarToken(String token){
        Algorithm algoritomo = Algorithm.HMAC256(secret);
        JWTVerifier verifier = JWT.require(algoritomo)
                .withIssuer(emissor)
                .build();

        return verifier.verify(token);
    }


    public String gerarToken(String email) {

        try{
            Algorithm algoritomo = Algorithm.HMAC256(secret);
            String token = JWT.create()
                    .withIssuer(emissor)
                    .withSubject(email)
                    .withExpiresAt(gerarDataExpiracao())
                    .sign(algoritomo);

            return token;


        }catch (Exception e){

            return  null;
        }

    }

    private Instant gerarDataExpiracao(){

        return LocalDateTime.now().plusMinutes(tempoExpiracao).toInstant(ZoneOffset.of("-03:00"));
    }

}