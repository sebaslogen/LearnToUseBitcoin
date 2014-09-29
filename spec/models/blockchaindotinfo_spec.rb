require 'spec_helper'

RSpec.configure do |config|
  config.mock_framework = :mocha
  config.include CustomHelpers
  config.infer_spec_type_from_file_location!
end

describe Blockchaindotinfo do
  it 'creates an online wallet' do
    private_key_to_import = '5KLTJs1vWcBjCWgNAfTpstNdSvuKZvnDouoVx2BET2JmAaeWt47'
    address_label = 'First free bitcoins from www learntousebitcoin com  Do not use this address to receive money'
    bc = Blockchaindotinfo.new(private_key_to_import, address_label)
    expect( bc.guid.size ).to be > 1, "There should be a guid created. GUID:#{bc.guid}"
    expect( bc.link.size ).to be > 1, "There should be a link to the generated wallet. GUID:#{bc.link}"
  end
  
  context 'when the private wallet to import is invalid' do
    it 'fails to create an online wallet' do
      private_key_to_import = '5KLTJs1vWcBjCWgNAfTpstNdS'
      address_label = 'First free bitcoins from www learntousebitcoin com  Do not use this address to receive money'
      expect {
        bc = Blockchaindotinfo.new(private_key_to_import, address_label)
      }.to raise_error Exceptions::BlockchainDotInfoWalletCreationError
    end
  end
  
  context 'when the Blockchain.info API URL is invalid' do
    it 'fails to create an online wallet' do
      ENV["BLOCKCHAINDOTINFO_API_URL"] = "https://blockchain.info/v1"
      private_key_to_import = '5KLTJs1vWcBjCWgNAfTpstNdSvuKZvnDouoVx2BET2JmAaeWt47'
      expect {
        bc = Blockchaindotinfo.new(private_key_to_import)
      }.to raise_error Exceptions::BlockchainDotInfoWalletCreationError
    end
  end
  
  context 'when the Blockchain.info JSON response is invalid' do
    it 'fails to create an online wallet' do
      Blockchaindotinfo.any_instance.stubs(:parse_new_wallet_JSON).raises(Exceptions::BlockchainDotInfoWalletCreationError) # Exception
      private_key_to_import = '5KLTJs1vWcBjCWgNAfTpstNdSvuKZvnDouoVx2BET2JmAaeWt47'
      expect {
        bc = Blockchaindotinfo.new(private_key_to_import)
      }.to raise_error Exceptions::BlockchainDotInfoWalletCreationError
    end
  end
end