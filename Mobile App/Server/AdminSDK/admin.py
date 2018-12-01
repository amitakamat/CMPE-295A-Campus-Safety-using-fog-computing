import firebase_admin
import datetime
from firebase_admin import credentials
from firebase_admin import messaging


'''
A Firebase Admin instance to publish messages via Firebase Cloud Messaging
'''


class FirebaseServer(object):
    def __init__(self):
        cred = credentials.Certificate('<campuswatchfirebaseproject-firebase-adminsdk.json>')
        self.app = firebase_admin.initialize_app(cred)
    '''
    Publish message via Firebase cloud messaging
    
    Args:
        topic: Name of the FCM topic to which the message should be sent.
        data: A dictionary of data fields to be sent in the message
        notification: A notification included in the message:
            title: title of the notification
            bodu: body of the notification
    '''
    def publish_andr(self, data):
        android = messaging.AndroidConfig(
            ttl=datetime.timedelta(seconds=3600),
            priority='high',
            notification=messaging.AndroidNotification(
                title='CrimeWatch',
                body='Identified a person attributed as criminal',
                icon='stock_ticker_update',
                color='#f45342'
            )
        )
        topic = 'crime'
        message = messaging.Message(
            data=data,
            topic=topic,
            android=android
        )
        response = messaging.send(message=message, app=self.app)
        return response




