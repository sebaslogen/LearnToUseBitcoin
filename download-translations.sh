#!/bin/bash                                                                                                                                                                                                                                                                       
set -e
key=`grep "CROWDIN_KEY" config/application.yml | cut -d" " -f2 | sed 's/\"//g'`
curl http://api.crowdin.net/api/project/learn-to-use-bitcoin/export?key=${key}
#Download all translations as a single ZIP archive.
wget http://api.crowdin.net/api/project/learn-to-use-bitcoin/download/all.zip?key=${key} -O all.zip
unzip -o all.zip -d config/locales/
rm all.zip
cd config/locales/
list=`find . -name "strings.yml"`
for file in ${list}; do
  directory=`dirname ${file}`
  if [ -d ${directory} ] && [ ! `echo ${directory} | grep "en"` ]; then
    echo "Comparing ${directory} with english"
    if [ `diff ${file} en/strings.yml | wc -l` -lt 50 ]; then
      echo "${directory} will be removed because it doesn't contain enough translated texts"
      rm -R ${directory}
    fi
  fi
done
cd -