#!/bin/bash                                                                                                                                                                                                                                                                       
set -e
key=`grep "CROWDIN_KEY" config/application.yml | cut -d" " -f2 | sed 's/\"//g'`
curl http://api.crowdin.net/api/project/learn-to-use-bitcoin/export?key=${key}
#Download all translations as a single ZIP archive.
wget http://api.crowdin.net/api/project/learn-to-use-bitcoin/download/all.zip?key=${key} -O all.zip
unzip -o all.zip -d config/locales/
rm all.zip
