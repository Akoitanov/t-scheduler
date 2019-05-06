// This is where all the javascript will
 // live for the project that connects the view and model

// controller object


    // capture all the fields in the form area
    let captureFormFields = () => {
        $('body').on("click", ".button-add", () => {
            // prevent form from submitting
             event.preventDefault();

             // variables from the form field values
            trainNumber = $('#train-number').val().trim();
            trainLine = $('#train-line').val().trim();
            trainDestination = $('#train-destination').val().trim();
            trainDeparture = $('#train-departure').val().trim();
            trainFrequency = $('#train-frequency').val().trim();
            trainPlatform = $('#train-platform').val().trim();
          

            var TrainData = {
                trainNumber: trainNumber,
                trainLine: trainLine,
                trainDestination: trainDestination,
                trainDeparture: trainDeparture,
                trainFrequency: trainFrequency,
                trainPlatform: trainPlatform
            };
            // console log all the entries for testing
            // console.log(trainNumber)
            // console.log(trainLine)
            // console.log(trainDestination)
            // console.log(trainDeparture)
            // console.log(trainFrequency)
            // console.log(trainPlatform)
            nextArrival();
            minutesAway();

            // clear all the fields in the form
            $('.form-control').val("");

            database.ref().push(Train);
            // view.updateTrainScheduleTable();

        });
    }

    // Time Calculation functions 

    let nextArrival = () => {
       // First Time (pushed back 1 year to make sure it comes before current time)
       var trainDepartureCoverted = moment(trainDeparture, "hh:mm").subtract(1, 'years');
       // get Current Time
       var currentTime = moment();
       //difference between the times
       var diffTime = moment().diff(moment(trainDepartureCoverted), "minutes");
       // Time apart (remainder)
       var timeRemainder = diffTime % trainFrequency;
       //minutes until Train
       var timeInMinutesTillTrain = trainFrequency - timeRemainder;
       //Next Train
       nextTrain = moment().add(timeInMinutesTillTrain, 'minutes');
       nextTrain = moment(nextTrain).format('h:mm A');
   }

   let minutesAway = () => {
       // First Time (pushed back 1 year to make sure it comes before current time)
       var trainDepartureCoverted = moment(trainDeparture, "hh:mm").subtract(1, 'years');
       //Current Time
       var currentTime = moment();
       //difference between the times
       var diffTime = moment().diff(moment(trainDepartureCoverted), "minutes");
       // Time apart (remainder)
       var timeRemainder = diffTime % trainFrequency;
       //minutes until Train
       minutesAway = trainFrequency - timeRemainder;
       minutesAway = moment().startOf('day').add(minutesAway, 'minutes').format('HH:mm');
       return moment(minutesAway).format('HH:mm');
   }
   let convertFrequency = () => {
       trainFrequency = moment().startOf('day').add(trainFrequency, 'minutes').format('HH:mm');
   }




// This is where all the data and global variables will 
 // live for the project

 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyDU4EQl-IWVbWOa9Ytle5qrU0wzAWAsSp8",
    authDomain: "train-scheduler-be206.firebaseapp.com",
    databaseURL: "https://train-scheduler-be206.firebaseio.com",
    projectId: "train-scheduler-be206",
    storageBucket: "train-scheduler-be206.appspot.com",
    messagingSenderId: "724992699168"
  };
  
    firebase.initializeApp(config);
    var database = firebase.database();
    // Form Variables to be passed between objects
    var trainNumber;
    var trainLine;
    var trainDestination;
    var trainDeparture;
    var nextTrain;
   
    var trainFrequency;
    var trainTiming;
    var trainPlatform;
    var currentTime = moment();
    console.log('CURRENT TIME: ' + moment(currentTime).format('hh:mm:ss A'));
    
    // model object with functions for pulling/pushing new data to the database
    
    
    
            
        let initialDatabasePull = () => {
    
            database.ref().on("value", function(snapshot) {
                    var trains = snapshot.val();
    
                    //console.log(trains);
    
                    $('#train-schedule-body').empty();
    
                    for (var index in trains){
                        trainNumber = trains[index].trainNumber
                        trainLine = trains[index].trainLine
                        trainDestination = trains[index].trainDestination
                        trainDeparture = trains[index].trainDeparture
                        trainFrequency = trains[index].trainFrequency
                        trainPlatform = trains[index].trainPlatform
    
                        //console.log(trainNumber, trainLine, trainDestination, trainDeparture, trainFrequency, trainPlatform)
                        nextArrival();
                        minutesAway();
                        view.updateTrainScheduleTable();
                    };
    
            }, function(errorObject) {
                  console.log("Errors handled: " + errorObject.code);
    
            });
        }
    
    


    // This is where most of the JS & jQuery will live
 // for the project that will manipulate our webpage

 // On Page Load
$(document).ready(function(){

	captureFormFields();
	initialDatabasePull();
	setInterval(function() {initialDatabasePull()}, 60000);
	view.updateCurrentTime();
	setInterval(function() {view.updateCurrentTime()}, 1000);

});

// view object
var view = {

	// function to update the Train Schedule Table

	updateTrainScheduleTable: () => {

		convertFrequency();

		$('#train-schedule-body').append(
			'<tr>'+
				'<th scope="row">' + trainNumber + '</th>' +
				'<td>' + trainLine + '</td>' +
				'<td>' + trainDestination + '</td>' +
				'<td>' + nextTrain + '</td>' +
				'<td>' + minutesAway + '</td>' +
				'<td>' + trainFrequency + '</td>' +
				'<td>' + trainPlatform + '</td>' +
			'</tr>'
			);
	},
	updateCurrentTime: () => {
		$('.currentTime').text(moment().format('h:mm:ss A'))
	}
};
