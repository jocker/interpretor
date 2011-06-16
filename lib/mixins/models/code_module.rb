module Mixins::Models::CodeModule extend ActiveSupport::Concern

  included do
    field :content
    field :language_name
    field :name

    belongs_to :code_language


    set_callback(:create, :before) do |doc|
      doc.language_name = doc.code_language.name
    end

    validates_presence_of :content, :name

  end

  module InstanceMethods
    def compile
      code_language.compile(content)
    end
  end

end