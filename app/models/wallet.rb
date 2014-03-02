class Wallet < ActiveRecord::Base
  
  belongs_to :visitor
  
  validates :address,
            presence: true,
            uniqueness: true,
            #format: { with: /regex/i },
            length: { minimum: 5, maximum: 150 }  ######################################################## TODO: Test code
  validates :private_key,
            presence: true,
            uniqueness: true,
            #format: { with: /regex/i },
            length: { minimum: 5, maximum: 150 }  ######################################################## TODO: Test code
  
  def self.associate_with_visitor( id )
    # Associate the first not used wallet with the id of the visitor and return it
    search = Wallet.where(visitor_id: nil)
    if not search.empty?
      wallet = search.first
      Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}: found in DB #{wallet.address}"
      wallet.update(visitor_id: id) # Mark the wallet as used by associating it to its new owner
      Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}: Wallet updated in DB"
      wallet.save # To add a new entry to the DB: it will return true OR false
      return wallet
    else
      # Error
      Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}: Error, no available wallets in DB"
      return nil
    end
  end
  
end
