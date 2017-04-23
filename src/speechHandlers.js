'use strict';

var config = require('./configuration');
var constants = require("./constants");
var topicHelper = require('./topicHelper.js')
var topicHelp = new topicHelper();
var _=require('lodash');


var speechHandlers = {
    

     'welcome': function () {
        // Output welcome message with card
        var message = config.welcome_message
            + constants.breakTime['100'] +
            'Du kannst mir nach die Synonyme für das gewünschte Wort fragen';


        var cardTitle = 'Willkomen bei SynonymSuche';
        var cardContent = 'Frag mich nach ein begriff und ich finde die Synonyme dafür ! ';
         var imageObj = {
            smallImageUrl: 'https://www.publicispixelpark.de/fileadmin/templates/images/logo_pub_pix.png',
            largeImageUrl: 'https://www.publicispixelpark.de/fileadmin/templates/images/logo_pub_pix.png'
        };

           
        this.emit(':askWithCard', message, message,cardTitle,cardContent,imageObj);

    },
    "formSynonyms": function(list){


        let repromt = ' Soll ich weiter aufzählen ?';
        var message = formatSynonymsResponse(list,this.attributes['Keyword'])
         this.attributes['data']=list.slice(5,list.length);
        this.emit(':ask', message, repromt);
    },

    "formFurtherSynonyms": function (list) {
        
        this.attributes['data']=list;
          var repromt;
        if(list.length >5){
            var repromt = "Du kannst mir weitere fragen stellen oder, Soll ich weiter aufzählen? ";
        }else {
            repromt="Du kannst mir nach andere Wörter fragen";
        }
        var message = formatFurtherSynonymsResponse(list,this.attributes['Keyword']);
        this.emit(':ask', message, repromt);
    }
}


function formatSynonymsResponse(data, keyword) {
    if(data.length>5){
        data=data.slice(0, 5);
    }
    return _.template("Synonyme für ${topic} sind zum beispiel: ${data} .")({
        topic: keyword, // TODO merc is local variable for this file
        data: data,
    });
}



function formatFurtherSynonymsResponse(data, keyword) {
    if(data.length>5){
        data=data.slice(0, 5);
    }
    return _.template("Weitere Synonyme für ${topic} sind zum beispiel: ${data} .")({
        topic: keyword, // TODO merc is local variable for this file
        data: data,
    });
}

module.exports = speechHandlers;