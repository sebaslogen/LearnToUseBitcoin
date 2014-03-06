require 'spec_helper'
require 'exceptions'

RSpec.configure do |config|
  config.mock_framework = :mocha
end

describe VisitorsController do

  context 'when the Captcha is invalid' do
    it 'the Captcha check returns false' do
      @controller = VisitorsController.new
      @controller.params = {:session_secret => '123465789'}
      ayah_passed = @controller.instance_eval{ check_ayah_passed("1.2.3.4") }   # invoke the private method
      expect(ayah_passed).to be false
    end
  end
  
  context 'when the show page is requested without filling the Captcha' do
    it 'renders the default page with an error message' do
      @request.stubs(:remote_ip).returns("1.2.3.4")
      get :show
      expect(response).to redirect_to root_url
      expect(flash[:error]).to match(/^Our monkeys detected that you didn't pass the Human test. \
Don't worry our monkeys fail too, just try again and have fun!$/)
    end
  end

  context 'when the show page is requested with good Captcha for new Visitor' do
    it 'renders the Wallet show page with wallet information' do
      AYAH::Integration.any_instance.stubs(:score_result).returns(true)
      @request.stubs(:remote_ip).returns("1.2.3.4")
      address = 'sebas'
      private_key = '12345'
      Wallet.create(address: address, private_key: private_key)
      get :show
      expect(response).to render_template('show')
    end
  end

  context 'when the show page is requested with good Captcha but Visitor cannot be saved to DB' do
    it 'renders the default page with an error message' do
      AYAH::Integration.any_instance.stubs(:score_result).returns(true)
      Visitor.any_instance.stubs(:save).returns(false)
      ip = "1.2.3.4"
      @request.stubs(:remote_ip).returns(ip)
      address = 'sebas'
      private_key = '12345'
      Wallet.create(address: address, private_key: private_key)
      get :show
      id = Wallet.find_by(address: address).id
      expect(id).to be_nil, "The wallet was not correctly disassociated after \
problem saving associated Visitor. ID in wallet is:#{id}"
      expect(response).to redirect_to root_url
      expect(flash[:error]).to match(/^Our monkeys made a mess again and created a magic error saving new visitor to DB with IP:#{ip}$/)
    end
  end
  
  context 'when the show page is requested with good Captcha but there is a problem associating the Wallet' do
    it 'renders the default page with an error message' do
      AYAH::Integration.any_instance.stubs(:score_result).returns(true)
      Wallet.stubs(:associate_with_visitor).returns(nil)
      @request.stubs(:remote_ip).returns("1.2.3.4")
      get :show
      expect(response).to redirect_to root_url
      expect(flash[:error]).to match(/^Our monkeys made a mess again and created a magic error linking wallet to visitor in DB$/)
    end
  end
  
  context 'when the show page is requested with good Captcha and there are not more Wallets' do
    it 'renders the default page with an error message' do
      AYAH::Integration.any_instance.stubs(:score_result).returns(true)
      @request.stubs(:remote_ip).returns("1.2.3.4")
      get :show
      expect(response).to redirect_to root_url
      expect(flash[:error]).to match(/^Our monkeys discovered there are no more wallets in the DB, \
wait until the master monkey refills it and come back or contact her directly at invitations@leartousebitcoin.com$/)
    end
  end
    
  context 'when the show page is requested with good Captcha and the Visitor already exist' do
    it 'renders the default page with an error message because same Visitor cannot receive twice ' do
      AYAH::Integration.any_instance.stubs(:score_result).returns(true)
      @request.stubs(:remote_ip).returns("1.2.3.4")
      Visitor.create(ip: "1.2.3.4")
      get :show
      expect(response).to redirect_to root_url
      expect(flash[:error]).to match(/^Our super monkeys detected that you already received a wallet with some Bitcoins before$/)
    end
  end

end