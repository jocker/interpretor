class CodesController < Direct

  def index
    #respond_with({:success => true, :data => as_tree_data(current_user.user_codes.first) })
    respond_with({:success => true, :data => {:value => "useful value"} })
  end

  def samples
    respond_with({:success => true, :data => as_tree_data(SampleCode.all) })
  end


  def create
    
  end

  def show
    code = current_user.user_codes.detect{|c| c.id.to_s == params[:id]}
    if !code
      code = SampleCode.where(:_id => params[:id]).first
    end
    code = if code
      code.is_a?(UserCode) ? code.serializable_hash : {:content => code.content}
    else
      {:content => ""}
    end

    respond_with({:success => true, :data => code})

  end

  private

  def as_tree_data(data)
    res = []
    grouped_values = data.map(&:serializable_hash).group_by{|h| [h["code_language_id"], h["language_name"]] }
    grouped_values.each_pair do |key, value|
      res << {:id => key.first, :name => key.last, :children => value.map{|v| {:id => v["id"], :name => v["name"], :leaf => true } } }
    end
    res
  end

end
