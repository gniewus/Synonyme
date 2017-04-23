var config = require('./configuration');
var constants = require('./constants');
var _ = require('lodash');
var request = require('request');
var http = require('http');
//var s3Helper = require('./s3Helper');
var topicHelper = require('./topicHelper.js');
var topicHelp = new topicHelper();
var https = require('https');
var rp = require('request-promise')


var intentHandlers = {
    'SynonymsIntent': function () {
        let kword = this.attributes['Keyword'];
        // var data = topicHelp.resolveSynonym(kword);
            var url = 'https://www.openthesaurus.de/synonyme/search?q=' + encodeURI(kword) + '&format=application/json';

          var options = {
        uri: url,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
    };
        rp(options)
            .then((repos)=> {
                this.attributes.data= repos;
                console.log(repos);
                console.log(repos.synsets);
                var list = feedParser(repos);
                this.attributes['data']= list;

                this.emit("formSynonyms",list);

            })
            .catch( (err)=> {
                console.log(err);
                this.emit(':ask', "Dafür habe ich leider kein Synonym gefunden", "Frag mich bitte noch mal ");
            });

   
    },
    'Unhandled': function () {
        this.emit(':ask', "Ich habe leider dich gar nicht verstanden", "Frage mich bitte noch mal ");
    },
};



module.exports = intentHandlers;


function feedParser(data) {

    var sets = data.synsets.length;
   console.log("Synsets :"+data.synsets.length);
    var list= new Array;
    for (var index = 0; index < sets-1; index++) {
    _.map(data.synsets[index].terms,  (obj)=>{
        list.push(obj.term);
    });
    }
 
    console.log("First meaning contains :"+list.length);
    return list;
}

/*

            https.get(url).on('response', (res, data, body) => {

                console.log(response.headers['content-type']) // 'image/png' 
                list = JSON.parse(body)
                return list;
            })*/

