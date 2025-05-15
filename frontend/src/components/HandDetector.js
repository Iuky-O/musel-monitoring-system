import { useEffect, useRef } from "react";
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import '@tensorflow/tfjs-backend-webgl';

export default function HandDetector({ onFistDetected }) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        let detector;
        let animationId;
        let detectionCounter = 0;

        const setupCamera = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                await videoRef.current.play();
                return true;
            }
            return false;
        };

        // Função melhorada para checar se a mão está fechada (fist)
        function checkIfFist(hand) {
            const tips = [8, 12, 16, 20]; // ponta dos dedos
            const wrist = hand.keypoints.find(p => p.name === 'wrist');

            // Se não tiver o wrist, retorna false
            if (!wrist) return false;

            // Para cada ponta, verificar se está próxima do punho (mão fechada)
            return tips.every(tipIndex => {
                const tip = hand.keypoints[tipIndex];
                if (!tip) return false;
                const dist = Math.hypot(tip.x - wrist.x, tip.y - wrist.y);
                return dist < 40; // ajuste o valor conforme o tamanho do vídeo
            });
        }

        const runDetection = async () => {
            try {
                const ready = await setupCamera();
                if (!ready) return;

                detector = await handPoseDetection.createDetector(
                    handPoseDetection.SupportedModels.MediaPipeHands,
                    {
                        runtime: 'mediapipe',
                        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
                        modelType: 'lite',
                        maxHands: 1,
                    }
                );

                const detect = async () => {
                    if (videoRef.current?.readyState === 4) {
                        const hands = await detector.estimateHands(videoRef.current);

                        if (hands.length > 0) {
                            const isFist = checkIfFist(hands[0]);
                            if (isFist) {
                                detectionCounter++;
                                if (detectionCounter > 3) {
                                    onFistDetected();
                                    detectionCounter = 0;
                                }
                            } else {
                                detectionCounter = 0;
                            }
                        } else {
                            detectionCounter = 0;
                        }
                    }
                    animationId = requestAnimationFrame(detect);
                };

                detect();
            } catch (error) {
                console.error("Erro ao inicializar câmera ou detector:", error);
            }
        };

        runDetection();

        return () => {
            if (animationId) cancelAnimationFrame(animationId);
            if (detector) detector.dispose();
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [onFistDetected]);

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            width="320"
            height="240"
            style={{ display: "none" }}
        />
    );
}
