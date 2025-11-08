// Fallback JSX intrinsic elements to unblock TS in three-fiber context
// This is a pragmatic override for demo purposes. Replace with precise types later.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}
export {}
