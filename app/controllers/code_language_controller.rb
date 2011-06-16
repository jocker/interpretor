class CodeLanguageController < Direct

  def index
    data = CodeLanguage.all.inject({}){|res, item| res[item.id] = {:name => item.name, :icon => item.icon }; res }
    respond_with({:success => true, :data => CodeLanguage.all})
  end

  def compile
    code_language = (CodeLanguage.find(params[:language_id]) rescue nil).try(:compile, params[:code])
    respond_with({:success => code_language.present?, :data => code_language || {}})
  end


end
