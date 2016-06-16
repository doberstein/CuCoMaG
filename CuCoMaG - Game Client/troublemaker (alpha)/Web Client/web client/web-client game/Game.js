/**
author: doberstein
author: Huangpan
 */

var TroubleMaker = false;
var LName;
var Score = 0;
var SessionID;
var Phase = 0;
var answerQuality = -1;
var PlayerName = "StartPlayerName";
var PartnerName = "";
var ID = 1;
var SentenceOPer = "";
var WelcomeDone = false;
var SentenceOpenerAnfang = "";
var Warten = true;
var feedbackcounter;
var Phase2 = "nein";
var Phase3 = "nein";
var Phase4 = "nein";
var verlassen = "nein";
var spielstartwarten = "nein";

var introductionScreenCounter = 1;
var messagetime_start = 0;
var messagetime_end = 0;
var playerinput = "";
var firstcounter = 1;
var allInfoGiven = false;   // for that state, when the user has to check thon info (name,ordernumber,postcode)
                            // true if the bot gave all info

var a = "";                 // used to distinguish at which point of the chat the player is
                            // to be able to find chosen sentenceopeners and next sentence opener choices

function gameover() {
    document.getElementById('hints_textarea').style.display = 'none';
    document.getElementById('checkNameInput').style.display = 'none';
    document.getElementById('checkName').style.display = 'none';
    document.getElementById('checkOrdernumberInput').style.display = 'none';
    document.getElementById('checkOrdernumber').style.display = 'none';
    document.getElementById('checkPostcodeInput').style.display = 'none';
    document.getElementById('checkPostcode').style.display = 'none';
    document.getElementById('checkDeliveryInput').style.display = 'none';

    document.getElementById('checkDelivery').style.display = 'none';
    document.getElementById('userinfo_textarea').style.display = 'none';
    document.getElementById('found_customerinfo').style.display = 'none';
    document.getElementById('chatform').style.display = 'none';
    document.getElementById('chatsenden').style.display = 'none';

    document.getElementById('SentenceOpenerA1a').style.display = 'none';
    document.getElementById('SentenceOpenerA11a').style.display = 'none';
    document.getElementById('SentenceOpenerA11b').style.display = 'none';
    document.getElementById('SentenceOpenerA1b').style.display = 'none';
    document.getElementById('SentenceOpenerA1c').style.display = 'none';
    document.getElementById('SentenceOpenerA1d').style.display = 'none';
    document.getElementById('SentenceOpenerA2').style.display = 'none';
    document.getElementById('SentenceOpenerA2b').style.display = 'none';
    document.getElementById('SentenceOpenerA3').style.display = 'none';
    document.getElementById('SentenceOpenerA4a').style.display = 'none';
    document.getElementById('SentenceOpenerA4b').style.display = 'none';
    document.getElementById('SentenceOpenerA5').style.display = 'none';
    document.getElementById('SentenceOpenerA6').style.display = 'none';
    //document.getElementById('SentenceOpenerA7a').style.display = 'none';
    //document.getElementById('SentenceOpenerA7b').style.display = 'none';
    document.getElementById('SentenceOpenerA7c').style.display = 'none';
    document.getElementById('SentenceOpenerA7d').style.display = 'none';
    document.getElementById('SentenceOpenerA7e').style.display = 'none';

    document.getElementById('gamescreenend').style.display = 'none';

    a = "8";

    ID++;
    

    space.write(

        // for the endgame tuple: SentenceOPer="Player left the conversation.", text="", answerQuality=6 (player quit before end of conversation)
        new TS.Tuple([PlayerName, "Player left the conversation.", "", SessionID, 6, ID]), //tuple
        function (id) { //callback, if tuple was successfully written
        }
    );
}

function gamecomplete_silence() {
    document.getElementById('hints_textarea').style.display = 'none';
    document.getElementById('checkNameInput').style.display = 'none';
    document.getElementById('checkName').style.display = 'none';
    document.getElementById('checkOrdernumberInput').style.display = 'none';
    document.getElementById('checkOrdernumber').style.display = 'none';
    document.getElementById('checkPostcodeInput').style.display = 'none';
    document.getElementById('checkPostcode').style.display = 'none';
    document.getElementById('checkDeliveryInput').style.display = 'none';

    document.getElementById('checkDelivery').style.display = 'none';
    document.getElementById('userinfo_textarea').style.display = 'none';
    document.getElementById('found_customerinfo').style.display = 'none';
    document.getElementById('chatform').style.display = 'none';
    document.getElementById('chatsenden').style.display = 'none';

    document.getElementById('SentenceOpenerA1a').style.display = 'none';
    document.getElementById('SentenceOpenerA11a').style.display = 'none';
    document.getElementById('SentenceOpenerA11b').style.display = 'none';
    document.getElementById('SentenceOpenerA1b').style.display = 'none';
    document.getElementById('SentenceOpenerA1c').style.display = 'none';
    document.getElementById('SentenceOpenerA1d').style.display = 'none';
    document.getElementById('SentenceOpenerA2').style.display = 'none';
    document.getElementById('SentenceOpenerA2b').style.display = 'none';
    document.getElementById('SentenceOpenerA3').style.display = 'none';
    document.getElementById('SentenceOpenerA4a').style.display = 'none';
    document.getElementById('SentenceOpenerA4b').style.display = 'none';
    document.getElementById('SentenceOpenerA5').style.display = 'none';
    document.getElementById('SentenceOpenerA6').style.display = 'none';
    //document.getElementById('SentenceOpenerA7a').style.display = 'none';
    //document.getElementById('SentenceOpenerA7b').style.display = 'none';
    document.getElementById('SentenceOpenerA7c').style.display = 'none';
    document.getElementById('SentenceOpenerA7d').style.display = 'none';
    document.getElementById('SentenceOpenerA7e').style.display = 'none';

    document.getElementById('gamescreenend').style.display = 'none';
}

function gamecomplete() {

    document.getElementById('hints_textarea').style.display = 'none';
    document.getElementById('checkNameInput').style.display = 'none';
    document.getElementById('checkName').style.display = 'none';
    document.getElementById('checkOrdernumberInput').style.display = 'none';
    document.getElementById('checkOrdernumber').style.display = 'none';
    document.getElementById('checkPostcodeInput').style.display = 'none';
    document.getElementById('checkPostcode').style.display = 'none';
    document.getElementById('checkDeliveryInput').style.display = 'none';

    document.getElementById('checkDelivery').style.display = 'none';
    document.getElementById('userinfo_textarea').style.display = 'none';
    document.getElementById('found_customerinfo').style.display = 'none';
    document.getElementById('chatform').style.display = 'none';
    document.getElementById('chatsenden').style.display = 'none';

    document.getElementById('SentenceOpenerA1a').style.display = 'none';
    document.getElementById('SentenceOpenerA11a').style.display = 'none';
    document.getElementById('SentenceOpenerA11b').style.display = 'none';
    document.getElementById('SentenceOpenerA1b').style.display = 'none';
    document.getElementById('SentenceOpenerA1c').style.display = 'none';
    document.getElementById('SentenceOpenerA1d').style.display = 'none';
    document.getElementById('SentenceOpenerA2').style.display = 'none';
    document.getElementById('SentenceOpenerA2b').style.display = 'none';
    document.getElementById('SentenceOpenerA3').style.display = 'none';
    document.getElementById('SentenceOpenerA4a').style.display = 'none';
    document.getElementById('SentenceOpenerA4b').style.display = 'none';
    document.getElementById('SentenceOpenerA5').style.display = 'none';
    document.getElementById('SentenceOpenerA6').style.display = 'none';
    //document.getElementById('SentenceOpenerA7a').style.display = 'none';
    //document.getElementById('SentenceOpenerA7b').style.display = 'none';
    document.getElementById('SentenceOpenerA7c').style.display = 'none';
    document.getElementById('SentenceOpenerA7d').style.display = 'none';
    document.getElementById('SentenceOpenerA7e').style.display = 'none';

    document.getElementById('gamescreenend').style.display = 'none';
}

