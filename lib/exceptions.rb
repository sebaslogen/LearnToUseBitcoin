module Exceptions
  class NoFreeWalletsAvailable < StandardError; end
  class NoVisitorError < StandardError; end
  class BlockchainDotInfoWalletCreationError < StandardError; end
end