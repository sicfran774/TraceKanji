export async function getRecognizedKanji(canvasRef){
    const data = await fetch(process.env.FLASK_ENDPOINT + "api/recognize", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({data: canvasRef})
      })
      .then(response => {
        return response.json()
    })
    return data
}