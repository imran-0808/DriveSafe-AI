from flask import Flask, Response
import cv2

app = Flask(__name__)
camera = cv2.VideoCapture(0)
# camera = cv2.VideoCapture("http://192.0.0.4:8080/video") #This is IP camera URL, everyone has to set up their own IP camera app on phone

def generate_frames():
    """
    Webcam frames generate karta hai
    Browser ko stream bhejne ke liye
    """
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            _, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route("/video")
def video():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
