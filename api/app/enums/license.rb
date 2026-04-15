# frozen_string_literal: true

class License < ClassyEnum::Base
  def label
    to_s.titleize
  end

  def self.select_options
    all.map { |l| { label: l.label, value: l.to_s } }
  end
end

class License::CcBy < License
  def label
    "CC BY"
  end
end

class License::CcByNc < License
  def label
    "CC BY-NC"
  end
end

class License::CcByNcSa < License
  def label
    "CC BY-NC-SA"
  end
end

class License::CcByNcNd < License
  def label
    "CC BY-NC-ND"
  end
end

class License::CcBySa < License
  def label
    "CC BY-SA"
  end
end

class License::CcByNd < License
  def label
    "CC BY-ND"
  end
end

class License::Cco < License
  def label
    to_s.upcase
  end
end

class License::Ocl < License
  def label
    to_s.upcase
  end
end

class License::AllRightsReserved < License
end

class License::PublicDomain < License
end
