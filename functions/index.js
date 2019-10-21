const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
exports.sendAdminNotification = functions.database.ref('/data').onWrite(( change,context) => {const data= change.after.val();
    if(data.view_count_limit !== 0){
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