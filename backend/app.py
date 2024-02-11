from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route("/test")
def test():
    return "test!!"

@app.route('/upload-video', methods=['POST'])
def upload_video():
    print(f"Request URL: {request.url}")  # Log the request URL

    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400

    video_file = request.files['video']

    if video_file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if video_file:
        # Save the uploaded video file to a desired location
        video_file.save('uploaded-video.mp4')

        # Optionally, you can perform further processing here, such as face detection
        # or any other operation on the uploaded video

        return jsonify({'message': 'Video uploaded successfully'}), 200

if __name__ == "__main__":
    app.run(debug=True)
