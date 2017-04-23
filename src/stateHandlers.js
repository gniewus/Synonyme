'use strict';

var Alexa = require('alexa-sdk');
var config = require('./configuration');
var constants = require("./constants");
var _ = require("lodash");
var configuration = require('./configuration.js')
var topicHelper = require('./topicHelper.js')
var topicHelp = new topicHelper();


var stateHandlers = {
    askModeIntentHandlers: Alexa.CreateStateHandler(constants.states.ASK_MODE, {

     "getSynonyms": function () {
                
                if(_.has(this.event.request.intent.slots.Keyword,"value")){
                
                    const keyword = this.event.request.intent.slots.Keyword.value;
                    this.attributes['Keyword']= keyword;
                    this.emit('SynonymsIntent');
                    

                }else{
                    this.emit(":ask", "Leider habe ich das Wort nicht verstanden, frag mich noch mal");
                }
                
            },
     
 

    'AMAZON.HelpIntent': function () {
            let message = "Ich kann dir ein Synonym für das gewünschte wort ausuchen. Frag mich zum beispiel, nach synonym für. laufen";
            this.emit(":ask",message,message);
    },
    'AMAZON.StopIntent': function () {
        this.emit('EndSession', 'Auf Wiederhören! ');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('EndSession', 'Auf Wiederhören!  ');
    },
    'AMAZON.YesIntent': function () {
        if(!_.isEmpty(this.attributes['data'])) {
            var list = this.attributes['data'];
            if (list.length>5){
                this.attributes['data']=list.slice(5,list.length);

                this.emit("formFurtherSynonyms",list)
            }else {

                this.emit(":tell","Ich kenne leider keine andere synonyme dafür.")
            }
        }   
    },
    'AMAZON.NoIntent': function () {
        this.emit('EndSession', 'Auf Wiederhören!  ');
    },

    'SessionEndedRequest': function () {
        this.emit('EndSession', constants.terminate);
    },
    'Unhandled': function () {
        this.emit(':ask', "Ich habe leider dich nicht verstanden", "Frage mich bitte noch mal ");
    },
   }),

}

module.exports = stateHandlers;
