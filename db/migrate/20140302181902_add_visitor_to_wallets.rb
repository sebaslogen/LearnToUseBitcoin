class AddVisitorToWallets < ActiveRecord::Migration
  def change
    add_reference :wallets, :visitor, index: true
  end
end
