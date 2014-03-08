module CustomHelpers
  def create_wallet(address = 'sebas', private_key = '12345')
    w = Wallet.create(address: address, private_key: private_key)
    return address, private_key, w
  end
end