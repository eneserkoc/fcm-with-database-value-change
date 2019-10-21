# fcm-with-database-value-change

This project's implemented in "Sahibinden.com dev.akademi Hackathon 2019". Generalized for public usage and uploaded to GitHub.

This project has 2 parts. First part is this repository(fcm-with-database-value-change) -> Firebase Cloud Messaging with Database Value Changes 

In this part we'll implement a firebase function with NodeJs. 
This function will be triggered to send push notifications to a topic when there is change in data in Firebase Realtime Database values. 


Second part is the mobile app part. In this app we'll implement a example mobile app that we can see the data in database, trigger the Firebase function and receive the push notifications.
You can check that repo from here : https://github.com/eneserkoc/receiving-and-triggering-fcm-push-notifications-android

## Requirements : 

Create your project in firebase console and add realtime database functionality.
We'll need Firebase-CLI to create our cloud function and deploy it to Firebase. You can look at docs if you dont know how to setup Firebase-CLI -> Docs : https://firebase.google.com/docs/functions/get-started

Now go to your Firebase Console and from there go to Firebase Realtime Database section and create a data structure like this(or you can change according to your needs) :
```
{
  "ilan" : {
    "c0" : "İkinci El ve Sıfır Alışveriş",
    "c1" : "Anne & Bebek",
    "c2" : "Ev Tekstili",
    "c3" : "Yatak",
    "city" : "İstanbul",
    "description" : "Mfafqö Dfyfp",
    "has_promotion" : 1,
    "id" : 10,
    "price" : 160,
    "title" : "Dfyfp çnçrj",
    "tmp_view_count" : 5,
    "town" : "Küçükçekmece",
    "view_count" : 4,
    "view_count_limit" : 0
  }
}
```

DONT FORGET the set the rules of your realtime database to "TRUE"
```
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

## Implementation : (Do your changes in index.js file)

What we are trying to do here is when there is change in my data's "view_count" value. I will send push notification to the topic "data". So user devices can listen to this topic to get the push notifications.
```
const functions = require('firebase-functions');
admin.initializeApp(functions.config().firebase);
exports.sendAdminNotification = functions.database.ref('/data').onWrite(( change,context) => {const data= change.after.val();

});
```
This code will trigger the cloud function, when there's a change in "data". You can fill the inner part according to your conditions but in this project we'll check if view_count value is greater than limit_view_count. When the view_count exceeded view_count, we'll send a push notification to topic "data". Also I wanted to check for the limit_view_count is set or not. Default value of this attribute is "0" in realtime database. So we can check if this value is zero or not to get the knowledge of if the value is set or not.


## Code with conditions we want : 
```
const functions = require('firebase-functions');
exports.sendAdminNotification = functions.database.ref('/data').onWrite(( change,context) => {const data= change.after.val();
    if(data.view_count_limit != 0){
        if(data.view_count > data.view_count_limit){
             const payload = {notification: {
                 title: 'View Count',
                 body: `${data.view_count}`
                 }  
             };return admin.messaging().sendToTopic("data",payload)
            .then(function(response){
                 console.log('Notification sent successfully:',response);
                 return null;
            }) 
            .catch(function(error){
                 console.log('Notification sent failed:',error);
            });
        }
    }
});
```
To send these notifications, we also need firebase admin requirements and initialize the app as admin. 

If you havent installed firebase-admin 

```
npm install firebase-admin
```

Also we need the add these parts to our code.
```
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
```
Now we need to deploy our function to firebase. In terminal type "firebase deploy" in project folder.

We finished the "firebase-functions" part of project.Now we'll implement app part... You can see it from here : https://github.com/eneserkoc/receiving-and-triggering-fcm-push-notifications-android

