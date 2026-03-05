# frozen_string_literal: true

class License < ClassyEnum::Base
  def name
    to_s.titleize
  end

  def select_options
    all.map { |l| { label: l.name, value: l.to_s } }
  end
end

class License::CcBy < License
  def name
    "CC BY"
  end
end

class License::CcByNc < License
  def name
    "CC BY-NC"
  end
end

class License::CcByNcSa < License
  def name
    "CC BY-NC-SA"
  end
end

class License::CcByNcNd < License
  def name
    "CC BY-NC-ND"
  end
end

class License::CcBySa < License
  def name
    "CC BY-SA"
  end
end

class License::CcByNd < License
  def name
    "CC BY-ND"
  end
end

class License::Cco < License
  def name
    to_s.upcase
  end
end

class License::Ocl < License
  def name
    to_s.upcase
  end
end

class License::AllRightsReserved < License
end

class License::PublicDomain < License
end
