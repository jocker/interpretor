class MessagesController < Direct



  def index
    respond_with({:success => true, :data => current_user.received_messages})
  end

  def update
    message = Message.find(params[:id]) rescue nil
    if message
      message.viewed = true
      message.save
    end

    respond_with({:success => message.present?, :data => message})

  end

  def destroy
    message = Message.where(:to => current_user.id, :_id => params[:id]).first
    message.delete if message
    respond_with({:success => message.present?, :data => message})
  end

end
