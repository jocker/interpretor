module Mixins::FayeBroadcaster
  def broadcast(data, channel=nil)

    message = {:channel => channel, :data => data}
    uri = URI.parse("http://localhost:9292/faye")
    Net::HTTP.post_form(uri, :message => message.to_json)
  end
end