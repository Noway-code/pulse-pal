from flask import Flask, request, jsonify
from flask_cors import CORS

from json import dump, load
from yarppg.yarppg.main import get_data
from yarppg.hrv import get_fps, process_raw_data

app = Flask(__name__)
CORS(app, supports_credentials=True)


@app.route("/test")
def test():
    return "test!!"


@app.route("/test-post", methods=["POST"])
def test_post():
    return "test post"


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

        return jsonify({"message": "Video uploaded successfully"}), 200


@app.route("/process-video")
def process_video():
    try:
        frame_rate = get_fps("uploaded-video.mp4")
    except:
        frame_rate = 30

    print("frame rate")
    print(frame_rate)
    print("saved")

    # Now, let's process it!
    raw_data = get_data("uploaded-video.mp4")
    raw_data["fps"] = frame_rate

    with open("raw_data.json", "w") as f:
        dump(raw_data, f)

    return {"hr": raw_data["hr"]}, 200


@app.route("/analyze-video")
def analyze_video():
    with open("raw_data.json", "r") as f:
        raw_data = load(f)

    processed_data = process_raw_data(raw_data["series"], raw_data["fps"])
    print("processed")

    processed_data["HR"] = raw_data["hr"]

    print(processed_data)
    return processed_data, 200


if __name__ == "__main__":
    app.run(debug=True)
