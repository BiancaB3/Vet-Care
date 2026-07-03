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
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

import static com.example.vetcaredesk.LoginController.showMenssage;

public class UsuarioController {

    private static final String VETERINARIO_CADASTRO_URL = "http://localhost:8080/veterinarios/cadastro";

    @FXML
    private TextField txtNome;

    @FXML
    private TextField txtEmail;

    @FXML
    private PasswordField txtSenha;

    @FXML
    private TextField txtCrmv;

    @FXML
    private TextField txtEspecialidade;

    @FXML
    private TextField txtTelefone;

    @FXML
    private void onVoltarButtonClick(ActionEvent event) throws IOException {

        FXMLLoader loader = new FXMLLoader(getClass().getResource("menu-view.fxml"));
        Scene scene = new Scene(loader.load());
        Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
        stage.setScene(scene);
    }

    @FXML
    private void onSalvarButtonClick(ActionEvent event) throws IOException {
        String nome = txtNome.getText().trim();
        String email = txtEmail.getText().trim();
        String senha = txtSenha.getText();
        String crmv = txtCrmv.getText().trim();
        String especialidade = txtEspecialidade.getText().trim();
        String telefone = txtTelefone.getText().trim();

        if (nome.isBlank()
                || email.isBlank()
                || senha.isBlank()
                || crmv.isBlank()
                || especialidade.isBlank()
                || telefone.isBlank()) {
            showMenssage("Preencha todos os campos do cadastro.", Alert.AlertType.WARNING);
            return;
        }

        URL url = new URL(VETERINARIO_CADASTRO_URL);

        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
        conn.setConnectTimeout(5000);
        conn.setReadTimeout(5000);

        conn.setDoOutput(true);

        String json = "{"
                + "\"nome\":\"" + escapeJson(nome) + "\","
                + "\"crmv\":\"" + escapeJson(crmv) + "\","
                + "\"especialidade\":\"" + escapeJson(especialidade) + "\","
                + "\"telefone\":\"" + escapeJson(telefone) + "\","
                + "\"email\":\"" + escapeJson(email) + "\","
                + "\"senha\":\"" + escapeJson(senha) + "\""
                + "}";

        try (OutputStream os = conn.getOutputStream()) {
            os.write(json.getBytes(StandardCharsets.UTF_8));
        }

        int code = conn.getResponseCode();
        if (code == HttpURLConnection.HTTP_OK || code == HttpURLConnection.HTTP_CREATED) {

            showMenssage("Veterinario cadastrado com sucesso!", Alert.AlertType.INFORMATION);

            FXMLLoader loader = new FXMLLoader(getClass().getResource("menu-view.fxml"));
            Scene scene = new Scene(loader.load());
            Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
            stage.setScene(scene);

        } else {
            if (code == HttpURLConnection.HTTP_UNAUTHORIZED || code == HttpURLConnection.HTTP_FORBIDDEN) {
                showMenssage("Sessao invalida ou sem permissao para cadastrar veterinario.", Alert.AlertType.ERROR);
            } else {
                showMenssage("Erro ao salvar veterinario.", Alert.AlertType.ERROR);
            }
        }

        conn.disconnect();
    }

    private static String escapeJson(String value) {
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"");
    }
}