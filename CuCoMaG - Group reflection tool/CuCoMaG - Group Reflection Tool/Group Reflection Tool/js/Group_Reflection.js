	var xmlFiles = [];
	var messagesList = [];
	var firstMessagesList=[];
    var resultList = [];
	var inputFile;
    var messages=[];
    var playerCounter;
    var playerName = [];
    var barData = [];
    var lineData = [];
    var answers;
    var chartState = "lineChart";
	var selectedSymbol = []; 
	var clickedMeasures = document.getElementsByClassName('measure');
	
	//hide the containers for replay
	function open_Replay() {
	document.getElementById("ChartContainer").style.display="none";
	document.getElementById("CheckboxTable").style.display="none";
	document.getElementById("CheckboxContainer").style.display="none";
	document.getElementById("ReplayContainer").style.display="block";
	document.getElementById("ReplayContainer").style.height="auto";


	chartState = "Replay";
//Creating the Radiobuttons for the players
    document.getElementById("ParticipantsTable").innerHTML = "";
    document.getElementById("ParticipantsTable").innerHTML +="<tr><th class=\"UnderlinedHeader\">Name</th><th class=\"UnderlinedHeader\">Score</th></tr>";
//Summary of Data from the <Result>
    for (var i = 0; i < messagesList.length; i++) {
		var playerName = messagesList[i][0].getElementsByTagName("PlayerName")[0].childNodes[0].nodeValue;
		var	playerScore = messagesList[i][messagesList[i].length-1].getElementsByTagName("ScoreOverall")[0].childNodes[0].nodeValue;
		document.getElementById("ParticipantsTable").innerHTML += "<tr><td><input name = \"RadioButton\" value=\""+playerName+"\" type=\"radio\" onclick=\"printReplayData(\'"+playerName+"\', \'0\')\"/> "+playerName + "</td><td>"+playerScore+"</td></tr>";
		notepadEditor(playerName);
        }
	}
	//hide the replaycontainer and show the hidden containers
	function open_DataCenter() {
	document.getElementById("ReplayContainer").style.display="none";
	document.getElementById("CheckboxTable").style.display="block";
	document.getElementById("CheckboxContainer").style.display="block";
	document.getElementById("CheckboxContainer").style.height="auto";
	document.getElementById("ChartContainer").style.display="block";
    
    document.getElementById("ParticipantsTable").innerHTML = "";
    document.getElementById("ParticipantsTable").innerHTML +="<tr><th class=\"UnderlinedHeader\">Name</th><th class=\"UnderlinedHeader\">Score</th></tr>";
//deleting the checkboxes and showing the player names and score
for (var i = 0; i < messagesList.length; i++) {
        var playerName = messagesList[i][0].getElementsByTagName("PlayerName")[0].childNodes[0].nodeValue;
        var playerScore = messagesList[i][messagesList[i].length-1].getElementsByTagName("ScoreOverall")[0].childNodes[0].nodeValue;
        document.getElementById("ParticipantsTable").innerHTML += "<tr><td>"+playerName+"</td>"+"<td>"+ playerScore+"</td></tr>";    
	}
}
	//is called by the open button and works with a hidden <input> element in the document
	function open_File_Dialog() {
	document.getElementById('fileOpener').addEventListener('change', handle_Selected_File, true); //adding change event, is called when file is chosen
	inputFile = document.getElementById("fileOpener"); //Reference to the chosen file
	fileOpener.click();
	}

	//is fired through the state that a file is chosen by the user
	function handle_Selected_File(event){

	//I don´t get access by the fileReference itself in an easy way for handling the file as XML, so this seems to be easier (also for a client-server-structure)
	var xmlhttp = new XMLHttpRequest();
	//uses the Reference on the user-chosen-file to get the filename for the request
	xmlhttp.open("GET", inputFile.value, false);
	xmlhttp.send();
	var xmlDoc = xmlhttp.responseXML; 
	//Proof if there´s a Player with the same Name already loaded -> throw an alert
		var playerAlreadyInListCounter = 0;
		for(var i = 0; i< messagesList.length ;i++){
		if(xmlDoc.getElementsByTagName("PlayerName")[0].childNodes[0].nodeValue == messagesList[i][0].getElementsByTagName("PlayerName")[0].childNodes[0].nodeValue){
 		playerAlreadyInListCounter++;
		}	
		}
		if (playerAlreadyInListCounter == 1){
		return alert("The data of "+ xmlDoc.getElementsByTagName("PlayerName")[0].childNodes[0].nodeValue+ " is already loaded. Please chose another participant.");
		}
	//get all messages and put it in the List
	messagesList.push(xmlDoc.getElementsByTagName("Message"));//messages and the tags inside are in messageList
    resultList.push(xmlDoc.getElementsByTagName("Result"));

    //changing the data because the first player message is meaningless
  	messagesList =  prepareDataCausedByFirstPlayerMessage(messagesList,xmlDoc);


//erase the content, because html keeps the old content and simply adds the new, but we have to draw the whole array
document.getElementById("ParticipantsTable").innerHTML = "";
    document.getElementById("ParticipantsTable").innerHTML +="<tr><td><th class=\"UnderlinedHeader\">Name</th></td><td><th class=\"UnderlinedHeader\">Score</th></td></tr>";

    for (var i = 0; i < messagesList.length; i++) {

		var playerName = messagesList[i][0].getElementsByTagName("PlayerName")[0].childNodes[0].nodeValue;
		var	playerScore = messagesList[i][messagesList[i].length-1].getElementsByTagName("ScoreOverall")[0].childNodes[0].nodeValue;
		document.getElementById("ParticipantsTable").innerHTML += "<tr><td>"+playerName+"</td>"+"<td>"+ playerScore+"</td></tr>";
	 
	}
	if(chartState=="Replay"){
		open_Replay();
	}
	else {updateChart("");}
	alert("File: " + inputFile.value + inputFile.type +" loaded successful!");
    notepadEditor();
}

