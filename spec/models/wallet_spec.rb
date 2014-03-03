require 'spec_helper'
require 'exceptions'

describe Wallet do
  context "valid database structure" do
    it "stores valid Bitcoin addresses" do
      address = 'sebas'
      private_key = '12345'
      w = Wallet.new(address: address, private_key: private_key)
      expect( w.save ).to be_truthy, "Failed to save to DB with error:#{w.errors.messages}"
      search = Wallet.where(address: address)
      expect( search.size ).to eq( 1 ), "There should be one and only one wallet with address #{address}. Size of search results:#{search.size}"
      expect( search.first.address ).to eq( address )
    end
    
    it "stores valid Bitcoin private keys" do
      address = 'sebas'
      private_key = '12345'
      w = Wallet.new(address: address, private_key: private_key)
      expect( w.save ).to be_truthy, "Failed to save to DB with error:#{w.errors.messages}"
      search = Wallet.where(private_key: private_key)
      expect( search.size ).to eq( 1 ), "There should be one and only one wallet with private key #{private_key}. Size of search results:#{search.size}"
      expect( search.first.private_key ).to eq( private_key )
    end
    
    it "stores does not valid Bitcoin addresses" do
      address = 'seb'
      private_key = '12345'
      w = Wallet.new(address: address, private_key: private_key)
      expect( w.save ).to be_falsy, "It should have failed to save to DB with error:#{w.errors.messages}"
      search = Wallet.where(address: address)
      expect( search.size ).to eq( 0 )
    end
    
    it "stores does not valid Bitcoin private keys" do
      address = 'sebas'
      private_key = '123'
      w = Wallet.new(address: address, private_key: private_key)
      expect( w.save ).to be_falsy, "It should have failed to save to DB with error:#{w.errors.messages}"
      search = Wallet.where(private_key: private_key)
      expect( search.size ).to eq( 0 )
    end

    it "stores wallets without visitor by default" do
      address = 'sebas'
      private_key = '12345'
      Wallet.create(address: address, private_key: private_key)
      search = Wallet.where(private_key: private_key)
      expect( search.size ).to eq( 1 )
      expect( search.first.visitor_id ).to be_nil
    end
  end
end

describe Wallet, '.associate_with_visitor' do
  it "associate the first available wallet to the visitor" do
    ip = '127.0.0.1'
    v = Visitor.create(ip: ip)
    address = 'sebas'
    private_key = '12345'
    Wallet.create(address: address, private_key: private_key)
    expect( Wallet.associate_with_visitor( v.id ) ).to be_truthy # passes if actual is truthy (not nil or false)
  end
  
  it "association to the visitor fails when there are no wallets available" do
    ip = '127.0.0.1'
    v = Visitor.create(ip: ip)
    expect { Wallet.associate_with_visitor( v.id ) }.to raise_error(Exceptions::NoFreeWalletsAvailable) # passes if actual is truthy (not nil or false)
  end
end

describe Wallet, '.create_new_wallets' do
  pending "Pending test for new wallet creation method #{__FILE__}"
end