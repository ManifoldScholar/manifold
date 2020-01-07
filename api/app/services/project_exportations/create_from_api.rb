module ProjectExportations
  class CreateFromAPI < ActiveInteraction::Base
    hash :data do
      hash :attributes do
        string :export_target_id
        string :project_id
      end
    end

    def execute
      compose ProjectExportations::CreateAndPerform, create_inputs
    end

    private

    def create_inputs
      data[:attributes].transform_keys do |key|
        case key
        when /\A(?<association>\w+)_id\z/ then Regexp.last_match[:association]
        else
          # :nocov:
          key
          # :nocov:
        end
      end
    end
  end
end
