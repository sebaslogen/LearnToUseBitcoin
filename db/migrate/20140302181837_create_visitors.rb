class CreateVisitors < ActiveRecord::Migration
  def change
    create_table :visitors do |t|
      t.string :ip

      t.timestamps
    end
  end
end
