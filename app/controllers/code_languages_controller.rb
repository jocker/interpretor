class CodeLanguagesController < Direct

  def index
    respond_with({:success => true, :data => CodeLanguage.all})
  end

  def compile
    code_language = (CodeLanguage.find(params[:language_id]) rescue nil).try(:compile, params[:code])
    respond_with({:success => code_language.present?, :data => code_language || {}})
  end

  def list
    serializer = lambda{|code| {:name => code.name, :id => code.id, :leaf => true} }
    code_language = CodeLanguage.find(params[:id]) rescue nil

    res = if code_language
      samples = {:name => "Samples", :id => BSON::ObjectId.new, :children => code_language.sample_codes.map(&serializer) }
      user_defined = {:name => "Saved", :id => "samples", :children => current_user.user_codes.find_all{|code| code.code_language_id == code_language.id }.map(&serializer) }
      [ user_defined, samples ]
          else
      []
          end

    respond_with({:success => true, :data => res})

  end


end