function checkdelivery() {
    var text = "" + document.getElementById('checkDeliveryInput').value;
    if (text == "54321") {
        document.getElementById('hints_textarea').style.display = 'none';
        document.getElementById('SentenceOpenerA5').style.display = 'inherit';
        alert("The package has already been delivered. The box and shoes are in good state.")
        a = "5";

        document.getElementById('chatsenden').style.display = 'inherit';

        // delete sentenceopeners if parts of the conversation were skipped
        document.getElementById('SentenceOpenerA1a').style.display = 'none';
        document.getElementById('SentenceOpenerA11b').style.display = 'none';
        document.getElementById('SentenceOpenerA11a').style.display = 'none';
        document.getElementById('SentenceOpenerA1b').style.display = 'none';
        document.getElementById('SentenceOpenerA1c').style.display = 'none';
        document.getElementById('SentenceOpenerA1d').style.display = 'none';
        document.getElementById('SentenceOpenerA2').style.display = 'none';
        document.getElementById('SentenceOpenerA2b').style.display = 'none';
        document.getElementById('SentenceOpenerA3').style.display = 'none';

        document.getElementById('checkDelivery').style.display = 'none';
        document.getElementById('checkDeliveryInput').style.display = 'none';

    } else {
        document.getElementById('userinfo_textarea').value = 'Delivery not found. Please check if the input is correct.';
        document.getElementById('userinfo_textarea').style.display = 'inherit';
    }
}

function foundcustomerinfo() {

    var customer_info = "\n\nCustomerinfo:\n\nName:\nCharlie\nPostcode: 12345\nOrdernumber:\nEA12345\nDeliverynumber:\n54321";
    answerQuality = 1;

    // delete sentenceopeners if parts of the conversation were skipped
    document.getElementById('SentenceOpenerA1a').style.display = 'none';
    document.getElementById('SentenceOpenerA11b').style.display = 'none';
    document.getElementById('SentenceOpenerA11a').style.display = 'none';
    document.getElementById('SentenceOpenerA1b').style.display = 'none';
    document.getElementById('SentenceOpenerA1c').style.display = 'none';
    document.getElementById('SentenceOpenerA1d').style.display = 'none';
    document.getElementById('SentenceOpenerA2').style.display = 'none';
    document.getElementById('SentenceOpenerA2b').style.display = 'none';
    document.getElementById('SentenceOpenerA3').style.display = 'none';
    document.getElementById('SentenceOpenerA4a').style.display = 'none';
    document.getElementById('SentenceOpenerA4b').style.display = 'none';

    messagetime_end = performance.now();

    var message_time = messagetime_end - messagetime_start;

    var time_in_milisec = parseInt(message_time, 10);


    ID++;

    // send userinput to backend
    space.write(
        new TS.Tuple([PlayerName, customer_info, "", SessionID, answerQuality, ID]), //tuple
        function (id) { //callback, if tuple was successfully written
        }
    );

    // for the message time calculation
    space.write(
        new TS.Tuple([PlayerName, SessionID, ID, "MessageTimeAnalysis", time_in_milisec]), //tuple
        function (id) { //callback, if tuple was successfully written
        }
    );

    // set the state of the conversation
    a = "4";
}

function checkname() {

    var text = "" + document.getElementById('checkNameInput').value;
    var name = "Charlie";
    var name2 = "charlie";
    var name_found = false;
    if (text == name || text == name2) {
        name_found = true;
    }

    if (allInfoGiven && name_found) {
        document.getElementById('userinfo_textarea').value = 'There are multiple customers with this name. Please type in the unique ordernumber.';
        document.getElementById('userinfo_textarea').style.display = 'inherit';

        // delete sentenceopeners if parts of the conversation were skipped
        document.getElementById('SentenceOpenerA1a').style.display = 'none';
        document.getElementById('SentenceOpenerA11b').style.display = 'none';
        document.getElementById('SentenceOpenerA11a').style.display = 'none';
        document.getElementById('SentenceOpenerA1b').style.display = 'none';
        document.getElementById('SentenceOpenerA1c').style.display = 'none';
        document.getElementById('SentenceOpenerA1d').style.display = 'none';
        document.getElementById('SentenceOpenerA2').style.display = 'none';
        document.getElementById('SentenceOpenerA2b').style.display = 'none';
        document.getElementById('SentenceOpenerA3').style.display = 'none';
    }
    else if (name_found) {
        document.getElementById('userinfo_textarea').value = 'There are multiple customers with this name. Please type in the unique ordernumber';
        document.getElementById('userinfo_textarea').style.display = 'inherit';
        document.getElementById('SentenceOpenerA4a').style.display = 'inherit';
        document.getElementById('chatsenden').style.display = 'inherit';

        // delete sentenceopeners if parts of the conversation were skipped
        document.getElementById('SentenceOpenerA1a').style.display = 'none';
        document.getElementById('SentenceOpenerA11b').style.display = 'none';
        document.getElementById('SentenceOpenerA11a').style.display = 'none';
        document.getElementById('SentenceOpenerA1b').style.display = 'none';
        document.getElementById('SentenceOpenerA1c').style.display = 'none';
        document.getElementById('SentenceOpenerA1d').style.display = 'none';
        document.getElementById('SentenceOpenerA2').style.display = 'none';
        document.getElementById('SentenceOpenerA2b').style.display = 'none';
        document.getElementById('SentenceOpenerA3').style.display = 'none';

    } else {
        document.getElementById('userinfo_textarea').value = 'User not found. Please check if the input is correct.';
        document.getElementById('userinfo_textarea').style.display = 'inherit';
    }
}

