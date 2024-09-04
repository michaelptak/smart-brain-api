const returnClarifaiRequestOptions = (imageURL) => {
    // Your PAT (Personal Access Token) can be found in the Account's Security section
    const PAT = process.env.CLARIFAI_PAT;
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = process.env.USER_ID;
    const APP_ID = process.env.APP_ID;
    // Change these to whatever model and image URL you want to use
    // const MODEL_ID = 'face-detection';
    const IMAGE_URL = imageURL;
  
    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID,
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                      // "base64": IMAGE_BYTES_STRING
                  }
              }
          }
      ]
  });
  
  const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
  };
  return requestOptions;
  }

const handleApiCall = (req, res) => {
    fetch("https://api.clarifai.com/v2/models/face-detection/outputs", returnClarifaiRequestOptions(req.body.input))
        .then((response) => response.json())
        .then((data) => {
            res.json(data);
        })
        .catch((err) => res.status(400).json("Unable to work with API"));
    }

const handleImage = (req, res, db) => {
    const { id } = req.body;
        return db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('unable to get entries'));
}

module.exports = {
    handleImage,
    handleApiCall
}