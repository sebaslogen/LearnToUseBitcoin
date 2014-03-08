require 'spec_helper'
require 'custom_helpers'
require 'exceptions'

RSpec.configure do |config|
  config.include CustomHelpers
end

describe Wallet do
  context 'valid database structure' do
    it 'stores valid Bitcoin addresses' do
      address, _, w = create_wallet
      expect( w.save ).to be_truthy, "Failed to save to DB with error:#{w.errors.messages}"
      search = Wallet.where(address: address)
      expect( search.size ).to eq( 1 ), "There should be one and only one wallet with address #{address}. Size of search results:#{search.size}"
      expect( search.first.address ).to eq( address )
    end
    
    it 'stores valid Bitcoin private keys' do
      _, private_key, w = create_wallet
      expect( w.save ).to be_truthy, "Failed to save to DB with error:#{w.errors.messages}"
      search = Wallet.where(private_key: private_key)
      expect( search.size ).to eq( 1 ), "There should be one and only one wallet with private key #{private_key}. Size of search results:#{search.size}"
      expect( search.first.private_key ).to eq( private_key )
    end
    
    it 'does not store invalid Bitcoin address' do
      address, _, w = create_wallet(address = 'seb')
      expect( w.save ).to be_falsy, "It should have failed to save to DB with error:#{w.errors.messages}"
      search = Wallet.where(address: address)
      expect( search.size ).to eq( 0 )
    end
    
    it 'does not store invalid Bitcoin private key' do
      address, private_key, w = create_wallet(private_key = '123')
      expect( w.save ).to be_falsy, "It should have failed to save to DB with error:#{w.errors.messages}"
      search = Wallet.where(private_key: private_key)
      expect( search.size ).to eq( 0 )
    end

    it 'stores new wallets without visitor by default' do
      _, private_key, w = create_wallet
      w.save!
      search = Wallet.where(private_key: private_key)
      expect( search.size ).to eq( 1 )
      expect( search.first.visitor_id ).to be_nil
    end
  end
end

describe Wallet, '.associate_with_visitor!' do
  it 'associates the first available wallet to the visitor and stores everything in DB' do
    ip = '127.0.0.1'
    v = Visitor.new(ip: ip)
    _, _, w = create_wallet
    w.save!
    expect( Wallet.associate_with_visitor!( v ) ).to be_truthy # passes if actual is truthy (not nil or false)
    db_visitor = Visitor.find(1)
    db_wallet = Wallet.find(1)
    expect( db_visitor ).to be_truthy, "Visitor was not stored in DB"
    expect( db_visitor.ip ).to eq( ip ), "IP of Visitor stored in DB (#{db_visitor.ip}) doesn't match provided visitor's IP (#{ip})"
    expect( db_visitor.id ).to eq( db_wallet.visitor_id ), "Association failed: Visitor ID in DB (#{db_visitor.id}) \
didn't match ID of visitor in associated Wallet (#{db_wallet.visitor_id})"
  end
  
  context 'when there are no wallets available' do
    it 'fails to associate the wallet with the visitor and throws exception' do
      v = Visitor.new(ip: '127.0.0.1')
      expect { Wallet.associate_with_visitor!( v ) }.to raise_error(Exceptions::NoFreeWalletsAvailable)
      expect(Visitor.all.empty?).to eq(true), "The Visitor was not supposed to be stored in DB because it was empty/nil"
      expect(Wallet.all.empty?).to eq(true), "There should be no wallets in DB"
    end
  end
  
  context 'when there is no visitor provided' do
    it 'fails to associate the wallet with the visitor and throws exception' do
      _, _, w = create_wallet
      w.save!
      expect { Wallet.associate_with_visitor!( nil ) }.to raise_error(Exceptions::NoVisitorError)
      expect(Visitor.all.empty?).to eq(true), "The Visitor was not supposed to be stored in DB because it was empty/nil"
      expect(Wallet.first.visitor_id).to be_nil, "There should be no wallets in DB"
    end
  end
  
  context 'when there is a problem saving the visitor to the DB' do
    it 'fails to associate the wallet with the visitor and throws exception' do
      Visitor.any_instance.stubs(:save!).raises(ActiveRecord::ActiveRecordError) # Exception
      _, _, w = create_wallet
      w.save!
      v = Visitor.new(ip: '127.0.0.1')
      expect { Wallet.associate_with_visitor!( v ) }.to raise_error(ActiveRecord::ActiveRecordError)
      expect(Visitor.all.empty?).to eq(true), "The Visitor was not supposed to be stored in DB because it was empty/nil"
      expect(Wallet.first.visitor_id).to be_nil, "There should be no wallets in DB"
    end
  end
  
  context 'when there is a problem updating the wallet in the DB' do
    it 'fails to associate the wallet with the visitor and throws exception' do
      Wallet.any_instance.stubs(:update!).raises(ActiveRecord::ActiveRecordError) # Exception
      _, _, w = create_wallet
      w.save!
      v = Visitor.new(ip: '127.0.0.1')
      expect { Wallet.associate_with_visitor!( v ) }.to raise_error(ActiveRecord::ActiveRecordError)
      expect(Visitor.all.empty?).to eq(true), "The Visitor was not supposed to be stored in DB because it was empty/nil"
      expect(Wallet.first.visitor_id).to be_nil, "There should be no wallets in DB"
    end
  end
end

describe Wallet, '.create_new_wallets' do
  pending "Pending test for new wallet creation method #{__FILE__}"
end