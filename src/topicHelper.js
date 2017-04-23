var _ = require('lodash');
var fs = require('fs');
var stringSimilarity = require('string-similarity');
var roundTo = require('round-to');
var config = require("./configuration")
var constants = require("./constants");
var request = require('request');

/*var globalData1 = JSON.parse(dataHelper.data);
console.log(globalData);*/

var globalData = [{
    "Topic": "Audi",
    "Synonyms": "300477",
    "Positiv": "24959",
    "PositivPro": "0.083",
    "Negativ": "6385",
    "NegativPro": "0.021",
    "Neutral": "269221",
    "NeutralPro": "0.896",
    "Male": "0.54",
    "Female": "0.46",
    "MostPopularAgeGroups": "25-34, 18-24, 55-64",
    "MostPopularAgeGroupsProcentual": "0.2, 0.18, 0.14 ",
    "AverageAge": "33", // Floor rounded number with age, (i can compute it somehow by myself );
    "Posts with Age": "597.51",
    "PostWithAgeProcentual": "0.34",
    "MainInterests": "Frauen,  Partys, Travel, Family, Automotive, Religion",
    "Tweet": " Woooah die neue fünfer is abgefahren ! " // One of two tweets separated with @
}, {
    "Topic": "Mercedes",
    "Synonyms": "300477",
    "Positiv": "24959",
    "PositivPro": "0.083",
    "Negativ": "6385",
    "NegativPro": "0.021",
    "Neutral": "269221",
    "NeutralPro": "0.896",
    "Male": "0.54",
    "Female": "0.46",
    "MostPopularAgeGroups": "25-34, 18-24, 55-64",
    "MostPopularAgeGroupsProcentual": "0.2, 0.18, 0.14 ",
    "AverageAge": "43", // Floor rounded number with age, (i can compute it somehow by myself );
    "Posts with Age": "597.51",
    "PostWithAgeProcentual": "0.34",
    "MainInterests": "Music,  Fashion, Travel, Family, Automotive, Religion",
    "Tweet": " Woooah die neue fünfer is abgefahren ! " // One of two tweets separated with @
}, {
    "Topic": "bmw",
    "Synonyms": "300477",
    "Positiv": "24959",
    "PositivPro": "0.053",
    "Negativ": "6385",
    "NegativPro": "0.011",
    "Neutral": "269221",
    "NeutralPro": "0.940",
    "Male": "0.64",
    "Female": "0.36",
    "MostPopularAgeGroups": "25-34, 18-24, 55-64",
    "MostPopularAgeGroupsProcentual": "0.2, 0.18, 0.14 ",
    "AverageAge": "22", // Floor rounded number with age, (i can compute it somehow by myself );
    "Posts with Age": "597.51",
    "PostWithAgeProcentual": "0.34",
    "MainInterests": "Music,  Fashion, Travel, Family, Automotive, Religion",
    "Tweet": " Woooah die neue fünfer is abgefahren ! " // One of two tweets separated with @
}];



var featureToSkill = {
    "man": ["männer", "mänlich", "mänliche anteil", "jungs", "man"],
    "female": ["frauen", "weiblich", "mädchen", "frau"],
    "twitter": ["twitt", "twitter", "tfitter", "beiträge", "beitrag", "tweets", "twitter posts", "populäre tweets"],
    "interessen": ["andere Interesen", "weitere interessen", "interesen", "interesiere", "leidenschaften"],
    "bias": ["positiv", "positive", "negativ", "negative", "balanciert", "neutral", "optimistisch", "gut", "böse", "kritisch", "skeptisch", " Besorgnis erregend"],
    "alter": ["durchschnittsalter", "alter", "im durchschnitt", "Mittelwert"],
    "ageGroups": ["altersgruppen", "alter gruppen", "populäre altersgruppen", "gruppen nach alter", "altersgruppe"]
};


function topicHelper() {
}



