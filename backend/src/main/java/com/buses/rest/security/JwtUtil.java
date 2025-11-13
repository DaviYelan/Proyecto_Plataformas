package com.buses.rest.security;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

public final class JwtUtil {

    private static final String DEFAULT_SECRET = "change_this_to_a_secure_random_secret_key_which_is_long_enough";

    private JwtUtil() {}

    private static SecretKey getSigningKey() {
        String secret = System.getenv("JWT_SECRET");
        if (secret == null || secret.isEmpty()) {
            secret = DEFAULT_SECRET;
        }
        // Ensure key length by padding/truncating
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            byte[] padded = new byte[32];
            System.arraycopy(keyBytes, 0, padded, 0, keyBytes.length);
            for (int i = keyBytes.length; i < padded.length; i++) padded[i] = (byte) '0';
            keyBytes = padded;
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public static String generateToken(String subject, Map<String, Object> claims) {
        long expSeconds = 3600; // default 1 hour
        String expEnv = System.getenv("JWT_EXP_SECONDS");
        if (expEnv != null) {
            try { expSeconds = Long.parseLong(expEnv); } catch (NumberFormatException ignored) {}
        }
        Date now = new Date();
        Date exp = new Date(now.getTime() + expSeconds * 1000L);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public static Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
