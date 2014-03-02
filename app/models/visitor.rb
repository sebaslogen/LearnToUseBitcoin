class Visitor < ActiveRecord::Base
  
  has_many :wallets
  
  validates :ip,
            presence: true
  
end