function checkpostcode() {
    var text = "" + document.getElementById('checkPostcodeInput').value;
    if (allInfoGiven && text == "12345") {
        document.getElementById('userinfo_textarea').value = 'There are multiple customers with this postcode. Please type in the unique ordernumber';
        document.getElementById('userinfo_textarea').style.display = 'inherit';

        // delete sentenceopeners if parts of the conversation were skipped
        document.getElementById('SentenceOpenerA1a').style.display = 'none';
        document.getElementById('SentenceOpenerA11b').style.display = 'none';
        document.getElementById('SentenceOpenerA11a').style.display = 'none';
        document.getElementById('SentenceOpenerA1b').style.display = 'none';
        document.getElementById('SentenceOpenerA1c').style.display = 'none';
        document.getElementById('SentenceOpenerA1d').style.display = 'none';
        document.getElementById('SentenceOpenerA2').style.display = 'none';
        document.getElementById('SentenceOpenerA2b').style.display = 'none';
        document.getElementById('SentenceOpenerA3').style.display = 'none';
    }
    else if (text == "12345") {
        document.getElementById('userinfo_textarea').value = 'There are multiple customers with this postcode. Please type in the unique ordernumber';
        document.getElementById('SentenceOpenerA4b').style.display = 'inherit';
        document.getElementById('chatsenden').style.display = 'inherit';
        document.getElementById('userinfo_textarea').style.display = 'inherit';

        // delete sentenceopeners if parts of the conversation were skipped
        document.getElementById('SentenceOpenerA1a').style.display = 'none';
        document.getElementById('SentenceOpenerA11b').style.display = 'none';
        document.getElementById('SentenceOpenerA11a').style.display = 'none';
        document.getElementById('SentenceOpenerA1b').style.display = 'none';
        document.getElementById('SentenceOpenerA1c').style.display = 'none';
        document.getElementById('SentenceOpenerA1d').style.display = 'none';
        document.getElementById('SentenceOpenerA2').style.display = 'none';
        document.getElementById('SentenceOpenerA2b').style.display = 'none';
        document.getElementById('SentenceOpenerA3').style.display = 'none';

    } else {
        document.getElementById('userinfo_textarea').value = 'User not found. Please check if the input is correct.';
        document.getElementById('userinfo_textarea').style.display = 'inherit';
    }
}

function checkordernumber() {
    var text = "" + document.getElementById('checkOrdernumberInput').value;

    if (text == "EA12345") {

        document.getElementById('userinfo_textarea').value = '\Customerinfo:\nName:\nCharlie\nPostcode: 12345\nOrdernumber:\nEA12345\nDelivery-\nnumber:\n54321';
        document.getElementById('userinfo_textarea').style.display = 'inherit';
        document.getElementById('found_customerinfo').style.display = 'inherit';


    } else {
        document.getElementById('userinfo_textarea').value = 'Order not found. Please check if the input is correct.';
        document.getElementById('userinfo_textarea').style.display = 'inherit';
    }

}


function chattextsenden() {
    
    messagetime_end = performance.now();

    var message_time = messagetime_end - messagetime_start;

    var time_in_milisec = parseInt(message_time, 10);

    document.getElementById('chatsenden').disabled = true;  // to stop doubleclick and sending the same message again

    disableSentenceOpeners();

    answerQuality = -1;

    var text = " " + document.getElementById('chatform').value;

    playerinput = text.substring(1);

    document.getElementById('chatform').value = "";


    if (SentenceOPer == "") {


        alert("Please select a sentence opener.");
        document.getElementById('chatsenden').disabled = false; // enable button again
        enableSentenceOpeners();
    } else {

        // 1a
        if (SentenceOPer == "How can I help you") {
            answerQuality = 0;
        } else if (SentenceOPer == "Hi, my name is") {
            answerQuality = 2;
        } else if (SentenceOPer == "Hello, my name is") {
            answerQuality = 2;
        }

        // 11a
        if (SentenceOPer == "Yes that was my second name and Jamie is my first name so how can I help you") {
            answerQuality = 2;
        } else if (SentenceOPer == "My name does not matter anyway so how can I help you") {
            answerQuality = 0;
        }

        // 11b
        if (SentenceOPer == "Hi, my name is") {
            answerQuality = 2;
        } else if (SentenceOPer == "Hello, my name is") {
            answerQuality = 2;
        } else if (SentenceOPer == "My name is") {
            answerQuality = 1;
        }

        // 1b
        if (SentenceOPer == "What is that") {
            answerQuality = 2;
        } else if (SentenceOPer == "I am so sorry about that") {
            answerQuality = 1;
        } else if (SentenceOPer == "I do not understand what you mean") {
            answerQuality = 0;
        }

        // 1c
        if (SentenceOPer == "What quality problem do you have") {
            answerQuality = 2;
        } else if (SentenceOPer == "Just tell me the problem") {
            answerQuality = 1;
        } else if (SentenceOPer == "What do you mean by that") {
            answerQuality = 0;
        }

        // 1d
        if (SentenceOPer == "Are the shoes OK") {
            answerQuality = 2;
        } else if (SentenceOPer == "I think it is not a quality problem") {
            answerQuality = 1;
        } else if (SentenceOPer == "It is not a big deal") {
            answerQuality = 0;
        }

        // 2
        if (SentenceOPer == "Is that true") {
            answerQuality = 0;
        } else if (SentenceOPer == "Can you prove that") {
            answerQuality = 1;
        } else if (SentenceOPer == "Can you send me a picture of the shoes") {
            answerQuality = 2;
        }

        // 2b
        if (SentenceOPer == "OK please give me some order information") {
            answerQuality = 2;
        } else if (SentenceOPer == "Just give me the information") {
            answerQuality = 1;
        } else if (SentenceOPer == "You can not prove anything") {
            answerQuality = 0;
        }

        // 3
        if (a == "3") {
            answerQuality = 2;
        }    

        // 4a
        if (SentenceOPer == "Now give me your ordernumber") {
            answerQuality = 0;
        } else if (SentenceOPer == "I also need your ordernumber") {
            answerQuality = 1;
        } else if (SentenceOPer == "There are multiple customers with your name so please give me your ordernumber") {
            answerQuality = 2;
        }

        // 4b
        if (SentenceOPer == "Now give me your ordernumber") {
            answerQuality = 0;
        } else if (SentenceOPer == "I also need your ordernumber") {
            answerQuality = 1;
        } else if (SentenceOPer == "There are multiple customers with your postcode so please give me your ordernumber") {
            answerQuality = 2;
        }

        // 4
        // handled in foundcustomerinfo()

        // 5
        if (SentenceOPer == "I just want to make sure the order information is right") {
            answerQuality = 1;
        } else if (SentenceOPer == "Do not be so impatient") {
            answerQuality = 2;
        } else if (SentenceOPer == "The website said that the package has already been delivered without any problem") {
            answerQuality = 0;
        }

        // 6
        if (SentenceOPer == "I am sorry to hear that but there is nothing I can do since it is not a quality problem with shoes") {
            answerQuality = 0;
        } else if (SentenceOPer == "I am sorry to hear that and I will try to contact with my manager to see how to solve this problem") {
            answerQuality = 1;
        } else if (SentenceOPer == "I am really sorry to hear that but can I offer you") {
            answerQuality = 2;
        }

        // 7a
        //if (SentenceOPer == "I will do that right away, sorry for your inconvenience") {
        //    answerQuality = 4;
        //} else if (SentenceOPer == "I am sorry but I can not do that") {
        //    answerQuality = 5;
        //}

        // 7b
        //if (SentenceOPer == "Ok, thank you for contacting us and goodbye") {
        //    answerQuality = 3;
        //} else if (SentenceOPer == "I will arrange that") {
        //    answerQuality = 3;
        //} else if (SentenceOPer == "I will try to arrange that as soon as I have the time") {
        //    answerQuality = 4;
        //}

        // 7c
        if (SentenceOPer == "I am sorry but I can not do that") {
            answerQuality = 3;
        } else if (SentenceOPer == "I will arrange that immediately") {
            answerQuality = 5;
        } else if (SentenceOPer == "I must talk to my manager about that") {
            answerQuality = 4;
        }

        // 7d
        if (SentenceOPer == "Ok, thank you for contacting us and goodbye") {
            answerQuality = 3;
        } else if (SentenceOPer == "I will arrange that immediately") {
            answerQuality = 5;
        } else if (SentenceOPer == "I will try to arrange that as soon as I have time") {
            answerQuality = 4;
        }

        // 7e
        if (a == "7e") {
            answerQuality = 2;
        }

        // deselect the sentence openers in case browser saves selection
        deselectSentenceOpeners();


        if (answerQuality == -1) {
            alert("answerQuality = -1; value not correct")
        }


        ID++;

        // send data to backend
        space.write(
            new TS.Tuple([PlayerName, SentenceOPer, text, SessionID, answerQuality, ID]), //tuple
            function (id) { //callback, if tuple was successfully written
            }
        );

        // for the message time calculation
        space.write(
            new TS.Tuple([PlayerName, SessionID, ID, "MessageTimeAnalysis", time_in_milisec]), //tuple
            function (id) { //callback, if tuple was successfully written
            }
        );
    }
}