function prepareDataCausedByFirstPlayerMessage(messagesListArray, xmlDocument){
	//copy the first message from the doc into the firstMessages list
	firstMessagesList.push(xmlDocument.getElementsByTagName("Message")[0]);
	//deleting first message of the player, then the graph etc kann work with it (first parameter is index, second is amount of elements to delete)
	//removes the first message from the last/actual loaded player
	messagesListArray[messagesListArray.length-1][0].remove();
	//decreasing the messageIDs
	for (i = 0; i < messagesListArray[messagesListArray.length-1].length;i++){
		messagesListArray[messagesListArray.length-1][i].getElementsByTagName("MessageID")[0].childNodes[0].nodeValue = (parseInt(messagesListArray[messagesListArray.length-1][i].getElementsByTagName("MessageID")[0].childNodes[0].nodeValue)-1);
	}
	return messagesListArray;	
	}


	function updateChart(chartType) {
		open_DataCenter();
		switch(chartType){
			case "barChart":
			chartState = chartType;
				plot_BarChart(selectMeasures());
				break;
			case "lineChart":
			chartState = chartType;
				plot_LineChart(selectMeasures());
				break;
			default: updateChart(chartState);break;
	}
}
function selectMeasures(){
	var measures = document.getElementsByClassName("measure");
		var selectedMeasures = [];
		for (var i=0; i < measures.length; i++){
			if(measures[i].checked==true) {
				selectedMeasures.push(measures[i].name);
			}
		}
		return selectedMeasures;
}

