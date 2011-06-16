module Mixins::Models::Util::AttrReadonly extend ActiveSupport::Concern

  module ClassMethods

    def attr_readonly(*args)
      args = args.map(&:to_sym)
      if instance_variable_defined?("@__readonly_attributes")
        args += instance_variable_get("@__readonly_attributes")
      else
        before_validation :reset_attr_readonly_fields, :if => lambda{|rec| rec.changed? && !rec.new_record? }
      end
      instance_variable_set("@__readonly_attributes", args)
    end

  end

  module InstanceMethods

    def reset_attr_readonly_fields
      return if self.new_record?
      self.class.instance_variable_get("@__readonly_attributes").each do |name|
        self.send("reset_#{name}!") if self.send("#{name}_changed?")
      end
    end

  end


end