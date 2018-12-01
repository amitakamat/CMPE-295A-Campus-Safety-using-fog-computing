package com.example.pavana.campuswatch;

//import FirebaseInstanceIdService;
import com.google.firebase.iid.FirebaseInstanceIdService;
import com.google.firebase.iid.FirebaseInstanceId;
import android.util.Log;

public class FirebaseIDService extends FirebaseInstanceIdService {
    private static final String TAG = "FirebaseIDService";

    @Override
    public void onTokenRefresh() {
        // Get updated InstanceID token.
        String refreshedToken = FirebaseInstanceId.getInstance().getToken();
        Log.d(TAG, "Refreshed token: " + refreshedToken);

        // TODO: Implement this method to send any registration to your app's servers.
        sendRegistrationToServer(refreshedToken);
    }
    private void sendRegistrationToServer(String token) {
        // Add custom implementation, as needed.
    }
}

