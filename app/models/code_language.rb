class CodeLanguage
  include Mongoid::Document

  field :name
  field :icon
  field :class_name
  field :uses_count, :type => Integer, :default => 0

  key :key



  def compile(code)
    Interpreter.const_get(self.class_name).new(code).compile
  end

end