function printReplayData(selectedPlayerName, mID) {
//case: hitting the replay button and choosing a player to display the whole replay
document.getElementById("ReplayContainer").innerHTML ="";
for (var i = 0; i < messagesList.length; i++) {
    if (selectedPlayerName == messagesList[i][0].getElementsByTagName("PlayerName")[0].childNodes[0].nodeValue){
        document.getElementById("ReplayContainer").innerHTML += "<div id = \"Results\"><p class = \"Results\" style = \"color:#f48f00;font-size: 20px;font:bold;text-shadow:#9ba2a6 0 4px 5px;\">#Results:"
        	+"<button class =\"intoNotepad_Button\" type = \"button\" onclick=\"copyIntoNotepad(\'Results\')\" style = \"display: none\"><span style = \"display: none\">copy into notepad</span></button></p>"
            + "<p>Chat ended: "+ measureTrue(i,0,"ResultQuality")+"</p>"
            + "<p>Needed amount of answers: "+ (parseInt(resultList[i][0].getElementsByTagName("AnswerAmount")[0].childNodes[0].nodeValue)-1)+"</p>"
            + "<p>Needed time(sec): " + resultList[i][0].getElementsByTagName("OverallTime")[0].childNodes[0].nodeValue/1000 +"</p>"
            +"</div>";

        //first message of the bot after entering the chat -> Player has no possibility to send a message before so it´s irrelevant
       document.getElementById("ReplayContainer").innerHTML +=	"<div id = \""+"0bot\" class = \"botResponse\"><p class=\"messageId\" style = \"color:#007fad;font-size: 20px;font:bold;text-shadow:#9ba2a6 0 4px 5px;\">#Customer response: "
			+"<button class =\"intoNotepad_Button\" type = \"button\" onclick=\"copyIntoNotepad(\'"+"0bot\')\" style = \"display: none\"><span style = \"display: none\">copy into notepad</span></button></p>"
            +"<p>"+firstMessagesList[i].getElementsByTagName("BotResponse")[0].childNodes[0].nodeValue + "</p></div>";
	
        
        //Printing every Message of the player like this:
        for(var j = 0; j < messagesList[i].length; j++){
			//Message of the Player
			document.getElementById("ReplayContainer").innerHTML +=	"<div id = \""+messagesList[i][j].getElementsByTagName("MessageID")[0].childNodes[0].nodeValue+"\">"
			+"<p class=\"messageId\" style = \"color:#007fad;font-size: 20px;font:bold;text-shadow:#9ba2a6 0 4px 5px;\">#Message "+messagesList[i][j].getElementsByTagName("MessageID")[0].childNodes[0].nodeValue
			+"<button class =\"intoNotepad_Button\" type = \"button\" onclick=\"copyIntoNotepad("+messagesList[i][j].getElementsByTagName("MessageID")[0].childNodes[0].nodeValue+")\" style = \"display: none\"><span style = \"display: none\">copy into notepad</span></button></p>"
			+"<p><span style = \"font-weight: bold\">"+messagesList[i][j].getElementsByTagName("PlayerName")[0].childNodes[0].nodeValue +": "+"</span>" 
			+ measureTrue(i,j,"SentenceOpener")
			+ " "+measureTrue(i, j, "PlayerInput")
			+"</p>"
			+"<span style = \"color: green\">"+measureTrue(i,j,"Politeness")+"</span>"
			+ " <span style = \"color: red\">"+measureTrue(i,j,"Aggression")+"</span>"
			+ " <span style = \"color: red\">"+measureTrue(i,j,"Rudeness")+"</span>"
			+ " <span style = \"color: red\">"+measureTrue(i,j,"NoGoSentence")+"</span>"
			+ " "+measureTrue(i,j,"Answerquality")+"</span>"
			+ " <span style = \"color: red\">"+measureTrue(i,j,"SilenceTrigger")+"</span>"
			+"<p>"
			+"Time needed: " +messagesList[i][j].getElementsByTagName("MessageTime")[0].childNodes[0].nodeValue/1000 +" seconds"
			+","+" Score: " +messagesList[i][j].getElementsByTagName("ScoreOverall")[0].childNodes[0].nodeValue+" points"
			+"</p></div>";
			
			//Response of the Bot
			document.getElementById("ReplayContainer").innerHTML +=	"<div id = \""+messagesList[i][j].getElementsByTagName("MessageID")[0].childNodes[0].nodeValue+"bot\" class = \"botResponse\"><p class=\"messageId\" style = \"color:#007fad;font-size: 20px;font:bold;text-shadow:#9ba2a6 0 4px 5px;\">#Customer response: "
			+"<button class =\"intoNotepad_Button\" type = \"button\" onclick=\"copyIntoNotepad(\'"+messagesList[i][j].getElementsByTagName("MessageID")[0].childNodes[0].nodeValue+"bot\')\" style = \"display: none\"><span style = \"display: none\">copy into notepad</span></button></p>"
            +"<p>"+messagesList[i][j].getElementsByTagName("BotResponse")[0].childNodes[0].nodeValue + "</p></div>";
	}
	}
	
	
	}
	//case: From linegraph into the replay directly to the chosen message (0 equals the result in the replay which is not a message)
	if (mID!="0"){
		var divToHighlight = document.getElementById(mID);
		divToHighlight.style.backgroundColor ="#F5F0C9";
     //auto scrolling stuff 		
	 var topPos=0;
     var divToHighlight = document.getElementById(mID);
     var replay=document.getElementById("ReplayContainer");
	 divToHighlight.parentElement.scrollTop = topPos;

     topPos = divToHighlight.offsetTop;	
     topPos=topPos-400;
    $('#ReplayContainer').animate({ scrollTop: ($("ReplayContainer").scrollTop = topPos)}, 'medium'); 
	
	}
}
function measureTrue(i,j,Measure){
	switch (Measure) {
        //For the Results
    case"ResultQuality":
    if (resultList[i][0].getElementsByTagName("ResultQuality")[0].childNodes[0].nodeValue == 3){
        return "With a satisfied customer.";
    } else if (resultList[i][0].getElementsByTagName("ResultQuality")[0].childNodes[0].nodeValue == 4){
        return "With an acceptable solution for the customer.";
    } else if (resultList[i][0].getElementsByTagName("ResultQuality")[0].childNodes[0].nodeValue == 5){
        return "With an unsatisfied customer.";
    } else if (resultList[i][0].getElementsByTagName("ResultQuality")[0].childNodes[0].nodeValue == 6){
        return "By participant leaving the chat before the end.";
    
    }

    //For the standard Messages
	case "SentenceOpener": 
        if(messagesList[i][j].getElementsByTagName("SentenceOpener")[0].childNodes[0].nodeValue =="\""+"\"" || messagesList[i][j].getElementsByTagName("SentenceOpener")[0].childNodes[0].nodeValue =="\"Ping\""){
            return "";
        }else {
        	var SentenceOpenerString = messagesList[i][j].getElementsByTagName("SentenceOpener")[0].childNodes[0].nodeValue.toString();
        	var SentenceOpenerStringWithout ="";
        	for (var k = 0; k < 2;k++){
        	SentenceOpenerStringWithout = SentenceOpenerString.replace(/"/,"");
        	SentenceOpenerString = SentenceOpenerStringWithout;
			}
        	return "\""+SentenceOpenerStringWithout;}

    case "PlayerInput":
        if(messagesList[i][j].getElementsByTagName("PlayerInput")[0].childNodes[0].nodeValue =="\""+"\"" || messagesList[i][j].getElementsByTagName("SentenceOpener")[0].childNodes[0].nodeValue =="\"Ping\""){
            return"";
        }else {
			var SentenceOpenerString = messagesList[i][j].getElementsByTagName("PlayerInput")[0].childNodes[0].nodeValue.toString();
        	var SentenceOpenerStringWithout ="";
        	for (var k = 0; k < 2;k++){
        	SentenceOpenerStringWithout = SentenceOpenerString.replace(/"/,"");
        	SentenceOpenerString = SentenceOpenerStringWithout;
			}
        	return SentenceOpenerStringWithout +"\"";}

    case "Answerquality":
		if(messagesList[i][j].getElementsByTagName(Measure)[0].childNodes[0].nodeValue == "0"){
			return "<span style = \"color: red\">#Unhelpful answer";
		} else if (messagesList[i][j].getElementsByTagName(Measure)[0].childNodes[0].nodeValue == "1"){
			return "#neutral answer";
		} else if (messagesList[i][j].getElementsByTagName(Measure)[0].childNodes[0].nodeValue == "2"){
			return "<span style = \"color: green\">#helpful answer</span>";
		}
	default: 
		if(messagesList[i][j].getElementsByTagName(Measure)[0].childNodes[0].nodeValue == "true"){
		return "#"+Measure;
		} else {
		return "";	
		}
	}
		
}
//copies the content of a div per button into the notepad
function copyIntoNotepad(divId){
//Selecting the divs content to copy from	
var divContent = $("#"+divId).html();

var removeElements = function(text, selector) {
    var wrapped = $("<div>" + text + "</div>");
    wrapped.find(selector).remove();
    return wrapped.html();
}

divContent = removeElements(divContent, "button");


var tab=$('#tabs li a:not([class]),#tabs li a[class=""]').attr("href");
$(tab + " .nicEdit-main").append(divContent);

}

//converting notepad content to pdf
function convertToPDF() { 
   
//access to the html content of the opened notepad-tab/player in the notepad
var tab=$('#tabs li a:not([class]),#tabs li a[class=""]').attr("href");
var contentToPrint = $(tab + " .nicEdit-main").html();
//creating the pdf document
  var pdfDoc = new jsPDF();
    pdfDoc.fromHTML(contentToPrint, 10, 10, {'width': 180});
    pdfDoc.output("dataurlnewwindow"); // this opens a new popup, after this the PDF opens but there are browser inconsistencies with how this is handled*/
    
}

//ChartStuff
    function extract_data_from_DataBase(){
        
        var k=0;
        for(var i=0;i < messagesList.length;i++)
        { 
            for(var j=0; j < messagesList[i].length; j++ )
            {
                messages[k]=messagesList[i][j];
                k+=1;
            }
        }
        
        
        
        playerCounter = 0;
        playerName[playerCounter] = messages[0].getElementsByTagName("PlayerName")[0].childNodes[0].nodeValue; //First playerName ism always different from nothing
        var playerScore = messages[0].getElementsByTagName("ScoreOverall")[0].childNodes[0].nodeValue;
        for (var i = 1; i < messages.length; i++) {
           
            var newV = messages[i].getElementsByTagName("PlayerName")[0].childNodes[0].nodeValue;
            var old = messages[i-1].getElementsByTagName("PlayerName")[0].childNodes[0].nodeValue;
            if(newV != old)
            {
                playerCounter += 1;
                playerName[playerCounter] = messages[i].getElementsByTagName("PlayerName")[0].childNodes[0].nodeValue;
                playerScore = messages[i].getElementsByTagName("ScoreOverall")[0].childNodes[0].nodeValue;
                
            }
        }
    }


//is called by the bar_chart button and work with "messages" and highcharts library
function plot_BarChart(measuresToDraw) {
    extract_data_from_DataBase(); //gives a 1-dimensional array of all <Message> from all players
    var temp;
    var categories = [];
    for(var i = 0; i< measuresToDraw.length;i++){ 
        if (measuresToDraw[i] === 'Answerquality' ){
            categories.push('Unhelpful Answer');
            categories.push('Neutral Answer');
            categories.push('Helpful Answer');
        } else {
            categories.push(measuresToDraw[i]);
        }
    }
 
    var answers = new Array(playerName.length);
    for (var n=0; n<playerName.length; n++){
        answers[n] = new Array(categories.length);
    }
    
    var player_name_temp;
    for(var i=0; i<playerName.length; i++){
        for(var j=0; j<categories.length; j++){
            for(var k=0; k<messages.length; k++){
                player_name_temp = messages[k].getElementsByTagName("PlayerName")[0].childNodes[0].nodeValue;
                if (isNaN(answers[i][j])){
                    answers[i][j]=0;
                }
                if (player_name_temp==playerName[i]){ 
                    if (categories[j] === 'Unhelpful Answer' || categories[j] === 'Neutral Answer' || categories[j] === 'Helpful Answer'){
                        temp = messages[k].getElementsByTagName('Answerquality')[0].childNodes[0].nodeValue;
                    } else {
                        temp = messages[k].getElementsByTagName(categories[j])[0].childNodes[0].nodeValue;
                    }
                    
                    if (temp ==="true"){
                        answers[i][j]+=1;
                    } else if (temp === "0" && categories[j] === 'Unhelpful Answer'){
						answers[i][j]+=1;
					} else if (temp === "1" && categories[j] === 'Neutral Answer'){
                        answers[i][j]+=1;
					} else if (temp === "2" && categories[j] === 'Helpful Answer'){
						answers[i][j]+=1;
					}
                }
            }
        }
    }

    
    for (var i=0; i<playerName.length; i++){
        barData[i]={name: playerName[i],data: answers[i]};
	};
	$(function () {
    $('#ChartContainer').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Result Overview'
        },
        xAxis: {
        	categories		
           // categories: ['Aggression', 'Politeness', 'Rudeness', 'NoGoSentence', 'SilenceTrigger','Unhelpful Answer','Neutral Answer','Helpful Answer']
        },
        yAxis: {
            title: {
                text: 'Number of times used'
            }, 
			allowDecimals: false
        },
        series: barData,
    });
});
}

