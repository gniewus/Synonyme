'use strict';
var config = require('./configuration');
var constants = require("./constants")


var eventHandlers={
   'NewSession' : function () {
        this.handler.state = constants.states.ASK_MODE;

        /*
         *  If request type is LaunchRequest : Give welcome message
         *  Else If request type is IntentRequest : Call the specific intent directly
         *  Else : do nothing.
         */

        if (this.event.request.type === 'LaunchRequest') {

            this.emit('welcome'); //TODO: WELCOME EVENT

        } else if (this.event.request.type === 'IntentRequest') {
            var intentName = this.event.request.intent.name;

            this.emitWithState(intentName);
        } else {
            this.emit("Unhandheld")
            console.log('Unexpected request : ' + this.event.request.type);
        }
    },
    'EndSession' : function (message) {
        /*
         *  If favorite file present : delete it
         *  If SessionEndedRequest : emit ':saveState'
         *  Else emit ':tell'
         */
        
        this.handler.state = '';

        this.emit(":tell", message);


        //TODO Ending the session

    },

};



module.exports = eventHandlers;

function deleteAttributes() {
    Object.keys(this.attributes).forEach((attribute) => {
        delete this.attributes[attribute];
});
}
