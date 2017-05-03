# Synonyme
Alexa Synonym Finder in German 

Alexa Skill written in NodeJS ready to host on AWS Lambda ! 
This skils uses openthesarus api to fetch the synonyms for given name and truncate resulst in to few words for each request. 


For a List_OF_Keywords Slot I've prepared a list based on SQL Dump of Openthesarus. I've selected 1800 normalised words based on random choice.

Next Steps:
-Use NLTK Python Script to filter granulary word list from Openthesarus (50k entries), to select only the verbs and nouns.



API
https://www.openthesaurus.de/about/api
