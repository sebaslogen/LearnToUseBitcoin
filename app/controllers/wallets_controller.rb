class WalletsController < ApplicationController
  before_action :set_wallet, only: [:show, :edit, :update, :destroy]

  def check_captcha # TODO: Refactor into visitor's Controller
    session_secret = params['session_secret'] # in this case, using Rails
    ayah = AYAH::Integration.new(ENV['AREYOUAHUMAN_PUBLISHER_KEY'], ENV['AREYOUAHUMAN_SCORING_KEY'])
    ayah_passed = ayah.score_result(session_secret, request.remote_ip)
    Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}: IP is: #{request.remote_ip}"
    Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}: Test is: #{ayah_passed}"
    return ayah_passed
  end
  
  def testadd ######################################################## TODO: Test code
    @wallet = Wallet.new( address: params[:address], private_key: params[:private_key] )
    #@wallet = Wallet.create( address: params[:address], private_key: params[:private_key] )
    @wallet.save
    Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}: Error inserting in DB #{@wallet.errors.messages}"
    #end
    render action: 'testadd', :layout => false
  end
  
  def testshow ######################################################## TODO: Test code
    if check_captcha
      myarray = Wallet.where(address: 'sebas')
      #myarray = Wallet.find(1)
      if myarray.size == 0
        Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}: nothing found in DB"
      else
        Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}: Size:#{myarray.size}"
      end
      @wallet = myarray.first      
      Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}: Found in DB #{@wallet.address}"
      
      render action: '_testshow', :layout => false
    else
      render :nothing => true
    end
  end
  
  # GET /wallets
  # GET /wallets.json
  def index
    @wallets = Wallet.all
  end

  # GET /wallets/1
  # GET /wallets/1.json
  def show
  end

  # GET /wallets/new
  def new
    @wallet = Wallet.new
  end

  # GET /wallets/1/edit
  def edit
  end

  # POST /wallets
  # POST /wallets.json
  def create
    @wallet = Wallet.new(wallet_params)

    respond_to do |format|
      if @wallet.save
        format.html { redirect_to @wallet, notice: 'Wallet was successfully created.' }
        format.json { render action: 'show', status: :created, location: @wallet }
      else
        format.html { render action: 'new' }
        format.json { render json: @wallet.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /wallets/1
  # PATCH/PUT /wallets/1.json
  def update
    respond_to do |format|
      if @wallet.update(wallet_params)
        format.html { redirect_to @wallet, notice: 'Wallet was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @wallet.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /wallets/1
  # DELETE /wallets/1.json
  def destroy
    @wallet.destroy
    respond_to do |format|
      format.html { redirect_to wallets_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_wallet
      @wallet = Wallet.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def wallet_params
      params.require(:wallet).permit(:address, :private_key)
    end
end
