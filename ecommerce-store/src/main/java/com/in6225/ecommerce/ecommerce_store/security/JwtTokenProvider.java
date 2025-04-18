package com.in6225.ecommerce.ecommerce_store.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private SecretKey jwtSecret;

    @Value("${jwt.secret}")
    private String secret;

    @PostConstruct
    public void init() {
        byte[] decodedKey = Base64.getDecoder().decode(secret);
        this.jwtSecret = Keys.hmacShaKeyFor(decodedKey); // ✅ Decodes the Base64 secret key
    }

    /**
     * ✅ Generate JWT Token
     */
    public String generateToken(Authentication authentication) {
        return Jwts.builder()
                .setSubject(authentication.getName())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1-day expiry
                .signWith(jwtSecret, SignatureAlgorithm.HS256) // Uses secure signing 256-bit key
                .compact();
    }

    /**
     * ✅ Validate JWT Token
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(jwtSecret).build().parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            System.out.println("⚠️ JWT Token expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.out.println("⚠️ Unsupported JWT Token: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.out.println("⚠️ Invalid JWT Token: " + e.getMessage());
        } catch (SignatureException e) {
            System.out.println("⚠️ Invalid JWT signature: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.out.println("⚠️ JWT claims string is empty: " + e.getMessage());
        }
        return false;
    }

    /**
     * ✅ Extract Username from Token
     */
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(jwtSecret)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
