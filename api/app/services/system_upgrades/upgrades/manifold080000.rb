module SystemUpgrades
  module Upgrades
    class Manifold080000 < SystemUpgrades::AbstractVersion

      def perform!
        set_has_mathml_on_text_sections!
      end

      private

      def set_has_mathml_on_text_sections!
        logger.info("===================================================================")
        logger.info("Determining which Text Sections contain MathML                     ")
        logger.info("===================================================================")
        logger.info("Version 8.0.0 supports MathML in the reader, but we only load the  ")
        logger.info("required libraries for sections that include math.                 ")
        logger.info("===================================================================")

        TextSection.find_each(&:save!)
      end
    end
  end
end
