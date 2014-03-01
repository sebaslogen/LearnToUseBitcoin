json.array!(@wallets) do |wallet|
  json.extract! wallet, :id, :address, :private_key
  json.url wallet_url(wallet, format: :json)
end