topicHelper.prototype.readJSONforTopic = function (topic) {

    //var globalData = JSON.parse(fs.readFileSync('data.txt', 'utf8'));
    //console.log(globalData);
    if (topic == "b. m. w.") {
        return _.find(globalData, { "Topic": "bmw" });
    } else if (topic) {

        var topicList = [];
        // console.log(globalData);
        globalData.forEach(function (line) {
            line.Topic = line.Topic.toLowerCase();
            topicList.push(line.Topic);
        });
        var naive = _.find(globalData, { "Topic": topic.toLowerCase() });

        if (naive) {
            return naive;
        } else {
            var matches = stringSimilarity.findBestMatch(topic.toLowerCase(), topicList);
            console.log(matches.bestMatch);
            if (matches.bestMatch.rating > 0.70) {
                return _.find(globalData, { "Topic": matches.bestMatch.target });

            } else {
                topic = topic.replace(/\./g, '').replace(/ /g, '');
                console.log(topic);
                var matches2 = stringSimilarity.findBestMatch(topic.toLowerCase(), topicList);
                console.log(matches2.bestMatch);
                if (matches2.bestMatch.rating > 0.70) {
                    return _.find(globalData, { "Topic": matches2.bestMatch.target });
                }

                return false;
            }
        }
    }
    return false;



    //console.log(globalData);

};


topicHelper.prototype.foundDataSampleforTopic = function (topic) {
    ///TODO export it to Data Helper
    var topicList;
    globalData.forEach(function (line) {
        line.Topic = line.Topic.toLowerCase();
        topicList.push(line.Topic);
    });


    var naiveSearch = _.find(data, { "Topic": topic.toLowerCase() });
    if (naiveSearch) {
        return naiveSearch;
    } else {
        var matches = stringSimilarity.findBestMatch(topic, topicList);
        console.log(matches.bestMatch);
        if (matches.bestMatch.rating > 0.85) {
            return _.find(globalData, { "Topic": matches.bestMatch.target });

        } else {
            topic = topic.replace(/\./g, '').replace(/ /g, '');
            console.log(topic);
            var matches2 = stringSimilarity.findBestMatch(topic, topicList);
            console.log(matches2.bestMatch);
            if (matches2.bestMatch.rating > 0.85) {
                return _.find(globalData, { "Topic": matches2.bestMatch.target });
            }

            return false;
        }


    }


};




topicHelper.prototype.formatGenderInfo = function (data) {

    if (getRandomInt(1, 2) == 1) {
        return _.template("Geschlechtverteilung für ${topic} sieht wie folgt aus: ${male} % sind  männer und ${female} % frauen")({
            male: data.Male * 100,
            female: data.Female * 100,
            topic: data.Topic
        });

    } else {

        return _.template("Menschen die über ${topic} reden sind, zu ${male} % männlich und zu ${female} % weiblich.")({
            male: data.Male * 100,
            female: data.Female * 100,
            topic: data.Topic
        });
    }
};


topicHelper.prototype.formatSynonymsAmount = function (data, period) {
    if (!period) { period = "" }
    return _.template("Das Begriff ${topic} wurde ${per} ${anzahl} mal genannt")({
        topic: data.Topic, // TODO merc is local variable for this file
        anzahl: data.Synonyms,
        per: period
    });
};



topicHelper.prototype.formatSynonymsDistribution = function (data, period) {
    return _.template("Davon waren ${positive} % positiv und  ${negative} % negativ ,der Rest äussert sich über"+data.Topic+"neutral ")({
        positive: roundTo(data.PositivPro * 100, 2),
        negative: roundTo(data.NegativPro * 100, 2)
    });
};


topicHelper.prototype.formatSynonymsTweet = function (data) {
    return _.template("OK ich zittiere ! ${tweet} ")({
        tweet: data.Tweet,
    });
};


topicHelper.prototype.resolveSynonym = function (keyword) {
    if (keyword) {
        
        var url = 'https://www.openthesaurus.de/synonyme/search?q=' + encodeURI(keyword) + '&format=application/json';


        request(url, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred 
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
            console.log('body:', body); // Print the HTML for the Google homepage. 
            list = JSON.parse(body)
            return list;
    });

    }
    return "";
};