// deselect all sentence openers
function deselectSentenceOpeners() {
    var elements = document.getElementById("SentenceOpenerA1a").options;
    for (var i = 0; i < elements.length; i++) {
        elements[i].selected = false;
    }
    var elements = document.getElementById("SentenceOpenerA11b").options;
    for (var i = 0; i < elements.length; i++) {
        elements[i].selected = false;
    }
    var elements = document.getElementById("SentenceOpenerA11a").options;
    for (var i = 0; i < elements.length; i++) {
        elements[i].selected = false;
    }
    var elements = document.getElementById("SentenceOpenerA1b").options;
    for (var i = 0; i < elements.length; i++) {
        elements[i].selected = false;
    }
    var elements = document.getElementById("SentenceOpenerA1c").options;
    for (var i = 0; i < elements.length; i++) {
        elements[i].selected = false;
    }
    var elements = document.getElementById("SentenceOpenerA1d").options;
    for (var i = 0; i < elements.length; i++) {
        elements[i].selected = false;
    }
    var elements = document.getElementById("SentenceOpenerA2").options;
    for (var i = 0; i < elements.length; i++) {
        elements[i].selected = false;
    }
    var elements = document.getElementById("SentenceOpenerA2b").options;
    for (var i = 0; i < elements.length; i++) {
        elements[i].selected = false;
    }
    var elements = document.getElementById("SentenceOpenerA3").options;
    for (var i = 0; i < elements.length; i++) {
        elements[i].selected = false;
    }
    var elements = document.getElementById("SentenceOpenerA4a").options;
    for (var i = 0; i < elements.length; i++) {
        elements[i].selected = false;
    }
    var elements = document.getElementById("SentenceOpenerA4b").options;
    for (var i = 0; i < elements.length; i++) {
        elements[i].selected = false;
    }
    var elements = document.getElementById("SentenceOpenerA5").options;
    for (var i = 0; i < elements.length; i++) {
        elements[i].selected = false;
    }
    var elements = document.getElementById("SentenceOpenerA6").options;
    for (var i = 0; i < elements.length; i++) {
        elements[i].selected = false;
    }
    //var elements = document.getElementById("SentenceOpenerA7a").options;
    //for (var i = 0; i < elements.length; i++) {
    //    elements[i].selected = false;
    //}
    //var elements = document.getElementById("SentenceOpenerA7b").options;
    //for (var i = 0; i < elements.length; i++) {
    //    elements[i].selected = false;
    //}
    var elements = document.getElementById("SentenceOpenerA7c").options;
    for (var i = 0; i < elements.length; i++) {
        elements[i].selected = false;
    }
    var elements = document.getElementById("SentenceOpenerA7d").options;
    for (var i = 0; i < elements.length; i++) {
        elements[i].selected = false;
    }
    var elements = document.getElementById("SentenceOpenerA7e").options;
    for (var i = 0; i < elements.length; i++) {
        elements[i].selected = false;
    }
}

function enableSentenceOpeners() {
    document.getElementById('SentenceOpenerA1a').disabled = false;
    document.getElementById('SentenceOpenerA11b').disabled = false;
    document.getElementById('SentenceOpenerA11a').disabled = false;
    document.getElementById('SentenceOpenerA1b').disabled = false;
    document.getElementById('SentenceOpenerA1c').disabled = false;
    document.getElementById('SentenceOpenerA1d').disabled = false;
    document.getElementById('SentenceOpenerA2').disabled = false;
    document.getElementById('SentenceOpenerA2b').disabled = false;
    document.getElementById('SentenceOpenerA3').disabled = false;
    document.getElementById('SentenceOpenerA4a').disabled = false;
    document.getElementById('SentenceOpenerA4b').disabled = false;
    document.getElementById('SentenceOpenerA5').disabled = false;
    document.getElementById('SentenceOpenerA6').disabled = false;
    //document.getElementById('SentenceOpenerA7a').disabled = false;
    //document.getElementById('SentenceOpenerA7b').disabled = false;
    document.getElementById('SentenceOpenerA7c').disabled = false;
    document.getElementById('SentenceOpenerA7d').disabled = false;
    document.getElementById('SentenceOpenerA7e').disabled = false;
}

function disableSentenceOpeners() {
    document.getElementById('SentenceOpenerA1a').disabled = true;
    document.getElementById('SentenceOpenerA11b').disabled = true;
    document.getElementById('SentenceOpenerA11a').disabled = true;
    document.getElementById('SentenceOpenerA1b').disabled = true;
    document.getElementById('SentenceOpenerA1c').disabled = true;
    document.getElementById('SentenceOpenerA1d').disabled = true;
    document.getElementById('SentenceOpenerA2').disabled = true;
    document.getElementById('SentenceOpenerA2b').disabled = true;
    document.getElementById('SentenceOpenerA3').disabled = true;
    document.getElementById('SentenceOpenerA4a').disabled = true;
    document.getElementById('SentenceOpenerA4b').disabled = true;
    document.getElementById('SentenceOpenerA5').disabled = true;
    document.getElementById('SentenceOpenerA6').disabled = true;
    //document.getElementById('SentenceOpenerA7a').disabled = true;
    //document.getElementById('SentenceOpenerA7b').disabled = true;
    document.getElementById('SentenceOpenerA7c').disabled = true;
    document.getElementById('SentenceOpenerA7d').disabled = true;
    document.getElementById('SentenceOpenerA7e').disabled = true;
}

