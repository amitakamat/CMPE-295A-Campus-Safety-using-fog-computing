package com.example.pavana.campuswatch;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class MainActivity extends AppCompatActivity {
    private Button signInButton;
    private Button signUpButton;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        signInButton = findViewById(R.id.button_sign_in);
        signUpButton = findViewById(R.id.button_sign_up);
    }
    public void SignIn(View view)
    {
        Intent intent=new Intent(getApplicationContext(),SignInActivity.class);
        startActivity(intent);

    }

    public void SignUp(View view)
    {
        Intent intent=new Intent(getApplicationContext(),SignUpActivity.class);
        startActivity(intent);

    }
}
