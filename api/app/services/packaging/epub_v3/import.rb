module Packaging
  module EpubV3
    # Module that can be used to inject dependencies from {Packaging::EpubV3::Container}
    Import = Dry::AutoInject(Packaging::EpubV3::Container)
  end
end
