require 'exceptions'

class Wallet < ActiveRecord::Base
  
  belongs_to :visitor
  
  validates :address,
            presence: true,
            uniqueness: true,
            #format: { with: /regex/ },
            length: { minimum: 5, maximum: 150 }  ######################################################## TODO: Test code
  validates :private_key,
            presence: true,
            uniqueness: true,
            #format: { with: /regex/ },
            length: { minimum: 5, maximum: 150 }  ######################################################## TODO: Test code
  
  def self.associate_with_visitor!( visitor )
    if not visitor
      raise Exceptions::NoVisitorError
    end
    # Associate the first not used wallet with the id of the visitor and return it
    search = Wallet.where(visitor_id: nil)
    if not search.empty?
      wallet = search.first
      Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}: Wallet available found in DB #{wallet.address}"
      ActiveRecord::Base.transaction do
        visitor.save! # First save the Visitor to create an id in the DB for him/her
        wallet.update!(visitor_id: visitor.id) # Mark the wallet as used by associating it to its new owner
        Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}: Wallet #{wallet.address} assigned in DB to user #{visitor.id}"
      end
      if search.size < 50
        # TODO: call create_new_wallets
      end
      return wallet
    else # Error
      raise Exceptions::NoFreeWalletsAvailable
    end
  end
  
  def self.create_new_wallets
    # TODO: create automatically or request manual creation of more wallets
  end
  
end