//is called by the line_chart button and work with "messages" and highcharts library
function plot_LineChart(measuresToDraw) {
    var i;
    var selectedColor = [];
    //selectedCategories is an input based on the user selection (for now we use an assumption instead of it, you can change it to see how it affects the ploted results)
    //categoriesList: ["Aggression", "Politeness", "Rudeness", "NoGoSentence", "SilenceTrigger"]
    
    var selectedCategories = [];
    for(var i = 0; i< measuresToDraw.length;i++){
        if (measuresToDraw[i] != 'Answerquality'){
    	   selectedCategories.push(measuresToDraw[i]);
        } else { 
            selectedCategories.push('Unhelpful Answer');
            selectedCategories.push('Neutral Answer');
            selectedCategories.push('Helpful Answer');
        }
    }
    
    for (i = 0; i < selectedCategories.length; i++){ 
        switch(selectedCategories[i]) { //includes the symbols and colors
            case "Aggression":
                selectedColor[i] = 'rgba(255, 102, 0, 1)';//orange
                selectedSymbol[i] = "triangle";
                break;
            case "Politeness":
                selectedColor[i] = 'rgba(5,220,5, 1)';//green
                selectedSymbol[i] = "square";
                break;
            case "Rudeness":
                selectedColor[i] = 'rgba(223, 19, 10, 1)';//red
                selectedSymbol[i] = "circle";
                break;
            case "NoGoSentence":
                selectedColor[i] = 'rgba(255, 166, 77, 1)';//yellow
                selectedSymbol[i] = "triangle";
                break;
            case "SilenceTrigger":
                selectedColor[i] = 'rgba(204, 0, 153, 1)';//purple
                selectedSymbol[i] = "diamond";
                break;
            case "Unhelpful Answer":
                selectedColor[i] = 'rgba(140, 90, 70, 1)';//brown
                selectedSymbol[i] = "triangle-down";
                break;
            case "Neutral Answer":
                selectedColor[i] = 'rgba(100, 100, 100, 1)';//gray
                selectedSymbol[i] = "triangle-down";
                break;
            case "Helpful Answer":
                selectedColor[i] = 'rgba(100, 200, 200, 1)';//blue
                selectedSymbol[i] = "triangle-down";
                break;
        }
    }
    
    var plotObject = lineChartObject(selectedCategories, selectedColor);
    $(function () {
        $('#ChartContainer').highcharts({
            title: {text: 'Result Overview'},
            xAxis: {title: {text: 'Message Number'},allowDecimals: false},
            yAxis: {title: {text: 'Overall Score'},allowDecimals: false},
			tooltip: {
                formatter: function() {
                    if(this.series.name == 'Aggression' || this.series.name == 'Politeness' || this.series.name == 'Rudeness' || this.series.name == 'NoGoSentence' || this.series.name == 'SilenceTrigger'){
					return false ;    // to disable the tooltip at a point return false 
				} else {
					var txtBox = lineChartFormatter(this.series.name, this.x - 1, selectedCategories, selectedColor);
                    
                    return '<b> Player: '+ this.series.name +'</b><br/>'+
                    'Message ID: ' + this.x + '<br/>' +
                    'Overall Score: ' + this.y + '<br/>' + txtBox;
					}   
				}
			},
            
            series: plotObject.seriesData,
            plotOptions: {
                series: {
                    marker: {radius: 6},
                    allowPointSelect: true,
                    point: {
                        events: {
                            click: function() {
                             open_Replay();
                            printReplayData(this.series.name,this.category);
                               
                            }
                        }                        
                    }
					
                }
            }
        });
    });
}



