
package Back_end.demo.service;

import Back_end.demo.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey chave;

    private final long tempoExpiracao = 86400000; // 24 horas

    public JwtService(@Value("${jwt.secret}") String segredo) {
        byte[] chaveBytes = java.util.Base64.getDecoder().decode(segredo);
        this.chave = Keys.hmacShaKeyFor(chaveBytes);
    }

    public String gerarToken(Usuario usuario) {

        Date agora = new Date();
        Date expiracao = new Date(agora.getTime() + tempoExpiracao);

        return Jwts.builder()
                .subject(usuario.getEmail())
                .claim("tipo", usuario.getTipo().name())
                .issuedAt(agora)
                .expiration(expiracao)
                .signWith(chave)
                .compact();
    }

    public String extrairEmail(String token) {
        return extrairClaims(token).getSubject();
    }

    public boolean validarToken(String token, Usuario usuario) {
        try {
            String email = extrairEmail(token);

            return email.equals(usuario.getEmail())
                    && extrairClaims(token).getExpiration().after(new Date());

        } catch (Exception e) {
            return false;
        }
    }

    private Claims extrairClaims(String token) {
        return Jwts.parser()
                .verifyWith(chave)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
