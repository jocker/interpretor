module Js
  module Generators
    class Base < Rails::Generators::NamedBase

      APP_PATH = File.join(Rails.root,"vendor","javascripts","crs","app")

      def self.source_root
        @_js_source_root ||= File.expand_path(File.join(File.dirname(__FILE__), 'js', generator_name, 'templates'))
      end
    end
  end
end