require 'exceptions'
require 'net/http'
require 'uri'
require 'json'

class Blockchaindotinfo
  
  attr_reader :guid, :link
  
  def initialize( private_key_to_import, address_label = nil, password = nil, email = nil)
    
    @password = password ? password : ENV['DEFAULT_BLOCKCHAINDOTINFO_PASSWORD']
    api_key = ENV['BLOCKCHAINDOTINFO_API_KEY']
    request_url = Blockchaindotinfo.build_URL('/api/v2/create_wallet')
    # build the params string
    post_args = { password: @password, api_code: api_key, priv: private_key_to_import }
    post_args[:email] = email if email
    post_args[:label] = address_label if address_label
    # send the request
    resp, data = Net::HTTP.post_form( URI.parse( request_url ), post_args )
    if (! resp) || (! resp.body) || (resp.body.size == 0)
      raise Exceptions::BlockchainDotInfoWalletCreationError, "Response from Blockchain.info was empty calling URL #{request_url}"
    end
    case resp.code.to_i 
    when 200
      begin
        parse_new_wallet_JSON( resp.body )
        generate_address( 'Deposit address' )
      rescue JSON::ParserError
        raise Exceptions::BlockchainDotInfoWalletCreationError, "Error parsing JSON response from Blockchain.info, response was:#{resp.body if resp}"
      end
    else
      raise Exceptions::BlockchainDotInfoWalletCreationError, "Response from Blockchain.info was an error #{resp.code} calling URL #{request_url}. Response body:#{resp.body if resp}"
    end
  end
  
  def self.send_money(guid, dest_address, amount, fee = nil, password = nil)
    request_url = Blockchaindotinfo.build_URL( "/merchant/#{guid}/payment" )
    password = password ? password : ENV['DEFAULT_BLOCKCHAINDOTINFO_PASSWORD']
    # build the params string
    amount = (amount / Float(ENV['SATOSHI'])).to_i # Set amount to Satoshis for Blockchain.info API
    
    post_args = { password: password, to: dest_address, amount: amount }
    post_args[:fee] = fee if (fee) && (fee.to_f > 0)
    # send the request
    resp, data = Net::HTTP.post_form( URI.parse( request_url ), post_args )
    puts resp
    puts resp.header
    puts resp.body
    if resp.code.to_i != 200
      Rails.logger.error "#{GlobalConstants::DEBUG_MSG}-#{cn}: Error sending money to #{dest_address} in Blockchain.info wallet guid #{guid}. Response:#{resp.body if resp}"
      raise Exceptions::BlockchainDotInfoWalletSendMoneyError, "Response from Blockchain.info was #{resp.code} when calling URL #{request_url}"
    end
    if (! resp) || (! resp.body) || (resp.body.size == 0)
      raise Exceptions::BlockchainDotInfoWalletSendMoneyError, "Response from Blockchain.info was empty calling URL #{request_url}"
    end
    begin
      resp_msg = JSON.parse( resp.body )
      if ( resp_msg.include?( 'error' ) )
        raise Exceptions::BlockchainDotInfoWalletSendMoneyError, "Error response from Blockchain.info, response was:#{resp_msg['error']}"
      elsif ( resp_msg.include?( 'message' ) && resp_msg['message'].downcase.include?('sent') )
        return true
      else
        raise Exceptions::BlockchainDotInfoWalletSendMoneyError, "Error response from Blockchain.info, response was:#{resp_msg}"  
      end
    rescue JSON::ParserError
      raise Exceptions::BlockchainDotInfoWalletSendMoneyError, "Error parsing JSON response from Blockchain.info, response was:#{resp.body if resp}"
    end
  end
  
  
  
  def self.send_test
    guid = 'eccb6fe8-9ac6-41e9-867e-f523dca7c4d9'
    dest_address = '1Jtyqx79yWRjQmTQTbhHysm1tx953cJcMV'
    amount = 0.0001
    Blockchaindotinfo.send_money(guid, dest_address, amount)
  end  
  
  def self.create_test
    private_key_to_import = '5KLTJs1vWcBjCWgNAfTpstNdSvuKZvnDouoVx2BET2JmAaeWt47' # Real test
    address_label = 'First free bitcoins from www learntousebitcoin com  Do not use this address to receive money'
    Blockchaindotinfo.new(private_key_to_import, address_label)
  end


  def self.get_BTC_price( currency = 'USD' )
    exchange_rate = nil
    begin
      cb_bank = Money::Bank::Coinbase.new
      cb_bank.fetch_rates! # Call this before calculating exchange rates, it will download the rates from CoinBase
      exchange_rate = cb_bank.exchange_with(Money.new(1000000, :BTC), currency.to_sym).fractional # Price of 1 BTC in currency
    rescue => e
      Rails.logger.warn "#{GlobalConstants::DEBUG_MSG}-#{cn}: Error getting exchange rate from Coinbase. Error message: #{e.message} - Response:#{resp.body if resp}"
    end
    return exchange_rate
  end
  
  private
  def parse_new_wallet_JSON( response )
    data = JSON.parse( response )
    if data['guid']
      @guid = data['guid']
      @link = data['link'] ? data['link'] : nil
    else
      raise Exceptions::BlockchainDotInfoWalletCreationError, "Error parsing JSON response from Blockchain.info, response didn't include guid:#{data}"
    end
  end
  
  def generate_address( label = nil )
    request_url = Blockchaindotinfo.build_URL( "/merchant/#{@guid}/new_address" )

    # build the params string
    post_args = { password: @password }
    post_args[:label] = label if label
    # send the request
    resp, data = Net::HTTP.post_form( URI.parse( request_url ), post_args )
    if resp.code.to_i != 200
      Rails.logger.error "#{GlobalConstants::DEBUG_MSG}-#{cn}: Error creating new address in Blockchain.info wallet. Response:#{resp.body if resp}"
    end
    if (! resp) || (! resp.body) || (resp.body.size == 0)
      raise Exceptions::BlockchainDotInfoWalletCreationError, "Response from Blockchain.info was empty calling URL #{request_url}"
    end
  end
  
  def self.build_URL( handler )
    ENV['BLOCKCHAINDOTINFO_API_URL'] + handler
  end
  
  def cn
    self.class.name
  end
end
