class CreateWallets < ActiveRecord::Migration
  def change
    create_table :wallets do |t|
      t.string :address
      t.string :private_key

      t.timestamps
    end
  end
end
