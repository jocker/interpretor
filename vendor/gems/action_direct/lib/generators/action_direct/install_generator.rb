module ActionDirect
  module Generators
    class InstallGenerator < Rails::Generators::Base

      source_root File.expand_path("../../templates", __FILE__)

      desc "Creates a ActionDirect initializer"

      def copy_initializer
        template "install.rb", "config/initializers/action_direct.rb"
      end

    end
  end
end