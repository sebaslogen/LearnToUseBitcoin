class PagesController < HighVoltage::PagesController
  layout :layout_for_page

  private

  def layout_for_page
    case params[:id]
    when '_demo'
      false
    when '_demo-small'
      false
    else
      'application'
    end
  end
end