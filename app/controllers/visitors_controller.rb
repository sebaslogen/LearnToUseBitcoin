require 'exceptions'

class VisitorsController < ApplicationController
  
  before_action :check_captcha, only: [:show]
 
  def show
    search = Visitor.where(ip: request.remote_ip)
    if search.empty?
      # Associate visitor to wallet and show new wallet
      Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}-#{cn}: Good, search for IP #{request.remote_ip} didn't find any previous visitor in DB" ######################################################## TODO: Test code
      @visitor = Visitor.new(ip: request.remote_ip)
      begin
        @wallet = Wallet.associate_with_visitor(@visitor.id)
        if @wallet
          if @visitor.save
            # TODO: Register event for statistics
            Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}-#{cn}: Visitor with new wallet saved in DB" ######################################################## TODO: Test code
            render action: 'show', :layout => false
          else
            # TODO: Revert wallet association as the visitor is not recorded and the wallet is not delivered to visitor
            Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}-#{cn}: Error saving new visitor to DB with IP:#{request.remote_ip}" ######################################################## TODO: Test code
            flash[:error] = "Our monkeys made a mess again and created a magic error saving new visitor to DB with IP:#{request.remote_ip}"
            redirect_to root_path # halts request cycle
          end
        else
          Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}-#{cn}: Error linking wallet to visitor in DB" ######################################################## TODO: Test code
          flash[:error] = "Our monkeys made a mess again and created a magic error linking wallet to visitor in DB"
          redirect_to root_path # halts request cycle
        end
      rescue Exceptions::NoFreeWalletsAvailable
        Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}: Error, no available wallets in DB" ######################################################## TODO: Test code
        flash[:error] = "Our monkeys discovered there are no more wallets in the DB, \
wait until the master monkey refills it and come back or \
contact her directly at invitations@leartousebitcoin.com" # TODO: Improve message and UX flow
        redirect_to root_path # halts request cycle
      end
    else # Do not show wallet
      # TODO: proper render of message or page
      Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}-#{cn}: Not showing again wallet of existing visitor" ######################################################## TODO: Test code
      flash[:error] = "Our super monkeys detected that you already received a wallet with some Bitcoins before" # TODO improve messaging and UX flow
      redirect_to root_path # halts request cycle
    end
  end 
      
  private
  def cn
    self.class.name
  end
    
  def check_captcha
    if not check_ayah_passed(request.remote_ip)
      flash[:error] = "Our monkeys detected that you didn't pass the Human test. Don't worry our monkeys fail too, just try again and have fun!"
      redirect_to root_path # halts request cycle
    end
  end
    
  def check_ayah_passed(ip)
    session_secret = params['session_secret'] # in this case, using Rails
    ayah = AYAH::Integration.new(ENV['AREYOUAHUMAN_PUBLISHER_KEY'], ENV['AREYOUAHUMAN_SCORING_KEY'])
    return ayah.score_result(session_secret, ip)
  end
end
