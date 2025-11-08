// Temporary JSX IntrinsicElements shims for React Three Fiber + three
// This ensures TS recognizes <mesh />, <sphereGeometry />, lights, etc.
import '@react-three/fiber'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any
      group: any
      sphereGeometry: any
      meshBasicMaterial: any
      meshStandardMaterial: any
      ambientLight: any
      directionalLight: any
    }
  }
}
