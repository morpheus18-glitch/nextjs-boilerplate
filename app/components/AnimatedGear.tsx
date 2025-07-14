'use client'
import { CSSProperties } from 'react'

const gearStyle: CSSProperties = {
  width: '80px',
  height: '80px',
  transformStyle: 'preserve-3d',
  animation: 'spin 8s linear infinite'
}

const svgStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  fill: '#4fd1ff'
}

export default function AnimatedGear() {
  return (
    <div style={gearStyle}>
      <svg viewBox="0 0 100 100" style={svgStyle}>
        <path d="M50 34a16 16 0 1 0 0 32 16 16 0 0 0 0-32Zm0-20 5 13a30 30 0 0 1 10 4l12-6 6 10-10 8a30 30 0 0 1 0 12l10 8-6 10-12-6a30 30 0 0 1-10 4l-5 13h-12l-5-13a30 30 0 0 1-10-4l-12 6-6-10 10-8a30 30 0 0 1 0-12l-10-8 6-10 12 6a30 30 0 0 1 10-4l5-13Z" />
      </svg>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate3d(0, 1, 0, 0deg); }
          to { transform: rotate3d(0, 1, 0, 360deg); }
        }
      `}</style>
    </div>
  )
}
