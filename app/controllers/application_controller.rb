class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_filter :set_locale
  
  private
  def set_locale
    I18n.locale = http_accept_language.compatible_language_from(I18n.available_locales)
    if params[:locale] # Manually select language with URL ruquest parameter, e.g. /?locale=en
      if I18n.available_locales.include?(params[:locale].to_sym)
        I18n.locale = params[:locale]
      elsif I18n.available_locales.include?(params[:locale].split('-')[0].to_sym)
        I18n.locale = params[:locale].split('-')[0] # Try with generic language, e.g. select 'en' if 'en-US' is selected
      end
    end
  end  
end
