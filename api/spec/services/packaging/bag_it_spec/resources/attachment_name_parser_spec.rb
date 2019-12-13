require "rails_helper"

RSpec.describe Packaging::BagItSpec::Resources::AttachmentNameParser do
  let(:name_parser) { described_class.new }

  subject { name_parser }

  class << self
    def test_parse!(name, *values, valid: true)
      description = valid ? "returns #{values.inspect}" : "raises an error"

      context "given #{name.inspect}" do
        it description do
          expect do
            result = name_parser.call name

            expect(result).to eq values
          end.to valid ? execute_safely : raise_error(ArgumentError)
        end
      end
    end
  end

  test_parse! :variant_format_one, "variants", "formats", "01"
  test_parse! :variant_format_two, "variants", "formats", "02"
  test_parse! :variant_poster, "variants", "poster"
  test_parse! :variant_thumbnail, "variants", "thumbnail"
  test_parse! :attachment, "attachment"
  test_parse! :high_res, "high_res"
  test_parse! :translation, "translation"
  test_parse! :transcript, "transcript"
  test_parse! :unknown_attachment, valid: false
end
