package com.example.pavana.campuswatch;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
//import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

public class SignUpActivity extends AppCompatActivity {
//    private DatabaseReference mDatabase;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_up);
//        mDatabase = FirebaseDatabase.getInstance().getReference();
    }

    private void writeNewUser(String userId, String name, String email) {
        User user = new User();
        user.setEmail(email);
        user.setUsername(name);

//        mDatabase.child("users").child(userId).setValue(user);
    }
}
