package com.example.vetcaredesk;


import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.stage.Stage;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class LoginController {

    private static final String AUTH_URL = "http://localhost:8080/auth/login";

    @FXML
    private TextField txtEmail;

    @FXML
    private PasswordField txtSenha;

    @FXML
    private void onLoginButtonClick(ActionEvent event) throws IOException {
        String email = txtEmail.getText().trim();
        String senha = txtSenha.getText();

        if (email.isBlank() || senha.isBlank()) {
            showMenssage("Informe email e senha.", Alert.AlertType.WARNING);
            return;
        }

        HttpURLConnection connection = (HttpURLConnection) new URL(AUTH_URL).openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
        connection.setConnectTimeout(5000);
        connection.setReadTimeout(5000);
        connection.setDoOutput(true);

        String json = "{"
                + "\"email\":\"" + escapeJson(email) + "\","
                + "\"senha\":\"" + escapeJson(senha) + "\""
                + "}";

        try (OutputStream outputStream = connection.getOutputStream()) {
            outputStream.write(json.getBytes(StandardCharsets.UTF_8));
        }

        int statusCode = connection.getResponseCode();

        if (statusCode == HttpURLConnection.HTTP_OK) {
            String token = readResponseBody(connection.getInputStream());
            String jwt = extractToken(token);

            if (jwt == null || jwt.isBlank()) {
                connection.disconnect();
                showMenssage("Resposta de autenticacao invalida.", Alert.AlertType.ERROR);
                return;
            }

            SessionContext.setToken(jwt);
            showMenssage("Login efetuado com sucesso!", Alert.AlertType.INFORMATION);

            FXMLLoader loader = new FXMLLoader(getClass().getResource("menu-view.fxml"));
            Scene scene = new Scene(loader.load());
            Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
            stage.setScene(scene);

        } else {
            showMenssage("Email ou senha invalidos.", Alert.AlertType.ERROR);
        }

        connection.disconnect();
    }

    public static void showMenssage(String mensagem, Alert.AlertType tipo) {

        Alert alert = new Alert(tipo);
        alert.setTitle("Login");
        alert.setHeaderText(null);
        alert.setContentText(mensagem);
        alert.showAndWait();
    }

    private static String escapeJson(String value) {
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"");
    }

    private static String readResponseBody(InputStream inputStream) throws IOException {
        return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
    }

    private static String extractToken(String responseBody) {
        String marker = "\"token\":\"";
        int start = responseBody.indexOf(marker);
        if (start < 0) {
            return null;
        }

        int tokenStart = start + marker.length();
        int tokenEnd = responseBody.indexOf('"', tokenStart);
        if (tokenEnd < 0) {
            return null;
        }

        return responseBody.substring(tokenStart, tokenEnd);
    }
}