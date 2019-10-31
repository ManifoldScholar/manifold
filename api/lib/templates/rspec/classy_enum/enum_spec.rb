require 'rails_helper'

RSpec.describe <%= class_name %> do
<%- values.each_with_index do |arg, idx| -%>
<%= "\n" unless idx.zero? -%>
  describe <%= "#{class_name}::#{arg.camelize}" %>, enum: true do
  end
<%- end -%>
end
