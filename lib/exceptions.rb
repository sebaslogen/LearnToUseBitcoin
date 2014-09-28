module Exceptions
  class NoFreeWalletsAvailable < StandardError; end
  class NoVisitorError < StandardError; end
  class BlockchainDotInfoWalletCreationError < StandardError; end
  class BlockchainDotInfoWalletSendMoneyError < StandardError; end
end