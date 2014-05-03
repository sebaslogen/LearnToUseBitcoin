#!/bin/bash                                                                                                                                                                                                                                                                       
rake i18n:js:export 
mv public/javascripts/translations.js app/assets/javascripts/common/
