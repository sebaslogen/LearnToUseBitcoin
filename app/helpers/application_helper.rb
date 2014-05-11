module ApplicationHelper
  def single_capitalize(string)
    return string.slice(0,1).capitalize + string.slice(1..-1)
  end
end
