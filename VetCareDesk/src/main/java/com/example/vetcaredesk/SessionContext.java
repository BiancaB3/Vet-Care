package com.example.vetcaredesk;

public final class SessionContext {

    private static String token;

    private SessionContext() {
    }

    public static void setToken(String novoToken) {
        token = novoToken;
    }

    public static String getToken() {
        return token;
    }

    public static void clear() {
        token = null;
    }
}