const express = require('express');
const app = express();
const FireS = require('./Reminder');
const fetch = require('node-fetch');

const portNumber = process.env.port || process.env.PORT || 1337;

app.listen(portNumber, function () {
  console.log('Example app listening on port '+portNumber);
});


function getScore(taskAccomplished) {
    if (taskAccomplished) {
      mod = 5;
    } else {
      mod = 1;
    }
    return mod;
}

// send message
function callTyntecApi(message) {
  data = "{\"from\":\"MYCompany\", \"to\":\"+4917645987695\", \"message\":\""+ message +"\", \"imChannels\":\"FACEBOOK\"}";
  fetch(
    'https://api.tyntec.com/messaging/mobile-chat/v1',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Add Your tyntec API-Key here
        'apikey': 'YOUR_TYNTEC_API_KEY'
      },
      body: data
    }
  );
}


// handle inbound messsages from facebook and
function handleInboundMessage(phonenumber, UserMessage) {
    // check if user is registered with us

    FireS.getUserbyPhonenummber(phonenumber).then(uid => {
      FireS.getUserData(uid).then(userData => {
          FireS.getTasks(uid).then(tasks => {

            var userName = userData.displayName;

            var toDoString = "";
            var i = 1;
            tasks.forEach(function(task) {
                toDoString += i +". " + task.name + "\\n";
                i++;
            })

            var score = 3;
            var hasNumber = /\d/;

            if ((UserMessage.includes("done") || UserMessage.includes("did")) && hasNumber.test(UserMessage) ){
              // this regex gets the number
              var num = UserMessage.replace(/^\D+/g, "");
              var done = true;
              // update Score
              score = getScore(true);
              //TODO: update Task to done(user, num, done)
              let taskToRemove = tasks[num-1];
              taskToRemove.status = true;

              FireS.updateTask(taskToRemove, uid);

              // send positive reward
              var message = userName + ", that was great!" + taskToRemove.name +" is doooone! 😍";
              callTyntecApi(message);
            }

            if (UserMessage.includes("get")) {
              // send message back
              var message = "Hey "+userName+", here are your ToDos:\\n" + toDoString;
              console.log(message);
              callTyntecApi(message);
            }

            if (UserMessage.includes("add")) {
              // send messages back
              taskName = UserMessage.replace('add','');

              task = {done_till: '2018-09-24', name: taskName}

              FireS.createTask(task, uid);

              var message = "ToDo added! Keep on grinding!";
              console.log(message);
              callTyntecApi(message);
            }

            if (UserMessage.includes("help")) {

              var message = "Hello " + userName +", welcome to ChatToDo! 😃\\n Here is how you can chat with me: \\n Type (get) to let me research and show you your tasks. Include (did) or (done) and a number (like: I did Task #1) and I will register that task as done! You can add a task by writing (add TASK). If you are lost type help."

              callTyntecApi(message);
            }

          })
        })
    });

}

app.get('/', function (req, res) {
  res.send('Fuck off!');
});

app.get('/user/:uid', function (req, res) {
  const userId = req.params.uid;
  FireS.getUserData(userId).then(user => {
    res.send(JSON.stringify(user));
  }).catch(error => {
    console.error(error);
    res.send(error);
  });
});

app.get('/user/:uid/tasks', function (req, res) {
  const userId = req.params.uid;
  FireS.getTasks(userId).then(Tasks => {
    callTyntecApi(Tasks, userId);
    res.send(JSON.stringify(Tasks));
  }).catch(error => console.error(error));
});


// todochat.azurewebsites.net/tyntec/api
// listen for POST messages from tyntec api
app.post('/tyntec/api', function (req, res) {

  req.on("data", function(jsondata){
    jsondata = JSON.parse(jsondata);



   handleInboundMessage(jsondata.from, jsondata.message)
   res.end();
  })
});
