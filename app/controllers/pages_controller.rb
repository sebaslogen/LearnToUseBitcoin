class PagesController < HighVoltage::PagesController
  layout :layout_for_page
  before_filter :set_locale
  has_mobile_fu false # Add mobile/tablet User Agent detection helper classes

  private
  def set_locale
    I18n.locale = http_accept_language.compatible_language_from(I18n.available_locales)
  end
  
  private
  def layout_for_page
    case params[:id]
    when '_demo'
      false
    when '_demo-small'
      false
    when '_mining'
      false
    when '_mining-POW'
      false
    when '_animation'
      false
    else
      'application'
    end
  end
end