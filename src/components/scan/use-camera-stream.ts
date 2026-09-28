import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface UseCameraStreamOptions {
  enabled: boolean;
}

export function useCameraStream({ enabled }: UseCameraStreamOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [activeCameraLabel, setActiveCameraLabel] = useState<string>("");
  const [flashlightOn, setFlashlightOn] = useState(false);

  // Safely stop stream tracks
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  // Start camera with graceful progressive fallback
  const startCamera = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setCameraError("La cámara no está disponible o no es compatible con este navegador.");
      setIsCameraLoading(false);
      return;
    }

    setIsCameraLoading(true);
    setCameraError(null);
    stopStream();

    const constraintsToTry: MediaStreamConstraints[] = [];

    if (selectedCameraId) {
      constraintsToTry.push({
        video: {
          deviceId: { ideal: selectedCameraId },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
    }

    constraintsToTry.push({
      video: {
        facingMode: { ideal: cameraFacing },
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
      audio: false,
    });

    constraintsToTry.push({
      video: {
        facingMode: { ideal: cameraFacing === "environment" ? "user" : "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });

    constraintsToTry.push({
      video: true,
      audio: false,
    });

    let activeStream: MediaStream | null = null;
    let lastError: unknown = null;

    for (const constraints of constraintsToTry) {
      try {
        activeStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (activeStream) break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!activeStream) {
      console.warn("Camera stream acquisition failed:", lastError);
      setIsCameraActive(false);
      setIsCameraLoading(false);
      setCameraError("No se pudo conectar con la cámara. Verifica los permisos del navegador.");
      return;
    }

    streamRef.current = activeStream;
    if (videoRef.current) {
      videoRef.current.srcObject = activeStream;
      videoRef.current.play().catch((err) => {
        console.warn("Video autoplay error:", err);
      });
    }

    setIsCameraActive(true);
    setIsCameraLoading(false);

    const activeTrack = activeStream.getVideoTracks()[0];
    if (activeTrack) {
      setActiveCameraLabel(activeTrack.label || "Cámara Activa");
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((d) => d.kind === "videoinput" && d.deviceId);
      setAvailableCameras(videoDevices);
    } catch (err) {
      console.warn("Error enumerating devices:", err);
    }
  }, [selectedCameraId, cameraFacing, stopStream]);

  // Synchronize stream lifecycle
  useEffect(() => {
    if (enabled) {
      startCamera();
    } else {
      stopStream();
    }

    return () => {
      stopStream();
    };
  }, [enabled, startCamera, stopStream]);

  // Re-attach srcObject whenever element mounts
  useEffect(() => {
    if (videoRef.current && streamRef.current && videoRef.current.srcObject !== streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  });

  const handleToggleCameraFacing = () => {
    if (availableCameras.length > 1) {
      const currentIdx = availableCameras.findIndex((c) => c.deviceId === selectedCameraId);
      const nextIdx = (currentIdx + 1) % availableCameras.length;
      const nextDev = availableCameras[nextIdx];
      setSelectedCameraId(nextDev.deviceId);
      setActiveCameraLabel(nextDev.label || `Cámara ${nextIdx + 1}`);
      toast.info(`Cambiando a: ${nextDev.label || `Cámara ${nextIdx + 1}`}`);
    } else {
      const newFacing = cameraFacing === "environment" ? "user" : "environment";
      setCameraFacing(newFacing);
      setSelectedCameraId("");
      toast.info(newFacing === "user" ? "Cámara frontal" : "Cámara trasera");
    }
  };

  const handleToggleFlashlight = async () => {
    const nextState = !flashlightOn;
    setFlashlightOn(nextState);
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track) {
        try {
          const capabilities = (track.getCapabilities && track.getCapabilities()) as any;
          if (capabilities && "torch" in capabilities) {
            await (track as any).applyConstraints({
              advanced: [{ torch: nextState }],
            });
          }
        } catch (e) {
          console.warn("Torch constraint not supported:", e);
        }
      }
    }
  };

  const captureSnapshot = (): string | null => {
    if (videoRef.current && isCameraActive) {
      const video = videoRef.current;
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          if (cameraFacing === "user" && !selectedCameraId) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          return canvas.toDataURL("image/jpeg", 0.92);
        }
      }
    }
    return null;
  };

  return {
    videoRef,
    streamRef,
    isCameraActive,
    isCameraLoading,
    cameraError,
    cameraFacing,
    selectedCameraId,
    setSelectedCameraId,
    availableCameras,
    activeCameraLabel,
    setActiveCameraLabel,
    flashlightOn,
    startCamera,
    stopStream,
    handleToggleCameraFacing,
    handleToggleFlashlight,
    captureSnapshot,
  };
}