function chatfunction() {


    //define template for callback
    var t1 = new TS.Field('formal', 'string');
    var t2 = new TS.Field('formal', 'string');
    var t3 = new TS.Field('formal', 'string');
    var t4 = new TS.Field('actual', 'integer', SessionID);
    var t5 = new TS.Field('formal', 'integer');
    var t6 = new TS.Field('formal', 'integer');
    var t7 = new TS.Field('formal', 'integer');
    var t8 = new TS.Field('formal', 'boolean');
    var t9 = new TS.Field('formal', 'integer');
    var t10 = new TS.Field('formal', 'boolean');
    var t11 = new TS.Field('formal', 'integer');
    var t12 = new TS.Field('formal', 'string');
    var t13 = new TS.Field('formal', 'string');
    var t14 = new TS.Field('formal', 'integer');

    var template = new TS.Tuple([t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13]);

    //register event
    space.eventRegister(
        'write', //The command for the event (write, delete, update, all)
        template,  // The tuple template
        function (result) { // The function to be called if an registered event occurs, receives some properties plus the tuples as before and after attributes
            //get info from result tuple

            // for the message time
            messagetime_start = performance.now();


            var f0 = result.after.tuple.getField(1).getValue();
            var f1 = result.after.tuple.getField(2).getValue();

            var f2 = result.after.tuple.getField(12).getValue();

            var f3 = result.after.tuple.getField(0).getValue();

            document.getElementById('chatsenden').disabled = false; // enable button again

            enableSentenceOpeners();

            var rudeness = result.after.tuple.getField(7).getValue();
            var aggression = result.after.tuple.getField(9).getValue();
            var silence_trigger = false;


            // write the bot answer into the chat 
            document.getElementById('chatfenster').value = document.getElementById('chatfenster').value + "\nCustomer" + ": " + f2 + "\n";

            document.getElementById('chatfenster').scrollTop = document.getElementById('chatfenster').scrollHeight;

            var text = "" + document.getElementById('chatform').value;
            //playerinput = text.substring(1);
            //playerinput = text;
            // alert("playerinput = ." + document.getElementById('chatform').value + ".");
            playerinput = result.after.tuple.getField(2).getValue();
            if (a != "1a") {
                //alert("a= " + a + "\nSentenceOper = ." + SentenceOPer + ".\nplayerinput = ." + playerinput + ".");
            }
            //alert("a= " + a + "\nSentenceOper = ." + SentenceOPer + ".\nplayerinput = ." + playerinput + ".");

            // check if the message comes from a silence trigger
            if (playerinput.indexOf("Silence") > -1) {
                silence_trigger = true;
                deselectSentenceOpeners();
                ID++; // inc ID because silence trigger wrote a message 
            }

            if (playerinput == "Silence4") {
                gamecomplete_silence();
            }
            else if (!rudeness && !silence_trigger && !aggression) {

                switch (a) {

                    case "1a":

                        // unselect all 
                        var elements = document.getElementById("SentenceOpenerA1a").options;
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].selected = false;
                        }

                        if (WelcomeDone == false) {

                            var jamie_found = false;

                            if (playerinput.toLowerCase().indexOf("jamie") > -1) {
                                jamie_found = true;
                            }

                            if (SentenceOPer == "Hi, my name is" && playerinput == "") {
                                document.getElementById('SentenceOpenerA1a').style.display = 'none';
                                document.getElementById('SentenceOpenerA11b').style.display = 'inherit';
                                a = "11b";
                            } else if (SentenceOPer == "Hello, my name is" && playerinput == "") {
                                document.getElementById('SentenceOpenerA1a').style.display = 'none';
                                document.getElementById('SentenceOpenerA11b').style.display = 'inherit';
                                a = "11b";
                            } else if (SentenceOPer == "Hi, my name is" && !jamie_found) {
                                document.getElementById('SentenceOpenerA1a').style.display = 'none';
                                document.getElementById('SentenceOpenerA11a').style.display = 'inherit';
                                a = "11a";

                            } else if (SentenceOPer == "Hello, my name is" && !jamie_found) {
                                document.getElementById('SentenceOpenerA1a').style.display = 'none';
                                document.getElementById('SentenceOpenerA11a').style.display = 'inherit';
                                a = "11a";
                            } else if (SentenceOPer == "Hello, my name is" && jamie_found) {
                                document.getElementById('SentenceOpenerA1a').style.display = 'none';
                                document.getElementById('SentenceOpenerA1b').style.display = 'inherit';
                                WelcomeDone = true;

                                a = "1b";
                            } else if (SentenceOPer == "Hi, my name is" && jamie_found) {
                                document.getElementById('SentenceOpenerA1a').style.display = 'none';
                                document.getElementById('SentenceOpenerA1b').style.display = 'inherit';
                                WelcomeDone = true;

                                a = "1b";
                            } else if (SentenceOPer == "How can I help you") {
                                document.getElementById('SentenceOpenerA1a').style.display = 'none';
                                document.getElementById('SentenceOpenerA1b').style.display = 'inherit';
                                WelcomeDone = true;
                                a = "1b";
                            }
                        }

                        break;

                    case "11a":
                        // unselect all 
                        var elements = document.getElementById("SentenceOpenerA11a").options;
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].selected = false;
                        }

                        document.getElementById('SentenceOpenerA11a').style.display = 'none';
                        document.getElementById('SentenceOpenerA1b').style.display = 'inherit';
                        a = "1b";
                        break;

                    case "11b":
                        // unselect all 
                        var elements = document.getElementById("SentenceOpenerA11b").options;
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].selected = false;
                        }

                        var jamie_found = false;

                        if (playerinput.toLowerCase().indexOf("jamie") > -1) {
                            jamie_found = true;
                        }

                        if (playerinput == "") {

                        } else if (jamie_found) {
                            document.getElementById('SentenceOpenerA11b').style.display = 'none';
                            document.getElementById('SentenceOpenerA1b').style.display = 'inherit';
                            a = "1b";
                        } else if (!jamie_found) {
                            document.getElementById('SentenceOpenerA11b').style.display = 'none';
                            document.getElementById('SentenceOpenerA11a').style.display = 'inherit';
                            a = "11a";
                        }
                        break;

                    case "1b":
                        
                        // unselect all 
                        var elements = document.getElementById("SentenceOpenerA1b").options;
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].selected = false;
                        }

                        if (SentenceOPer == "What is that") {

                            document.getElementById('SentenceOpenerA1b').style.display = 'none';
                            document.getElementById('SentenceOpenerA1c').style.display = 'inherit';

                            a = "1c";

                        } else { }

                        break;

                    case "1c":

                        // unselect all 
                        var elements = document.getElementById("SentenceOpenerA1c").options;
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].selected = false;
                        }

                        if (SentenceOPer == "What quality problem do you have") {

                            document.getElementById('SentenceOpenerA1c').style.display = 'none';
                            document.getElementById('SentenceOpenerA1d').style.display = 'inherit';

                            a = "1d";

                        } else { }

                        break;

                    case "1d":

                        // unselect all 
                        var elements = document.getElementById("SentenceOpenerA1d").options;
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].selected = false;
                        }

                        if (SentenceOPer == "Are the shoes OK") {

                            document.getElementById('SentenceOpenerA1d').style.display = 'none';
                            document.getElementById('SentenceOpenerA2').style.display = 'inherit';

                            a = "2";

                        } else { }

                        break;

                    case "2":
                        // unselect all 
                        var elements = document.getElementById("SentenceOpenerA2").options;
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].selected = false;
                        }
                        

                        //var keyword_found = false;

                        //if (playerinput.indexOf("details") > -1) {
                        //    keyword_found = true;
                        //} else if ((playerinput.indexOf("information") > -1)) {
                        //    keyword_found = true;
                        //}

                        if (SentenceOPer == "Can you send me a picture of the shoes") {
                            document.getElementById('SentenceOpenerA2').style.display = 'none';
                            document.getElementById('SentenceOpenerA2b').style.display = 'inherit';
                            document.getElementById('hints_textarea').style.display = 'none';
                            a = "2b";
                        } else { }

                        break;

                    case "2b":

                        // unselect all 
                        var elements = document.getElementById("SentenceOpenerA2b").options;
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].selected = false;
                        }

                        if (SentenceOPer == "OK please give me some order information") {
                            document.getElementById('SentenceOpenerA2b').style.display = 'none';
                            document.getElementById('SentenceOpenerA3').style.display = 'inherit';
                            document.getElementById('hints_textarea').style.display = 'none';
                            a = "3";
                        } else { }

                        break;

                    case "3":
                        // unselect all 
                        var elements = document.getElementById("SentenceOpenerA3").options;
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].selected = false;
                        }

                        SentenceOPer = "Please give me your";
                        var name_found = false;
                        var postcode_found = false;
                        var ordernumber_found = false;

                        if (playerinput.indexOf("name") > -1) {
                            name_found = true;
                        }
                        if (playerinput.indexOf("postcode") > -1) {
                            postcode_found = true;
                        }
                        if (playerinput.indexOf("ordernumber") > -1) {
                            ordernumber_found;
                        }

                        if (name_found && postcode_found) {
                            document.getElementById('SentenceOpenerA3').style.display = 'none';
                            document.getElementById('chatsenden').style.display = 'none'
                            document.getElementById('hints_textarea').value = 'Hint:\nYou can check the information below and make sure the customer has already received the shoes';
                            document.getElementById('hints_textarea').style.display = 'inherit';
                            a = "4a";
                        } else if (name_found && ordernumber_found) {
                            document.getElementById('SentenceOpenerA3').style.display = 'none';
                            document.getElementById('chatsenden').style.display = 'none'
                            document.getElementById('hints_textarea').value = 'Hint:\nYou can check the information below and make sure the customer has already received the shoes';
                            document.getElementById('hints_textarea').style.display = 'inherit';
                            allInfoGiven = true;
                            a = "4";
                        } else if (postcode_found && ordernumber_found) {
                            document.getElementById('SentenceOpenerA3').style.display = 'none';
                            document.getElementById('chatsenden').style.display = 'none'
                            document.getElementById('hints_textarea').value = 'Hint:\nYou can check the information below and make sure the customer has already received the shoes';
                            document.getElementById('hints_textarea').style.display = 'inherit';
                            allInfoGiven = true;
                            a = "4";
                        } 
                         else if (name_found) {
                             document.getElementById('SentenceOpenerA3').style.display = 'none';
                            document.getElementById('chatsenden').style.display = 'none'
                            document.getElementById('hints_textarea').value = 'Hint:\nYou can check the information below and make sure the customer has already received the shoes';
                            document.getElementById('hints_textarea').style.display = 'inherit';
                            a = "4a";
                        } else if (postcode_found) {
                            document.getElementById('SentenceOpenerA3').style.display = 'none';
                            document.getElementById('chatsenden').style.display = 'none'
                            document.getElementById('hints_textarea').value = 'Hint:\nYou can check the information below and make sure the customer has already received the shoes';
                            document.getElementById('hints_textarea').style.display = 'inherit';
                            a = "4b";
                        } else if (ordernumber_found) {
                            document.getElementById('SentenceOpenerA3').style.display = 'none';
                            document.getElementById('chatsenden').style.display = 'none'
                            document.getElementById('hints_textarea').value = 'Hint:\nYou can check the information below and make sure the customer has already received the shoes';
                            document.getElementById('hints_textarea').style.display = 'inherit';
                            a = "4";
                        } else {
                            
                            document.getElementById('SentenceOpenerA3').style.display = 'none';
                            document.getElementById('chatsenden').style.display = 'none'
                            document.getElementById('hints_textarea').value = 'Hint:\nYou can check the information below and make sure the customer has already received the shoes';
                            document.getElementById('hints_textarea').style.display = 'inherit';
                            allInfoGiven = true;
                            a = "4";

                        }

                        break;

                    case "4a":
                        // unselect all 
                        var elements = document.getElementById("SentenceOpenerA4a").options;
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].selected = false;
                        }

                        if (SentenceOPer == "There are multiple customers with your name so please give me your ordernumber") {
                            document.getElementById('SentenceOpenerA4a').style.display = 'none';
                            document.getElementById('SentenceOpenerA4').style.display = 'inherit';
                            document.getElementById('hints_textarea').style.display = 'none';
                            a = "4";
                        } else { }

                        break;

                    case "4b":
                        // unselect all 
                        var elements = document.getElementById("SentenceOpenerA4b").options;
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].selected = false;
                        }

                        if (SentenceOPer == "There are multiple customers with your postcode so please give me your ordernumber") {
                            document.getElementById('SentenceOpenerA4b').style.display = 'none';
                            document.getElementById('SentenceOpenerA4').style.display = 'inherit';
                            document.getElementById('hints_textarea').style.display = 'none';
                            a = "4";
                        } else { }

                        break;

                    case "4":

                        document.getElementById('chatsenden').style.display = 'none';

                        document.getElementById('checkNameInput').style.display = 'none';
                        document.getElementById('checkName').style.display = 'none';
                        document.getElementById('checkOrdernumberInput').style.display = 'none';
                        document.getElementById('checkOrdernumber').style.display = 'none';
                        document.getElementById('checkPostcodeInput').style.display = 'none';
                        document.getElementById('checkPostcode').style.display = 'none';
                        document.getElementById('userinfo_textarea').style.display = 'none';
                        document.getElementById('found_customerinfo').style.display = 'none';

                        document.getElementById('checkDeliveryInput').style.display = 'inherit';
                        document.getElementById('checkDelivery').style.display = 'inherit';

                        break;

                    case "5":
                        document.getElementById('hints_textarea').style.display = 'none';
                        document.getElementById('userinfo_textarea').style.display = 'none';
                        document.getElementById('hints_textarea').style.display = 'none';
                        document.getElementById('checkNameInput').style.display = 'none';
                        document.getElementById('checkName').style.display = 'none';
                        document.getElementById('checkOrdernumberInput').style.display = 'none';
                        document.getElementById('checkOrdernumber').style.display = 'none';
                        document.getElementById('checkPostcodeInput').style.display = 'none';
                        document.getElementById('checkPostcode').style.display = 'none';
                        document.getElementById('found_customerinfo').style.display = 'none';

                        if (SentenceOPer == "I just want to make sure the order information is right") {
                            document.getElementById('SentenceOpenerA5').style.display = 'none';
                            document.getElementById('SentenceOpenerA6').style.display = 'inherit';
                            document.getElementById('hints_textarea').style.display = 'none';
                            a = "6";
                        } else { }

                        break;

                    case "6":

                        // unselect all 
                        var elements = document.getElementById("SentenceOpenerA6").options;
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].selected = false;
                        }

                        if (SentenceOPer == "I am really sorry to hear that but can I offer you") {
                            var refund_found = false;
                            var coupon_found = false;
                            var box_found = false;
                            var something_found = false;

                            if (playerinput.indexOf("refund") > -1) {
                                refund_found = true;
                            }
                            if (playerinput.indexOf("coupon") > -1) {
                                coupon_found = true;
                            }
                            if (playerinput.indexOf("box") > -1) {
                                box_found = true;
                            }
                            if (playerinput.indexOf("something") > -1) {
                                something_found = true;
                            }
                            if (coupon_found) {
                                document.getElementById('SentenceOpenerA6').style.display = 'none';
                                document.getElementById('SentenceOpenerA7c').style.display = 'inherit';
                                a = "7c";
                            } else if (refund_found) {
                                document.getElementById('SentenceOpenerA6').style.display = 'none';
                                document.getElementById('SentenceOpenerA7d').style.display = 'inherit';
                                a = "7d";
                            } else if (box_found) {
                                document.getElementById('SentenceOpenerA6').style.display = 'none';
                                document.getElementById('SentenceOpenerA7c').style.display = 'inherit';
                                a = "7c";
                            } else if (something_found) {
                                document.getElementById('SentenceOpenerA6').style.display = 'none';
                                document.getElementById('SentenceOpenerA7e').style.display = 'inherit';
                                a = "7e";
                                document.getElementById('hints_textarea').value = 'Hint:\nYou can offer the customer a refund, a coupon or send him a new box';
                                document.getElementById('hints_textarea').style.display = 'inherit';
                            }
                            else {
                                document.getElementById('hints_textarea').value = 'Hint:\nYou can offer the customer a refund, a coupon or send him a new box';
                                document.getElementById('hints_textarea').style.display = 'inherit';
                            }
                        } else {
 
                        }
                        break;

                    //case "7a":
                    //    // unselect all 
                    //    var elements = document.getElementById("SentenceOpenerA7a").options;
                    //    for (var i = 0; i < elements.length; i++) {
                    //        elements[i].selected = false;
                    //    }

                    //    if (SentenceOPer == "I will do that right away, sorry for your inconvenience") {
                    //        document.getElementById('SentenceOpenerA7a').style.display = 'none';
                    //        a = "8a";
                    //        gamecomplete();
                    //    } else {
                    //        document.getElementById('SentenceOpenerA7a').style.display = 'none';
                    //        a = "8b";
                    //        gamecomplete();
                    //    }
                    //    break;

                    //case "7b":

                    //    // unselect all 
                    //    var elements = document.getElementById("SentenceOpenerA7b").options;
                    //    for (var i = 0; i < elements.length; i++) {
                    //        elements[i].selected = false;
                    //    }

                    //    document.getElementById('SentenceOpenerA7b').style.display = 'none';
                    //    a = "8c";
                    //    gamecomplete();
                    //    break;

                    case "7c":
                        // unselect all 
                        var elements = document.getElementById("SentenceOpenerA7c").options;
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].selected = false;
                        }

                        document.getElementById('SentenceOpenerA7c').style.display = 'none';
                        a = "8";
                        gamecomplete();
                        break;

                    case "7d":
                        // unselect all 
                        var elements = document.getElementById("SentenceOpenerA7d").options;
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].selected = false;
                        }

                        if (SentenceOPer == "I will arrange that immediately") {
                                    document.getElementById('SentenceOpenerA7d').style.display = 'none';
                                    a = "8";
                                    gamecomplete();
                        } else {

                        }
                        break;

                    case "7e":
                        var elements = document.getElementById("SentenceOpenerA7e").options;
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].selected = false;
                        }

                            var refund_found = false;
                            var coupon_found = false;
                            var box_found = false;
                            var something_found = false;

                            if (playerinput.indexOf("refund") > -1) {
                                refund_found = true;
                            }
                            if (playerinput.indexOf("coupon") > -1) {
                                coupon_found = true;
                            }
                            if (playerinput.indexOf("box") > -1) {
                                box_found = true;
                            }
                            if (playerinput.indexOf("something") > -1) {
                                something_found = true;
                            }
                            if (coupon_found) {
                                document.getElementById('SentenceOpenerA7e').style.display = 'none';
                                document.getElementById('SentenceOpenerA7c').style.display = 'inherit';
                                a = "7c";
                            } else if (refund_found) {
                                document.getElementById('SentenceOpenerA7e').style.display = 'none';
                                document.getElementById('SentenceOpenerA7d').style.display = 'inherit';
                                a = "7d";
                            } else if (box_found) {
                                document.getElementById('SentenceOpenerA7e').style.display = 'none';
                                document.getElementById('SentenceOpenerA7c').style.display = 'inherit';
                                a = "7c";
                            } else {
                                document.getElementById('hints_textarea').value = 'Hint:\nYou can offer the customer a refund, a coupon or send him a new box';
                                document.getElementById('hints_textarea').style.display = 'inherit';
                            }
                        break;

                    case "8":
                        break;

                }

            } else {
                if (a == "1a") {
                } else {
                }

            }

            SentenceOPer = "";

        },
        function (registrationId) { //The function to be called after a successful registration of the event, receives an registration id as a {Number}
            myCallbackId = registrationId; //save id in global variable for later deregistering of event

        }
    )

}


