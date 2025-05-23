# frozen_string_literal: true

class NullLogger < Logger
  def initialize(*args); end

  def add(*args, &); end
end
