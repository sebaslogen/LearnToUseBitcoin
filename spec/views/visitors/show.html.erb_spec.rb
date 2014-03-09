require 'spec_helper'

RSpec.configure do |config|
  config.mock_framework = :mocha
  config.include CustomHelpers
end

describe 'visitors/show' do
  
  it "displays the Visitor's wallet" do
    #Setup
    ip = '1.2.3.4'
    address, private_key, w = create_wallet
    w.save!
    v = Visitor.new(ip: ip)
    w.update!(visitor_id: v.id)
    v.save!
    assign(:wallet, w)
    assign(:visitor, v)
=begin
    # Alternative with stubs
    assign(:wallet, stub_model(Wallet,
      address: "sebas",
      private_key: '12345'
    ))
    assign(:visitor, stub_model(Visitor,
      ip: ip
    ))
=end
    # Exercise
    render
    # Validate
    expect(response).to match /1.2.3.4/
    expect(response).to match address
    expect(response).to match private_key
  end
  
end