# Helpers for hash attributes
module HashAttributes
  extend ActiveSupport::Concern

  class_methods do
    def merge_hash_attributes!(*fields)
      fields.each do |field|
        class_eval <<-RUBY, __FILE__, __LINE__ + 1
        def #{field}=(value)
          base = self.#{field} || {}
          new = base.merge(value)
          write_attribute(:#{field}, new)
        end
        RUBY
      end
    end
  end
end
