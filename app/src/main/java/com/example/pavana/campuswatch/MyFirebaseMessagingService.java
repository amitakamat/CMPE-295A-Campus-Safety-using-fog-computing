package com.example.pavana.campuswatch;


import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.support.v4.app.NotificationCompat;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import android.util.Log;
import android.support.v4.app.TaskStackBuilder;


public class MyFirebaseMessagingService  extends FirebaseMessagingService {
    public static final String EXTRA_MESSAGE = "com.example.pavana.campuswatch.MESSAGE";
    public static final String IMAGE_CODE = "com.example.pavana.campuswatch.IMAGE";
    private static final String TAG = "FCM Service";

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        if (remoteMessage.getData().size() > 0)
        {
            Log.d(TAG, "Message data payload: " + remoteMessage.getData());

//            //TODO: Handle data
//            Log.d(TAG, "From: " + remoteMessage.getFrom());
//            Log.d(TAG, "Notification Message Body: " + remoteMessage.getNotification().getBody());

            String id_Recieved = remoteMessage.getData().get("id");
            String notify_message = remoteMessage.getData().get("message");

            Log.d(TAG, "Message: "+notify_message+" DB Doc id recieved: "+id_Recieved);

            sendNotification(notify_message, id_Recieved);
        }

    }

    private void sendNotification(String messageBody, String imageCode) {
        Intent intent = new Intent(this, NavigationActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        intent.putExtra(EXTRA_MESSAGE, messageBody);
        intent.putExtra(IMAGE_CODE, imageCode);

        TaskStackBuilder stackBuilder = TaskStackBuilder.create(this);
        stackBuilder.addNextIntentWithParentStack(intent);

        PendingIntent pendingIntent = stackBuilder.getPendingIntent(0, PendingIntent.FLAG_UPDATE_CURRENT);

        String channelId = getString(R.string.default_notification_channel_id);
        String channelName = getString(R.string.default_notification_channel_name);
        Uri defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        NotificationCompat.Builder notificationBuilder =
                new NotificationCompat.Builder(this, channelId)
                        .setSmallIcon(R.drawable.ic_stat_ic_notification)
                        .setContentTitle(getString(R.string.fcm_message))
                        .setContentText(messageBody)
                        .setAutoCancel(true)
                        .setSound(defaultSoundUri)
                        .setContentIntent(pendingIntent);

        NotificationManager notificationManager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

        // Since android Oreo notification channel is needed.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(channelId,
                    "Channel human readable title",
                    NotificationManager.IMPORTANCE_HIGH);
            notificationManager.createNotificationChannel(channel);
        }

        notificationManager.notify(0 /* ID of notification */, notificationBuilder.build());
    }
}
