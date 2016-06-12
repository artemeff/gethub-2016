class Api::EntriesController < ApiController
  def search
    entries = Entry.eager_load(:type).by_polygon(params[:polygon])
    entries = entries.where(type_id: params[:type_id]) if params[:type_id].present?
    entries = entries.map do |entry|
      {
        id: entry.id,
        name: entry.name,
        latlng: [entry.location.x, entry.location.y],
        type: entry.type.name,
        type_color: entry.type.color
      }
    end

    render json: {entries: entries}
  end

  def show
    @entry = Entry.eager_load(:type).find(params[:id])

    render :show, layout: false
  end

private

  def search_params
    params.permit(:latlngs)
  end
end