function lineChartObject(selectedCategories, selectedColor) {
    extract_data_from_DataBase();
    var c, i, j, n, x, y, show_hide_id, lineData = [], clrSelector = [], temp_data = [];
    var temp; 
    for (i = 0; i < playerName.length; i++) {
        temp_data = [];
        n = 0;
        for (j = 0; j < messages.length; j++) {
            if (messages[j].getElementsByTagName("PlayerName")[0].childNodes[0].nodeValue == playerName[i]) {
                x = Number(messages[j].getElementsByTagName("MessageID")[0].childNodes[0].nodeValue);
                y = Number(messages[j].getElementsByTagName("ScoreOverall")[0].childNodes[0].nodeValue);
                temp_data[n] = [x, y];
                n = n + 1;
            }
        }
        lineData[i] = {type: 'line', name: playerName[i], data: temp_data,
                       events: { legendItemClick: function(event) {
                            show_hide_id = event.browserEvent.explicitOriginalTarget.data;
              			   this.visible ? this.chart.get(show_hide_id).hide() : this.chart.get(show_hide_id).show();}
                               }
                      };
    }
        for (i = 0; i < messagesList.length; i++) {
            var trueArray = [];
            n = 0;
            for (c = 0; c < selectedCategories.length; c++) {
                for (j = 0; j < messagesList[i].length; j++){ 
                    
                    if (selectedCategories[c] === 'Unhelpful Answer' || selectedCategories[c] === 'Neutral Answer' || selectedCategories[c] === 'Helpful Answer'){
                        temp = messagesList[i][j].getElementsByTagName('Answerquality')[0].childNodes[0].nodeValue;
                    } else {
                        temp = messagesList[i][j].getElementsByTagName(selectedCategories[c])[0].childNodes[0].nodeValue;
                    }
                    if (temp === 'true')
                    {
                        x = Number(messagesList[i][j].getElementsByTagName("MessageID")[0].childNodes[0].nodeValue);
                        y = Number(messagesList[i][j].getElementsByTagName("ScoreOverall")[0].childNodes[0].nodeValue);
                        trueArray[n] = [x, y];
                        n = n + 1;
                    }
                    // in case in 'Answerquality' we have 0 for 'Unhelpful Answer', 1 for 'Neutral Answer' and 2 for 'Helpful Answer'   
                    else if (temp != 'false'){
                        x = Number(messagesList[i][j].getElementsByTagName("MessageID")[0].childNodes[0].nodeValue);
                        y = Number(messagesList[i][j].getElementsByTagName("ScoreOverall")[0].childNodes[0].nodeValue);
                        trueArray[n] = [x, y];
                        n = n + 1;
                    }
                }
            }
            if (selectedCategories.length === 1){
                lineData[lineData.length] = {type: 'scatter', data: trueArray, id: playerName[i], color: selectedColor[0], name: playerName[i], showInLegend: false, marker: {symbol: selectedSymbol[0]}};
            } else {
                lineData[lineData.length] = {type: 'scatter', data: trueArray, id: playerName[i], color: 'rgb(255, 0, 102)', name: playerName[i], showInLegend: false, marker: {symbol: 'triangle'}};
            }
        }
    return {seriesData: lineData};
    
}



