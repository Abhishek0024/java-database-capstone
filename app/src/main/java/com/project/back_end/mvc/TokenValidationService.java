package com.project.back_end.mvc;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

@Service
public class TokenValidationService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    public boolean validateToken(String token, String role) {

        try {

            SecretKey key =
                    Keys.hmacShaKeyFor(jwtSecret.getBytes());

            Claims claims =
                    Jwts.parser()
                            .verifyWith(key)
                            .build()
                            .parseSignedClaims(token)
                            .getPayload();

            String tokenRole =
                    claims.get("role", String.class);

            return role.equalsIgnoreCase(tokenRole);

        } catch (Exception e) {

            return false;

        }
    }
}