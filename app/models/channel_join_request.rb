class ChannelJoinRequest
  include Mongoid::Document

  field :user_id, :type => BSON::ObjectId

  after_create :notify_channel_owner

  embedded_in :channel

  def accept
    user.subscribe_to_channel channel
    send_message({:subject => "Request Accepted", :content => "Your request for joining channel #{ channel.name } was accepted"})
    self.delete
  end

  def reject
    send_message({:subject => "Request Rejected", :content =>  "Your request for joining channel #{ channel.name } was rejected"})
    self.delete
  end

  def serializable_hash(options={})
    super(options).merge({:channel_name => channel.name, :user_email => user.email })
  end

  private

  def send_message(options={})
    options.reverse_merge!({:from => channel.owner.id, :from_name => channel.owner.email, :to => user.id, :to_name => user.email})
    Message.create(options)
  end

  def notify_channel_owner
    send_message({
                     :subject => "New join request",
                     :content => "User #{user.email} wants to join channel #{ channel.name }",
                     :to => channel.owner.id,
                     :to_name => channel.owner.email,
                     :from => user.id,
                     :from_name => user.email
                 })
  end

  def user
    @user ||=begin
      users = Group.where("users._id" => self.user_id).first.try(:users) || []
      users.detect { |u| u.id == self.user_id }
    end

  end

end
