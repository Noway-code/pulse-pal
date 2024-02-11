from flask import Flask, request, jsonify
from flask_cors import CORS

from yarppg.yarppg.main import get_data
from yarppg.hrv import get_fps, process_raw_data

app = Flask(__name__)
CORS(app, supports_credentials=True)


@app.route("/test")
def test():
    return "test!!"


@app.route("/upload-video", methods=["POST"])
def upload_video():
    print(f"Request URL: {request.url}")  # Log the request URL

    print(request.files)

    if "video" not in request.files:
        print("No video file provided")
        return jsonify({"error": "No video file provided"}), 400

    video_file = request.files["video"]

    if video_file.filename == "":
        print("No selected file")
        return jsonify({"error": "No selected file"}), 400

    if video_file:
        # Save the uploaded video file to a desired location
        video_file.save("uploaded-video.mp4")
        try:
            frame_rate = get_fps("uploaded-video.mp4")
        except:
            frame_rate = 30

        print("frame rate")
        print(frame_rate)

        print("saved")

        # Now, let's process it!
        raw_data = get_data("uploaded-video.mp4")
        processed_data = process_raw_data(raw_data, frame_rate)
        print("processed")
        print(processed_data)
        return processed_data, 200


if __name__ == "__main__":
    app.run(debug=True)
