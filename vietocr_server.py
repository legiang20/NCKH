"""Máy chủ VietOCR nhỏ cho web "AR Cây nhị phân 3D".

Chạy:  pip install -r requirements.txt  &&  python vietocr_server.py
Web chỉ gửi các ô ảnh nhỏ (từng chữ số) mà Tesseract.js đọc chưa chắc. Máy chủ KHÔNG dựng cây.

API
  GET  /health            -> {"ok": true}
  POST /ocr  {"images": ["data:image/png;base64,...", ...]}
             -> {"results": [{"text": "12", "conf": 0.93}, ...]}   (conf trong khoảng 0–1)

Biến môi trường (tuỳ chọn)
  PORT             cổng (mặc định 8000)
  VIETOCR_MODEL    vgg_transformer (mặc định, chính xác hơn) hoặc vgg_seq2seq (nhẹ hơn)
  VIETOCR_DEVICE   cpu (mặc định) hoặc cuda:0
  ALLOWED_ORIGIN   tên miền được gọi, ví dụ https://legiang20.github.io  (mặc định *)
"""
import base64
import io
import os

from flask import Flask, jsonify, request

ALLOWED_ORIGIN = os.environ.get("ALLOWED_ORIGIN", "*")
MAX_IMAGES = 32
MAX_BYTES = 2_000_000          # mỗi ảnh tối đa ~2 MB

app = Flask(__name__)
_detector = None


def get_detector():
    """Nạp mô hình ở lần dùng đầu tiên (tiết kiệm RAM khi chỉ chạy /health)."""
    global _detector
    if _detector is None:
        from vietocr.tool.config import Cfg
        from vietocr.tool.predictor import Predictor

        cfg = Cfg.load_config_from_name(os.environ.get("VIETOCR_MODEL", "vgg_transformer"))
        cfg["device"] = os.environ.get("VIETOCR_DEVICE", "cpu")
        cfg["predictor"]["beamsearch"] = False      # nhanh hơn, đủ cho 1–3 chữ số
        _detector = Predictor(cfg)
    return _detector


@app.after_request
def cors(resp):
    resp.headers["Access-Control-Allow-Origin"] = ALLOWED_ORIGIN
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    resp.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return resp


@app.route("/health")
def health():
    return jsonify(ok=True)


@app.route("/ocr", methods=["POST", "OPTIONS"])
def ocr():
    if request.method == "OPTIONS":
        return ("", 204)
    from PIL import Image

    images = (request.get_json(silent=True) or {}).get("images") or []
    if not isinstance(images, list) or not images or len(images) > MAX_IMAGES:
        return jsonify(error=f"Cần 1–{MAX_IMAGES} ảnh"), 400
    det = get_detector()
    out = []
    for item in images:
        try:
            raw = base64.b64decode(str(item).split(",", 1)[-1])
            if len(raw) > MAX_BYTES:
                raise ValueError("ảnh quá lớn")
            img = Image.open(io.BytesIO(raw)).convert("RGB")
            text, prob = det.predict(img, return_prob=True)
            out.append({"text": text, "conf": float(prob)})
        except Exception:
            out.append({"text": "", "conf": 0.0})   # lỗi một ảnh không làm hỏng cả lô
    return jsonify(results=out)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
