class APIService {
  static onSuccess(res) {
    return res.data
  }

  static onError(error='Unknown') {
    if(error && error.response.data && error.response.data.errors) {
      throw error.response.data.errors.general
    }else{
      throw error
    }
  }
}

export default APIService