require 'exceptions'

class VisitorsController < ApplicationController
  
  before_action :check_captcha, only: [:show]
 
  def show
    Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}-#{cn}: Good, received email #{params[:email]}" ######################################################## TODO: Test code
    search = Visitor.where(ip: request.remote_ip)
    
    if search.empty?
      # Associate visitor to wallet and show new wallet
      Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}-#{cn}: Good, search for IP #{request.remote_ip} didn't find any previous visitor in DB" ######################################################## TODO: Test code
      @visitor = Visitor.new(ip: request.remote_ip)
      
      begin
        @wallet = Wallet.associate_with_visitor!(@visitor)
        if @wallet
          # TODO: Register event for statistics
          Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}-#{cn}: Visitor with new wallet saved in DB" ######################################################## TODO: Test code
          render action: 'show', :layout => false
        else
          show_error("#{GlobalConstants::DEBUG_MSG}-#{cn}: Error linking wallet to visitor in DB",
            "Our monkeys made a mess again and created a magic error linking wallet to visitor in DB", true)
        end
      rescue ActiveRecord::ActiveRecordError => e
        show_error("#{GlobalConstants::DEBUG_MSG}-#{cn}: Error, Not possible to interact with DB. Error:#{e}-#{e.message}",
            "Our monkeys made a mess and could not access the database. Contact invitations@leartousebitcoin.com", true)
      rescue Exceptions::NoVisitorError
        show_error("#{GlobalConstants::DEBUG_MSG}-#{cn}: Error, Not possible to create a new Visitor (recieved nil from call to new)",
            "Our monkeys made a mess and could not create a new record for you, our precious visitor. Contact invitations@leartousebitcoin.com", true)
      rescue Exceptions::NoFreeWalletsAvailable
        flash_message = "Our monkeys discovered there are no more wallets in the DB, \
wait until the master monkey refills it and come back or \
contact her directly at invitations@leartousebitcoin.com" # TODO: Improve message and UX flow
        show_error("#{GlobalConstants::DEBUG_MSG}-#{cn}: Error, no available wallets in DB", flash_message, true)
      end
    else # Do not show wallet
      # TODO: proper render of message or page
      show_error("#{GlobalConstants::DEBUG_MSG}-#{cn}: Not showing again wallet of existing visitor",
          "Our super monkeys detected that you already received a wallet with some Bitcoins before", # TODO improve messaging and UX flow
          true)
    end
  end 
         
  def test_delete_visitor
    visitor = Visitor.where(ip: request.remote_ip).take
    unless visitor
      Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}-#{cn}: Visitor to delete found #{visitor.ip}" ######################################################## TODO: Test code
      visitor.wallets.destroy_all
      visitor.destroy
    end
    redirect_to root_path # halts request cycle
  end
  
  private
  def cn
    self.class.name
  end
    
  def check_captcha
    if not check_ayah_passed(request.remote_ip)
      show_error(false,
          "Our monkeys detected that you didn't pass the Human test. Don't worry our monkeys fail too, just try again and have fun!", true)
    end
  end
    
  def check_ayah_passed(ip)
    session_secret = params['session_secret'] # in this case, using Rails
    ayah = AYAH::Integration.new(ENV['AREYOUAHUMAN_PUBLISHER_KEY'], ENV['AREYOUAHUMAN_SCORING_KEY'])
    return ayah.score_result(session_secret, ip)
  end

  def show_error(log_error_message, flash_error_message, redirect_to_root = false)
    Rails.logger.error log_error_message if log_error_message
    flash[:error] = flash_error_message if flash_error_message
    redirect_to root_path if redirect_to_root # halts request cycle
  end
end
