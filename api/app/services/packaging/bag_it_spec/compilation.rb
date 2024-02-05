# frozen_string_literal: true

module Packaging
  module BagItSpec
    # The BagIt spec compilation namespace
    module Compilation
      # The directory to build archives in.
      TMP_ROOT = Rails.root.join("tmp", "bagit")

      # The compilation pipeline version.
      VERSION = Gem::Version.new("1.2.0").freeze
    end
  end
end
