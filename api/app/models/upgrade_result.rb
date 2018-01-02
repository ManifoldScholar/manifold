class UpgradeResult < ApplicationRecord
  self.primary_key = :version

  class << self
    # @param [String] version
    # @return [UpgradeResult]
    def fetch(version)
      where(version: version).first_or_initialize
    end
  end
end
