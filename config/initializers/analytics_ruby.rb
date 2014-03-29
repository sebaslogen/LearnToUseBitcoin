Analytics = AnalyticsRuby       # Alias for convenience
Analytics.init({
  secret: 'ddgl3j4f48',          # The write key for neoranga/leantousebitcoin
  on_error: Proc.new { |status, msg| print msg }  # Optional error handler
})