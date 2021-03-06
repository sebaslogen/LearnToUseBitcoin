source 'https://rubygems.org'
source 'https://rails-assets.org'

ruby '2.3.0'
# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.0.1'

# Use SCSS for stylesheets
gem 'sass-rails', '~> 4.0.0'

# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'

# Use CoffeeScript for .js.coffee assets and views
gem 'coffee-rails', '~> 4.0.0'

# See https://github.com/sstephenson/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby # Linux doesn’t have a built-in JavaScript interpreter and some distros require this

# Use jquery as the JavaScript library
gem 'jquery-rails'

# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
gem 'turbolinks'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 1.2'

# Are you a Human? play-captcha
gem 'ayah_integration'

# Manage a Coinbase account
gem 'coinbase'

#group :doc do
  # bundle exec rake doc:rails generates the API under doc/api.
  #gem 'sdoc', require: false
#end

# Use ActiveModel has_secure_password
# gem 'bcrypt-ruby', '~> 3.1.2'

# Use unicorn as the app server
# gem 'unicorn'

# Use Capistrano for deployment
# gem 'capistrano', group: :development

# Use debugger
# gem 'debugger', group: [:development, :test]


# App specific gems
#gem 'activerecord-tableless' # helps to use Rails without a database
gem 'figaro' # configuration framework
gem 'gibbon' # access to the MailChimp API
# gem 'google_drive' # use Google Drive spreadsheets for data storage (if needed)
gem 'high_voltage' # for static pages like “about”
gem 'simple_form' # forms made easy
gem 'compass-rails'#, '~> 2.0.alpha.0' # support for Zurb Foundation
#gem 'zurb-foundation' # 4.x version
gem 'foundation-rails' # 5.x version
gem 'foundation-icons-sass-rails' # Foundation Icon Fonts on SASS for Rails
gem 'rails-assets-angular' # AngularJS library
gem 'analytics-ruby', '~>1.0' # Segment.io analytics
gem 'http_accept_language' # Detect client selected language
gem 'i18n-js' # Add Rails internationalization support for JavaScript
gem 'mobile-fu' # Detect user agent for mobiles/tablets on server side
group :test do
  gem 'rspec-rails-mocha', '~> 0.3.1', :require => false
end
group :development, :test do
  gem 'rspec-rails', '~> 3.0.0.beta'
  gem 'rails-assets-angular-mocks'
  gem 'codeclimate-test-reporter', require: nil
end
group :development do
  gem 'better_errors' # helps when things go wrong
  gem 'quiet_assets' # suppresses distracting messages in the log
  gem 'rails_layout' # generates files for an application layout
  gem 'sqlite3' # Use sqlite3 as the database for Active Record in Nitrous.io development environment
  gem 'travis-lint' # Travis-CI config validation script
  gem 'travis' # Travis-CI to encrypt data
end
group :production do
  gem 'pg' # PostgreSQL (Heroku doesn´t support SQLlite)
  gem 'rails_12factor' # Heroku requires this to support logging and server CSS/JS assets correctly
  gem 'thin' # Thin web server
  gem 'heroku-deflater' # Use compressed assets
end
