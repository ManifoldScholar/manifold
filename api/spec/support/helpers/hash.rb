module HashHelper
  class << self
    def pick(hash, keys)
      return hash.select { |k,v| keys.include?(k) }
    end
  end
end