function lineChartFormatter(name, MessageID, selectedCategories, selectedColor) { 
    var i, txtTemp="", tagName;
    for (i = 0; i < messagesList.length; i++){ 
        if (messagesList[i][0].getElementsByTagName("PlayerName")[0].childNodes[0].nodeValue === name){
            for (j = 0; j < selectedCategories.length; j++) {
                if (selectedCategories[j] === 'Unhelpful Answer' || selectedCategories[j] === 'Neutral Answer' || selectedCategories[j] === 'Helpful Answer'){
                    tagName = 'Answerquality';
                } else {
                    tagName = selectedCategories[j];
                }
                if (messagesList[i][MessageID].getElementsByTagName(tagName)[0].childNodes[0].nodeValue === "true"){
                    txtTemp = txtTemp + '<br><p style="color:' + selectedColor[j] + ';">' + selectedCategories[j] + ': True</p>'
                }
                else if (messagesList[i][MessageID].getElementsByTagName(tagName)[0].childNodes[0].nodeValue === "0" && selectedCategories[j] === 'Unhelpful Answer') {
                    txtTemp = txtTemp + '<br><p style="color:' + selectedColor[j] + ';">' + 'Unhelpful Answer' + '</p>'
                }
                else if (messagesList[i][MessageID].getElementsByTagName(tagName)[0].childNodes[0].nodeValue === "1" && selectedCategories[j] === 'Neutral Answer') {
                    txtTemp = txtTemp + '<br><p style="color:' + selectedColor[j] + ';">' + 'Neutral Answer' + '</p>'
                }
                else if (messagesList[i][MessageID].getElementsByTagName(tagName)[0].childNodes[0].nodeValue === "2" && selectedCategories[j] === 'Helpful Answer') {
                    txtTemp = txtTemp + '<br><p style="color:' + selectedColor[j] + ';">' + 'Helpful Answer' + '</p>'
                }
            }
        }
    }
    return txtTemp
}

