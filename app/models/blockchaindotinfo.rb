require 'exceptions'
require 'net/http'
require 'uri'
require 'json'

class Blockchaindotinfo
  
  attr_reader :guid, :link
  
  def initialize( password, private_key_to_import, address_label = nil, email = nil)
    
    @password = password
    api_key = ENV['BLOCKCHAINDOTINFO_API_KEY']
    request_url = build_URL('/api/v2/create_wallet')
    # build the params string
    post_args = { password: password, api_code: api_key, priv: private_key_to_import }
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
  
  def self.c_test
    private_key_to_import = '5KLTJs1vWcBjCWgNAfTpstNdSvuKZvnDouoVx2BET2JmAaeWt47' # Real test
    address_label = 'First free bitcoins from www learntousebitcoin com  Do not use this address to receive money'
    Blockchaindotinfo.new('learntousebitcoin.com', private_key_to_import, address_label)
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
    api_key = ENV['BLOCKCHAINDOTINFO_API_KEY']
    request_url = build_URL( "/merchant/#{@guid}/new_address" )

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
  
  def build_URL( handler )
    ENV['BLOCKCHAINDOTINFO_API_URL'] + handler
  end
  
  def cn
    self.class.name
  end
end