function spielscreenstarten() {

    document.getElementById('intro1').style.display = "none";
    document.getElementById('intro2').style.display = "none";
    document.getElementById('game').src = "img/warteaufspieler.gif";


    document.getElementById('SentenceOpenerA1a').style.display = 'inherit';
    document.getElementById('SentenceOpenerA1a').disabled = true;
    a = "1a";

    chatfunction();

    space.write(
        new TS.Tuple([PlayerName, "STARTCONVERSATION", "", SessionID, 1, 0]), //tuple
        function (id) { //callback, if tuple was successfully written

        }
	);
    document.getElementById("chatfenster").value = "A customer has entered the chat.\n";

    // set input filds to empty in case browser saves data
    document.getElementById("checkNameInput").value = "";
    document.getElementById("checkOrdernumberInput").value = "";
    document.getElementById("checkPostcodeInput").value = "";
    document.getElementById("checkDeliveryInput").value = "";
    document.getElementById("chatform").value = "";
    gamescreen();


}


function startspiel() {

    connect();

    document.getElementById('game').src = "img/WelcomeMessage1.png";
    document.getElementById('loginversuch').style.display = 'none';
    document.getElementById('button').style.display = 'none';
    PlayerName = document.getElementById('name').value;
    if (PlayerName == "") {
        PlayerName = "No_Playername_Given";
    }
    document.getElementById('button2').style.display = 'inline';
    document.getElementById('name').style.display = 'none';


}

