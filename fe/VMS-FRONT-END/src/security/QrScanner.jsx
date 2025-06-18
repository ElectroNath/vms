import React, { useRef, useEffect } from "react";
import QrScanner from "qr-scanner";

function QrCodeScanner({ onScan, onError }) {
  const videoRef = useRef();
  const scannerRef = useRef();

  useEffect(() => {
    if (!videoRef.current) return;
    // Patch QrScanner to set willReadFrequently: true on canvas
    const origDrawToCanvas = QrScanner._drawToCanvas;
    QrScanner._drawToCanvas = function (canvas, image) {
      if (!canvas._ctx) {
        canvas._ctx = canvas.getContext("2d", { willReadFrequently: true });
      }
      return origDrawToCanvas.call(this, canvas, image);
    };
    scannerRef.current = new QrScanner(
      videoRef.current,
      (result) => {
        if (result?.data) {
          onScan(result.data);
        }
      },
      {
        onDecodeError: (err) => onError && onError(err),
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );
    scannerRef.current.start();
    return () => {
      scannerRef.current?.stop();
      QrScanner._drawToCanvas = origDrawToCanvas;
    };
  }, [onScan, onError]);

  return (
    <div style={{ textAlign: "center" }}>
      <video
        ref={videoRef}
        style={{
          width: 320,
          height: 240,
          borderRadius: 8,
          background: "#222",
        }}
      />
    </div>
  );
}

export default QrCodeScanner;
