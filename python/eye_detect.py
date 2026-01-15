import cv2
import time
import mediapipe as mp
import pyttsx3
from twilio.rest import Client
import geocoder
import random
import requests

# ================= SPEED =================
def get_demo_speed():
    return random.randint(40, 95)

def evaluate_risk(speed, drowsy):
    if drowsy and speed >= 80:
        return "HIGH"
    elif drowsy:
        return "MEDIUM"
    else:
        return "NORMAL"

# ================= LOCATION =================
def get_current_location():
    try:
        g = geocoder.ip('me')
        if g.ok:
            return f"{g.city}, {g.state}, {g.country}"
    except:
        pass
    return "Location unavailable"

# ================= VOICE =================
engine = pyttsx3.init()
engine.setProperty('rate', 160)

def speak(text):
    engine.say(text)
    engine.runAndWait()

# ================= TWILIO =================
ACCOUNT_SID = "AC39e4527b4c266e80083e177b4a2aa7bb"
AUTH_TOKEN = "c063c182ccbe718b06a8c3ac282240ec"

FROM_WHATSAPP = "whatsapp:+14155238886"
TO_WHATSAPP = "whatsapp:+919548309873"

client = Client(ACCOUNT_SID, AUTH_TOKEN)

WHATSAPP_LIMIT_PER_DAY = 5
whatsapp_sent_count = 0

def send_owner_alert(message):
    try:
        location = get_current_location()
        client.messages.create(
            body=f"{message}\n📍 Location: {location}",
            from_=FROM_WHATSAPP,
            to=TO_WHATSAPP
        )
        print("WhatsApp alert sent")
    except Exception as e:
        print("WhatsApp failed (ignored):", e)


def send_app_alert(message):
    print("APP ALERT:", message)

# ================= MEDIAPIPE =================
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(refine_landmarks=True)

LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [362, 385, 387, 263, 373, 380]

def eye_aspect_ratio(landmarks, eye):
    v1 = abs(landmarks[eye[1]].y - landmarks[eye[5]].y)
    v2 = abs(landmarks[eye[2]].y - landmarks[eye[4]].y)
    h = abs(landmarks[eye[0]].x - landmarks[eye[3]].x)
    return (v1 + v2) / (2.0 * h)

# ================= PARAMETERS =================
EAR_THRESHOLD = 0.20
SLEEP_TIME = 3
ALERT_COOLDOWN = 5

sleep_start = None
last_alert_time = 0

# ================= CAMERA =================
cap = cv2.VideoCapture(0)
# cap = cv2.VideoCapture("http://192.0.0.4:8080/video") #This is IP camera URL, everyone has to set up their own IP camera app on phone
print("System running... Press ESC to exit")

# ---------------- BACKEND ALERT PUSH ----------------

BACKEND_ALERT_URL = "http://localhost:8080/api/alerts"

VEHICLE_ID = "6961840b5369f658154ce523" 
# ⚠️ Ye MongoDB ka _id hai (vehicle collection se)

def send_alert_to_backend(alert_type, message, speed, risk):
    """
    Ye function Python se backend ko alert bhejta hai
    Jisse browser dashboard mein alert dikh sake
    """
    payload = {
        "vehicle": VEHICLE_ID,
        "alertType": alert_type,
        "message": message,
        "speed": speed,
        "riskStatus": risk,
    }

    try:
        res = requests.post(BACKEND_ALERT_URL, json=payload, timeout=3)
        if res.status_code == 201:
            print("Alert pushed to backend")
        else:
            print("Backend error:", res.text)
    except Exception as e:
        print("Backend not reachable:", e)


while True:
    ret, frame = cap.read()
    if not ret:
        break

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb)
    now = time.time()

    if results.multi_face_landmarks:
        for face in results.multi_face_landmarks:
            ear = (
                eye_aspect_ratio(face.landmark, LEFT_EYE) +
                eye_aspect_ratio(face.landmark, RIGHT_EYE)
            ) / 2

            if ear < EAR_THRESHOLD:
                if sleep_start is None:
                    sleep_start = now
                elif now - sleep_start >= SLEEP_TIME:
                    if now - last_alert_time > ALERT_COOLDOWN:

                        print("DROWSINESS DETECTED")
                        speak("Aapko neend aa rahi hai. Gaadi side mein rokiye.")

                        speed = get_demo_speed()
                        risk = evaluate_risk(speed, True)

                        alert_message = (
                            "⚠ DRIVER ALERT\n"
                            "Driver ko neend aa rahi hai\n"
                            f"Speed: {speed} km/h\n"
                            f"Risk: {risk}"
                        )
                        send_app_alert(alert_message)

                        send_alert_to_backend(
                            alert_type="DROWSINESS",
                            message=alert_message,
                            speed=speed,
                            risk=risk
                        )

                        last_alert_time = now
                        sleep_start = None



                        last_alert_time = now
                        sleep_start = None
            else:
                sleep_start = None

    cv2.imshow("Driver Eye Detection", frame)
    if cv2.waitKey(1) & 0xFF == 27:
        break

# ===============Voice for Driver whatsapp ===================
speed = get_demo_speed()
risk = evaluate_risk(speed, True)

alert_text = "Driver ko neend aa rahi hai"

# 1️⃣ Voice alert (driver)
speak("Aapko neend aa rahi hai. Gaadi side mein rokiye.")

# 2️⃣ Backend alert (for browser dashboard)
# send_alert_to_backend(
#     alert_type="DROWSINESS",
#     message=alert_text,
#     speed=speed,
#     risk=risk
# )

cap.release()
cv2.destroyAllWindows()