topicHelper.prototype.formatSpeechForDetails = function (useCase, data) {
    switch (useCase) {
        case "man":
            return _.template("Mäner bilden ${male} % der Gesamtheit.")({
                male: data.Male * 100,
            });

        case "female":
            return _.template("Frauen bilden ${female} % der Gesamtheit.")({
                female: data.Female * 100,
            });
        case "twitter":
            return this.formatSynonymsTweet(data);
        case "interest":
            return this.formatSynonymsInterests(data);
        case "bias":
            return this.formatSynonymsDistribution(data);
        case "alter":
            return this.formatAgeDistribution(data);
        case "ageGroups":
            return this.formatAgeGroupsPrompt(data);
        default:
            return "Sorry es gab ein Fehler im meiner Denkweise";
    }
};
//This function takes feature and finds it's proper name for resolving 
//zb Feature "wie oft" -> gibt Anzahl züruck;
topicHelper.prototype.trimFeature = function (obj) {
   try {

    var result = obj;
    var features = Object.keys(config.featuresRich);
    features.forEach(function (feat, idx, liste) {
        var keys = Object.keys(config.featuresRich[feat]);
        var f = config.featuresRich[feat];

        for (var i = 0; i < keys.length; i++) {
            if (f[keys[i]].includes(obj)) {
                console.log("gefunden");
                console.log(keys[i]);
                result = keys[i]

            };
        }
    })
        return result;
   } catch (e) {
       console.log(e)
        return obj;
   }
};






topicHelper.prototype.getTopicsList = function (param) {
    var list = [];
    var data = param ? param : constants.globalData;
    data.forEach(function (sample) {
        console.log(sample.Topic);
        list.push(sample.Topic);
    });

    var smallLetters = _.mapValues(list, function (val) {
        if (typeof (val) === 'string') {
            return val.toLowerCase();
        }
        if (_.isArray(val)) {
            return _.map(val, _.method('toLowerCase'));
        }
    });
    var vals = Object.keys(smallLetters).map(key => smallLetters[key]);

    return vals;
};


topicHelper.prototype.formatSynonymsInterests = function (data) {

    return _.template("Wichtigste Interessen sind ${intere} ")({
        intere: data.MainInterests,
    });

};

topicHelper.prototype.formatAgeGroupsPrompt = function (data) {

    if (data.MostPopularAgeGroups) {

        var res = data.MostPopularAgeGroups.replace(" ", "").split(",");
        var prompt = "";
        res.forEach(function (val) {
            val = "von " + val.replace("-", " bis ") + " , ";
            prompt += val;
        })
        prompt += " jahre"
        return _.template("Die drei populärste Altersgruppen sind: ${age}")({
            age: prompt,
        });
    }
};

topicHelper.prototype.formatAgeDistribution = function (data) {

    return _.template("Das Durschnisttsalter in dieser Gruppe liegt bei ${age} Jahre")({
        age: data.AverageAge,
    });
};


/*topicHelper.prototype.formatAirportStatus = function(csvData) {

 if (airportStatus.delay === 'true') {
 var template = _.template('There is currently a delay for ${airport}. ' +
 'The average delay time is ${delay_time}. ' +
 'Delay is because of the following: ${delay_reason}. ${weather}');
 return template({
 airport: airportStatus.name,
 delay_time: airportStatus.status.avgDelay,
 delay_reason: airportStatus.status.reason,
 weather: weather
 });
 } else {
 //no delay
 return _.template('There is currently no delay at ${airport}. ${weather}')({
 airport: airportStatus.name,
 weather: weather
 });
}
} ;*/

module.exports = topicHelper;


//console.log(getFeatureList());



function getFeatureList() {
    var listOfFeatures = "";

    _.forOwn(featureToSkill, (sublist) => {
        var tmp = "";
        sublist.forEach((val) => {
            tmp += val + '\n';
        });
        listOfFeatures += tmp;
    });
    return listOfFeatures;

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
