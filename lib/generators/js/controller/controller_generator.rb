require "generators/js"

module Js
  module Generators
    class ControllerGenerator < Base
      argument :actions, :type => :array, :default => [], :banner => "action action"

      def add_default_actions
        actions.unshift("index") unless actions.include?("index")
      end

      def create_controller_file
        template 'controller.erb', File.join(APP_PATH, 'controllers', "#{file_name}.js")
      end

      def create_layout_file
        template "layout.erb", File.join(APP_PATH, 'views', 'layouts', "#{file_name}.js")
      end

      def create_view_fields
        @actions.each do |action|
          @action = action
          template "view.erb", File.join(APP_PATH, 'views', file_name, "#{action}.js")
        end

      end

    end
  end
end