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
      @request.stubs(:remote_ip).returns("1.2.3.4")   #using Mocha
      get :show
      expect(response).to redirect_to root_url
      expect(flash[:error]).to match(/^Our monkeys detected that you didn't pass the Human test. \
Don't worry our monkeys fail too, just try again and have fun$/)
    end
  end
end