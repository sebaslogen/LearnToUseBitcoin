require 'spec_helper'

describe Visitor do
  it "stores valid IP per new Visitor" do
    ip = '83.65.125.249'
    v = Visitor.new(ip: ip)
    expect( v.save ).to be_truthy, "Failed to save to DB with error:#{v.errors.messages}"
    search = Visitor.where(ip: ip)
    expect( search.size ).to eq( 1 ), "There should be one and only one visitor with IP #{ip}. Size of search results:#{search.size}"
    expect( search.first.ip ).to eq( ip ), "The value of the IP stored in the DB (#{search.first.ip}) does not match with the input IP (#{ip})"
  end
  
  it "does not store invalid IP on a new Visitor" do
    ip = '279.65.125.249'
    v = Visitor.new(ip: ip)
    expect( v.save ).to be_falsy, "It should have failed to save to DB with error:#{v.errors.messages}"
    search = Visitor.where(ip: ip)
    expect( search.size ).to eq( 0 )
  end
end
