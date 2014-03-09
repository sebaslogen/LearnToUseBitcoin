require 'spec_helper'
require 'custom_helpers'
require 'exceptions'

RSpec.configure do |config|
  config.mock_framework = :mocha
  config.include CustomHelpers
end

describe VisitorsController do
  
  before(:each) do
    @request.stubs(:remote_ip).returns("1.2.3.4")
  end
  
  context 'when the Captcha is invalid' do
    it 'the Captcha check returns false' do
      # Setup
      @controller = VisitorsController.new
      @controller.params = {:session_secret => '123465789'}
      # Exercise
      ayah_passed = @controller.instance_eval{ check_ayah_passed("1.2.3.4") }   # invoke the private method
      # Verify
      expect(ayah_passed).to be false
      # Teardown
    end
  end
  
  context 'when the show page is requested without filling the Captcha' do
    it 'renders the default page with an error message' do
      get :show
      expect(response).to redirect_to root_url
      expect(flash[:error]).to match(/^Our monkeys detected that you didn't pass the Human test. \
Don't worry our monkeys fail too, just try again and have fun!$/)
    end
  end
  
  context 'request to show wallet page after passing the Captcha for a new Visitor' do
    it 'renders the Wallet show page with wallet information' do
      AYAH::Integration.any_instance.stubs(:score_result).returns(true)
      address, _, _ = create_wallet
      get :show
      expect( Visitor.first.wallets.first.address ).to eq( address )
      expect( response ).to render_template('show')
    end
  end
  
  describe 'request to show wallet page after passing the Captcha' do
    before(:each) do
      AYAH::Integration.any_instance.stubs(:score_result).returns(true)
    end
    
    after(:each) do
      expect(response).to redirect_to root_url
    end

    context 'when Visitor object cannot be created' do
      it 'renders the default page with an error message' do
        Visitor.expects(:new).returns(nil) # any_instance doesn't work here and expect forces only 1 call to this stub
        get :show
        expect(flash[:error]).to match(/^Our monkeys made a mess and could not create a new record for you, \
our precious visitor. Contact invitations@leartousebitcoin.com$/)
      end
    end
  
    context 'when there is an error associating wallet with visitor' do
      after(:each) do
        address, _, _ = create_wallet
        get :show
        id = Wallet.find_by(address: address).visitor_id
        expect(id).to be_nil, "The wallet was not correctly disassociated after \
problem saving associated Visitor. Visitor ID in wallet is:#{id}"
        expect(flash[:error]).to match(/^Our monkeys made a mess and could not access the database. Contact invitations@leartousebitcoin.com$/)
      end
      
      context 'and Visitor cannot be saved to DB' do      
        it 'renders the default page with an error message' do
          Visitor.any_instance.stubs(:save!).raises(ActiveRecord::ActiveRecordError) # Exception
        end
      end
    
      context 'and Wallet cannot be updated in DB' do
        it 'renders the default page with an error message' do
          Wallet.any_instance.stubs(:update!).raises(ActiveRecord::ActiveRecordError) # Exception
        end
      end
    end
    
    context 'when there is a problem associating the Wallet' do
      it 'renders the default page with an error message' do
        Wallet.stubs(:associate_with_visitor!).returns(nil)
        get :show
        expect(flash[:error]).to match(/^Our monkeys made a mess again and created a magic error linking wallet to visitor in DB$/)
      end
    end
    
    context 'when there are not more Wallets' do
      it 'renders the default page with an error message' do
        get :show
        expect(flash[:error]).to match(/^Our monkeys discovered there are no more wallets in the DB, \
wait until the master monkey refills it and come back or contact her directly at invitations@leartousebitcoin.com$/)
      end
    end
      
    context 'when the Visitor already exist' do
      it 'renders the default page with an error message because same Visitor cannot receive twice ' do
        Visitor.create(ip: "1.2.3.4")
        get :show
        expect(flash[:error]).to match(/^Our super monkeys detected that you already received a wallet with some Bitcoins before$/)
      end
    end

    context 'when the amount of wallets available is smaller than 20' do
      it 'creates 50 new wallets'
    end
  end
  
end