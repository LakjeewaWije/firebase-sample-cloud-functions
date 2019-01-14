// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

/**
 * Save the message recieved from the client side
 */
exports.sendMessage = functions.https.onCall((data, context) => {
    var newMessage = data;
    var groupId = data.groupId;
    console.log(newMessage);
    var pushKey = admin.database().ref(`/Message/${groupId}`).push();
    newMessage['objectId'] = pushKey.key;
     pushKey.set(newMessage);
    return newMessage;
});

/**
 *  Read the message recieved by the client side
 */
exports.readMessage = functions.https.onCall((data, context) => {
    var samplpeArr = [];
    var readUser = [];
    console.log("lakiya mulin ena eka", data);
    return admin.database().ref('/RecentInfo/' + data.groupId).once("value", snapshot => {
        console.log('Wijeeee mennaaaaaa', snapshot.val());
        return smplArray = snapshot.val();
    })
        .then(arr => {
            arr.forEach(obj => {
                console.log('onna ena object', obj.val().uid, ' data.uid ', data.uid);
                if (data.uid == obj.val().uid) {
                    readUser.push(obj.val());
                    console.log('matched', obj.val(), 'uidddddd', data.uid);
                }
            });

            return readUser;
        })
        .then(userArr => {
            userArr.forEach(path => {
                console.log('these should be updated hahah ' + path.path);
                var ref = admin.database().ref(path.path).child('counter');
                ref.transaction((current) => {
                    return (current || 0) + (-1);
                });
            });

            return 'done';
        })
        .then(_=>{
          return  admin.database().ref(`Message/${data.groupId}/${data.objectId}`).update({'readReciept':true});
            // setValue({'readReciept':true});
        });

});

/**
 * Used to create the recents according the scenerio I needed ( not related to the original code)
 */
exports.createRecent = functions.https.onCall((data, context) => {
    var newMessage = data;
    var pushkey1 = admin.database().ref('/Recent/t1/').push();
    var firstR1 = pushkey1.key;
    console.log('puthe', firstR1);
    var pushkey2 = admin.database().ref('/Recent/t1/').push();
    var firstR2 = pushkey2.key;
    // ---------------------
    // var pushkey3 = admin.database().ref('/Recent/t1/').push();
    // var firstR3 = pushkey3.key;
    // var pushkey4 = admin.database().ref('/Recent/t1/').push();
    // var firstR4 = pushkey4.key;
    // var pushkey5 = admin.database().ref('/Recent/t1/').push();
    // var firstR5 = pushkey5.key;
    // var pushkey6 = admin.database().ref('/Recent/t1/').push();
    // var firstR6 = pushkey6.key;
    var pushkey7 = admin.database().ref('/Recent/t2/').push();
    var firstR7 = pushkey7.key;
    var pushkey8 = admin.database().ref('/Recent/t2/').push();
    var firstR8 = pushkey8.key;
    // ---------------------
    pushkey1.set(data.o1);
    pushkey2.set(data.o2);
    // pushkey3.set(data.o3);
    // pushkey4.set(data.o4);
    // pushkey5.set(data.o5);
    // pushkey6.set(data.o6);
    pushkey7.set(data.o7);
    pushkey8.set(data.o8);
    admin.database().ref('/RecentInfo/g1/0/').set({ path: `Recent/t1/${firstR1}`, uid: 'u1' });
    // admin.database().ref('/RecentInfo/g1/0/uid').set('u1');
    admin.database().ref('/RecentInfo/g1/1/').set({ path: `Recent/t1/${firstR2}`, uid: 'u2' });

    // admin.database().ref('/RecentInfo/g1/2/').set({path:`Recent/t1/${firstR3}`,uid:'u3'});
    // admin.database().ref('/RecentInfo/g1/3/').set({path:`Recent/t1/${firstR4}`,uid:'u4'});
    // admin.database().ref('/RecentInfo/g1/4/').set({path:`Recent/t1/${firstR5}`,uid:'u5'});
    // admin.database().ref('/RecentInfo/g1/5/').set({path:`Recent/t1/${firstR6}`,uid:'u6'});
    admin.database().ref('/RecentInfo/g1/2/').set({ path: `Recent/t2/${firstR7}`, uid: 'u1' });
    admin.database().ref('/RecentInfo/g1/3/').set({ path: `Recent/t2/${firstR8}`, uid: 'u2' });
    // admin.database().ref('/RecentInfo/g1/1/uid').set('u2');

    // var groupId = data.groupId;
    // console.log(newMessage);
    // var pushKey = admin.database().ref(`/Message/${groupId}`).push();
    // newMessage.objectId = pushKey.key;
    // pushKey.set(newMessage);

    // admin.database().ref('/messages').push(newMessage);
    return data;
});

/**
 *  Make the status to  'sent' in a message object  where the current status is 'pending'
 */
exports.updateMessageStatus = functions.https.onCall((data, context) => {
    var groupId = data.groupId;
    var objectId = data.objectId;
  return  admin.database().ref(`/Message/${groupId}/${objectId}/status`).set('Sent');

});

/**
 * Increment the counter when a message is saved with status 'sent'
 */
exports.checkMessage = functions.database.ref('/Message/{groupId}/{pushId}')
    .onCreate((snapshot, context) => {
       
        var smplArray = [];
        // Grab the current value of what was written to the Realtime Database.
        const original = snapshot.val();
        console.log('Uppercasing', original);
    if(original.status == 'sent') {
        return admin.database().ref('/RecentInfo/' + 'g1').once('value').then(arr => {
            console.log('see the array', arr.val());
            smplArray = arr.val()
            return smplArray;

            //   arr.forEach(val=>{
            //     console.log('lakiyaaa'+val);
            //   });
        })
            .then(temparr => {
                var path = [];
                temparr.forEach(obj => {

                    console.log('path ' + obj.path + ' uid ' + obj.uid);
                    if ('u2' != obj.uid) {
                        path.push({ path: obj.path, uid: obj.uid });
                        console.log('took path', path);

                    }
                });
                return path;
            })
            .then(patharray => {
                patharray.forEach(path => {
                    // console.log('these should be updated hahah ' + path.path);
                    var ref = admin.database().ref(path.path).child('counter');
                    ref.transaction((current) => {
                        return (current || 0) + 1;
                    });
                });
            });
        // You must return a Promise when performing asynchronous tasks inside a Functions such as
        // writing to the Firebase Realtime Database.
        // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
        //   return snapshot.ref.parent.child('uppercase').set("Bella");
    }
});




/**
 *  Increment the counter in the relevant recents when the status changed from 'pending'   to 'sent' of a message
 */
exports.checkMessagePending = functions.database.ref('/Message/{groupId}/{pushId}/status')
    .onUpdate((snapshot, context) => {
        var smplArray = [];
        return admin.database().ref('/RecentInfo/' + 'g1').once('value').then(arr => {
            console.log('see the array', arr.val());
            smplArray = arr.val()
            return smplArray;

        })
            .then(temparr => {
                var path = [];
                temparr.forEach(obj => {

                    console.log('path ' + obj.path + ' uid ' + obj.uid);
                    if ('u2' != obj.uid) {
                        path.push({ path: obj.path, uid: obj.uid });
                        console.log('took path', path);

                    }
                });
                return path;
            })
            .then(patharray => {
                patharray.forEach(path => {
                    // console.log('these should be updated hahah ' + path.path);
                    var ref = admin.database().ref(path.path).child('counter');
                    ref.transaction((current) => {
                        return (current || 0) + 1;
                    });
                });
            });
    }
    );