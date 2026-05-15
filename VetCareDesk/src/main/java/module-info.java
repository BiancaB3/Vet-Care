module com.example.vetcaredesk {
    requires javafx.controls;
    requires javafx.fxml;


    opens com.example.vetcaredesk to javafx.fxml;
    exports com.example.vetcaredesk;
}