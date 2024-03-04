export async function sendEmails(){
    fetch(`${process.env.FLASK_ENDPOINT}api/emailer`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the JSON response
        })
        .then(data => {
            // Process the JSON data
            console.log(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error)
            return error
        })
}