function login2() {
    connect();

    document.getElementById('game').src = "img/WelcomeMessage2.png";
    document.getElementById('loginversuch').style.display = 'none';
    document.getElementById('button').style.display = 'none';
    document.getElementById('button2').style.display = 'none';
    document.getElementById('introtext_button').style.display = 'inline';
    document.getElementById('name').style.display = 'none';

}

function introtext() {
    if (introductionScreenCounter == 1) {
        document.getElementById('game').src = "img/WelcomeMessage3.png";
        introductionScreenCounter++;
    } else if (introductionScreenCounter == 2) {
        document.getElementById('game').src = "img/WelcomeMessage4.png";
        introductionScreenCounter++;
    } else if (introductionScreenCounter == 3) {
        document.getElementById('game').src = "img/WelcomeMessage5.png";
        introductionScreenCounter++;
    } else if (introductionScreenCounter == 4) {
        document.getElementById('game').src = "img/WelcomeMessage6.png";
        introductionScreenCounter++;
    } else if (introductionScreenCounter == 5) {
        document.getElementById('game').src = "img/WelcomeMessage7.png";
        introductionScreenCounter++;
    } else if (introductionScreenCounter == 6) {
        document.getElementById('game').src = "img/WelcomeMessage8.png";
        introductionScreenCounter++;

        document.getElementById('introtext_button').style.display = 'none';
        document.getElementById('button3').style.display = 'inline';
    } else if (introductionScreenCounter == 7) {
        
    }
}

