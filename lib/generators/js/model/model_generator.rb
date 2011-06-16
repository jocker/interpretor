require "generators/js"

module Js
  module Generators
    class ModelGenerator < Base
       argument :attributes, :type => :array, :default => [], :banner => "field:type field:type"

       def add_default_fields
         attributes.unshift(Rails::Generators::GeneratedAttribute.new("id", "string")) unless attributes.detect{|attr| attr.name.to_sym == :id}
      end

      def create_model_file
        template 'model.erb', File.join(APP_PATH, 'data/models', "#{file_name}.js")
      end



    end
  end
end