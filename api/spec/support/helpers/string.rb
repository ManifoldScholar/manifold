module TestHelpers
  def compact(string)
    return "" unless string.respond_to? :split
    string.split("\n").map(&:squish).join("\n").strip
  end
end
