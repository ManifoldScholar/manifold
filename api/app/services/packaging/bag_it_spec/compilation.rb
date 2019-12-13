module Packaging
  module BagItSpec
    # The BagIt spec compilation namespace
    module Compilation
      # The directory to build archives in.
      TMP_ROOT = Rails.root.join("tmp", "bagit")
    end
  end
end
