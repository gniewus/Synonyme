#!/bin/bash

rm -f talos.zip
zip -r talos.zip *
aws lambda update-function-code --function-name talosSkillApril --zip-file fileb://./talos.zip --publish