function login1() {
    LName = document.getElementById('name').value;
    document.getElementById('name').style.display = 'none';
    writeLoginTuple(LName);
    document.getElementById('loginversuch').style.display = 'none';
    document.getElementById('button2').style.display = 'none';
    document.getElementById('button3').style.display = 'none';
    document.getElementById('button').src = "img/suche.png";
    waitToTakeRoleEvent();

}


function login() {

    document.getElementById('game').src = "img/login.png";
    document.getElementById('button').style.display = 'inline';
    document.getElementById('loginversuch').style.display = 'inherit';
    document.getElementById('name').style.display = 'inline';
    document.getElementById('starten').style.display = 'none';

}

function gamescreen() {

    waitToCancelGame();

    Playertext();
    document.getElementById('intro1').style.display = 'none';
    document.getElementById('intro2').style.display = 'none';
    document.getElementById('game').style.display = 'none';
    document.getElementById('chat').style.display = 'inherit';
    document.getElementById('Person').src = "img/HerrMeier.png";



}


function connect() {
    space = new TS.TupleSpace(
        { host: 'localhost', port: 8080, space: 'COLCOMA' },
        function () {

        }
    );
}

function writeLoginTuple(Loginname) {

    var falsch = false;

    space.write(
        new TS.Tuple([Loginname, falsch]), //tuple
        function (id) { //callback, if tuple was successfully written

        }
    );
}

function counter1() {
    spielscreenstarten();
}

function SentenceOP(select) {
    SentenceOPer = select;
}


function waitToTakeRoleEvent() {
    //define template for callback
    var t1 = new TS.Field('actual', 'string', LName); //nur nach dem Spieler schauen
    var t2 = new TS.Field('formal', 'integer');
    var t3 = new TS.Field('formal', 'boolean');
    var template = new TS.Tuple([t1, t2, t3]);

    //register event
    space.eventRegister(
        'write', //The command for the event (write, delete, update, all)
        template,  // The tuple template
        function (result) { // The function to be called if an registered event occurs, receives some properties plus the tuples as before and after attributes
            //get info from result tuple
            var f0 = result.after.tuple.getField(0).getValue();
            var f1 = result.after.tuple.getField(1).getValue();
            var f2 = result.after.tuple.getField(2).getValue();


            SessionID = result.after.tuple.getField(1).getValue();
            TroubleMaker = result.after.tuple.getField(2).getValue();

            document.getElementById('intro1').style.display = 'inline';
            document.getElementById('game').src = 'img/gefunden.png';
            space.take(result.after.tuple);
            space.eventDeregister(myCallbackId);
        },
        function (registrationId) { //The function to be called after a successful registration of the event, receives an registration id as a {Number}
            myCallbackId = registrationId; //save id in global variable for later deregistering of event
            //login2(); //write login tuple
        }
    )
}




function Playertext() {

    var t1 = new TS.Field('actual', 'string', PlayerName);
    var t2 = new TS.Field('formal', 'string');
    var t3 = new TS.Field('formal', 'string');
    var t4 = new TS.Field('actual', 'integer', SessionID);
    var t5 = new TS.Field('formal', 'integer');
    var t6 = new TS.Field('formal', 'integer');

    var template = new TS.Tuple([t1, t2, t3, t4, t5, t6]);

    space.eventRegister(
        'write', //The command for the event (write, delete, update, all)
        template,  // The tuple template
        function (result) { // The function to be called if an registered event occurs, receives some properties plus the tuples as before and after attributes
            //get info from result tuple



            var f0 = result.after.tuple.getField(1).getValue();
            var f1 = result.after.tuple.getField(2).getValue();

            var text = f0 + f1;
            document.getElementById('chatfenster').value = document.getElementById('chatfenster').value + "\nYou: " + text + "\n";
            document.getElementById('chatfenster').scrollTop = document.getElementById('chatfenster').scrollHeight;

        },
        function (registrationId) { //The function to be called after a successful registration of the event, receives an registration id as a {Number}
            myCallbackId = registrationId; //save id in global variable for later deregistering of event

        }
    )
}

function waitToCancelGame() {
    //define template for callback
    var t2 = new TS.Field('actual', 'integer', SessionID);
    var t1 = new TS.Field('actual', 'string', PartnerName);
    var t4 = new TS.Field('actual', 'string', PlayerName);
    var t3 = new TS.Field('actual', 'string', "Conversation Ended");
    var t5 = new TS.Field('formal', 'boolean');

    var template = new TS.Tuple([t1, t2, t3]);

    //register event
    space.eventRegister(
        'write', //The command for the event (write, delete, update, all)
        template,  // The tuple template
        function (result) { // The function to be called if an registered event occurs, receives some properties plus the tuples as before and after attributes
            //get info from result tuple

            document.getElementById("freechatfenster").value = 'Das Gespraech wurde beendet.\n' + 'Sie haben jetzt die Moeglichkeit sich mit ihrem Gespraechspartner frei zu unterhalten.\n';

            space.write(
                new TS.Tuple([PartnerName, SessionID, "Conversation Ended"]),
                function (id) { //callback, if tuple was successfully written

                }
            );

            space.write(
                new TS.Tuple(["Feedback erstellen", SessionID, PlayerName]),
                function (id) { //callback, if tuple was successfully written

                }
            );


            space.write(
                 new TS.Tuple([SessionID, ID, "Direct Feedback", PartnerName, "#Kritik#Ihr Gesprächspartner hat das Gespräch an dieser Stelle abgebrochen. Das ist schade, denn so konnte das Ziel einer Konfliktlösung nicht erreicht werden."]), //tuple
                 function (id) { //callback, if tuple was successfully written

                 }
            );


            freechat();



            space.take(result.after.tuple);
            space.eventDeregister(myCallbackId);
        },
        function (registrationId) { //The function to be called after a successful registration of the event, receives an registration id as a {Number}
            myCallbackId = registrationId; //save id in global variable for later deregistering of event

        }
    )
}

function submitenter(myfield, e) {
    var keycode;
    if (window.event) keycode = window.event.keyCode;
    else if (e) keycode = e.which;
    else return true;

    if (keycode == 13) //Enter
    {
        chattextsenden();
        return false;
    }
    else
        return true;
}