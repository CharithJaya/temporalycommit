declare module '@yudiel/react-qr-scanner' {
  import { ComponentType, CSSProperties } from 'react';

  interface QrScannerProps {
    constraints?: MediaTrackConstraints;
    onDecode?: (data: string) => void;
    onError?: (error: any) => void;
    videoStyle?: CSSProperties;
  }

  export const QrScanner: ComponentType<QrScannerProps>;
}