function notepadEditor() 
{
    clearNote();
var cellIndexMapping = {
    0 : true
    };

$("#ParticipantsTable tr").each(function (rowIndex) {
    $(this).find("td").each(function (cellIndex) {
        if (cellIndexMapping[cellIndex]) {
            var pName = $(this).text();
			if (/\s/.test(pName)) {
			pName=pName.replace(/^\s+|\s+$/gm,'');
			pName = pName.replace(/\s+/g, '_');
			}
            var area = "Area" + pName;
            createTab(pName);
            new nicEditor({
                fullPanel : true,
                maxHeight : 300,
                onSave : function (content, id, instance) {
				
				        Cookies.set(pName, content, { expires: 365 });
						alert('Content saved');
								
                }
            }).panelInstance(area);
            var pnote = Cookies.get(pName);
			$('#tab' + pName + ' .nicEdit-main').html(pnote);

        }
    });
});
}
      
        function createTab(pName) {
            var textArea = '<textarea cols="53" id="Area' + pName + '" style="width:440px; height:400px; display:block;" ></textarea>';
                 if ($('#tab' + pName).length == 0) { //checks if the tab already exists
                    $('#tabs').append('<li><a href="#tab' + pName + '">' + pName + '</a></li>');
                    $('.NoteTabs').append('<div class="container" id="tab' + pName + '" name= "'+ pName +'">' + textArea + '</div>');
                    
                    $('#tabs li a:not(:first)').addClass('inactive');
                    $('.container:not(:first)').hide();
                    $('#tabs li a').click(function () {
                        var t = $(this).attr('href');
                        if ($(this).hasClass('inactive')) { //added to not animate when active
                            $('#tabs li a').addClass('inactive');
                            $(this).removeClass('inactive');
                            $('.container').hide();
                            $(t).fadeIn('slow');
                        }
                        return false;
                    }) 
                } 
        }

        function clearNote() //call this function to clean the notepad container
        {
            $('#tabs li').remove();
            $('div .container').remove();
        }

       

 