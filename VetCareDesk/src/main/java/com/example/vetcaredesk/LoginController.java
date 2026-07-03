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

public class LoginController {

    @FXML
    private TextField txtEmail;

    @FXML
    private PasswordField txtSenha;

    @FXML
    private void onLoginButtonClick(ActionEvent event) throws IOException {

        if (txtEmail.getText().equals("admin")
                && txtSenha.getText().equals("12345")) {
            showMenssage("Login efetuado com sucesso!", Alert.AlertType.INFORMATION);

            FXMLLoader loader = new FXMLLoader(getClass().getResource("menu-view.fxml"));
            Scene scene = new Scene(loader.load());
            Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
            stage.setScene(scene);

        } else {
            showMenssage("Usuario e senha invalido!", Alert.AlertType.ERROR);
        }
    }

    public static void showMenssage(String mensagem, Alert.AlertType tipo) {

        Alert alert = new Alert(tipo);
        alert.setTitle("Login");
        alert.setHeaderText(null);
        alert.setContentText(mensagem);
        alert.showAndWait();
    }
}