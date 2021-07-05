/// <reference types="next" />
/// <reference types="next/types/global" />

/**
 * Put type declarations in here
 */

declare namespace NodeJS {
  // Extend `process.env` for better type completion
  interface ProcessEnv {}
}
