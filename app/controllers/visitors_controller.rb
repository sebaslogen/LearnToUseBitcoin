class VisitorsController < ApplicationController
  
  before_action :check_captcha, only: [:show]
  
  def check_captcha
    session_secret = params['session_secret'] # in this case, using Rails
    ayah = AYAH::Integration.new(ENV['AREYOUAHUMAN_PUBLISHER_KEY'], ENV['AREYOUAHUMAN_SCORING_KEY'])
    ayah_passed = ayah.score_result(session_secret, request.remote_ip)
    Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}-#{cn}: IP is: #{request.remote_ip}"
    Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}-#{cn}: Test is: #{ayah_passed}"
    if not ayah_passed
      flash[:error] = "Our super moneys detected that you already received a wallet with some Bitcoins before" # TODO improve messaging and UX flow
      redirect_to root_path # halts request cycle
    end
  end
  
  def show
    search = Visitor.where(ip: request.remote_ip)
    if search.empty?
      # Associate visitor to wallet and show new wallet
      Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}-#{cn}: Good, search for IP #{request.remote_ip} didn't find any previous visitor in DB" ######################################################## TODO: Test code
      @visitor = Visitor.new(ip: request.remote_ip)
      if @visitor.save
        @wallet = Wallet.associate_with_visitor(@visitor.id)
        if @wallet
          # TODO: Register event for statistics
          Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}-#{cn}: It worked!" ######################################################## TODO: Test code
          render action: 'show', :layout => false
        else
          Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}-#{cn}: Error linking wallet to visitor in DB" ######################################################## TODO: Test code
          flash[:error] = "You must be logged in to access this section"
          redirect_to root_path # halts request cycle
        end
      else
        Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}-#{cn}: Error saving new visitor to DB with IP:#{request.remote_ip}" ######################################################## TODO: Test code
        flash[:error] = "You must be logged in to access this section"
        redirect_to root_path # halts request cycle
      end
    else # Do not show wallet
      # TODO: proper render of message or page
      Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}-#{cn}: Not showing again wallet of existing visitor" ######################################################## TODO: Test code
      flash[:error] = "You must be logged in to access this section"
      redirect_to root_path # halts request cycle
    end
  end 
      
  private
  def cn
    self.class.name
  end
  
end