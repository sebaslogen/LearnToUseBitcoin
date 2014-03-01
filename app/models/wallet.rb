class Wallet < ActiveRecord::Base
  validates :address,
            presence: true,
            uniqueness: true,
            #format: { with: /regex/i },
            length: { minimum: 5, maximum: 150 }  ######################################################## TODO: Test code
end
