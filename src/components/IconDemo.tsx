import React from 'react'
// Example of importing SVG as React component (when using ?react suffix)
// import LogoSVG from '../assets/icons/logo.svg?react'

// Example of importing SVG as URL
import logoUrl from '../assets/icons/logo.svg'

interface IconDemoProps {
  className?: string
}

export const IconDemo: React.FC<IconDemoProps> = ({ className }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Method 1: SVG as img src */}
      <img src={logoUrl} alt="Logo" className="w-6 h-6" />
      
      {/* Method 2: Inline SVG (you can copy SVG content directly) */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-rixa-blue">
        <path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

      {/* Method 3: SVG as React component (uncomment the import above to use) */}
      {/* <LogoSVG className="w-6 h-6 text-rixa-dark" /> */}
    </div>
  )
}

// SVG Usage Examples:
/*
1. Import SVG as URL: import logoUrl from './logo.svg'
   Use as: <img src={logoUrl} alt="Logo" />

2. Import SVG as React component: import Logo from './logo.svg?react'
   Use as: <Logo className="w-6 h-6" />

3. Inline SVG: Copy SVG content directly into JSX
   Benefits: Full control, can use currentColor, easy to style with Tailwind

4. React Icons: Already configured - import from 'react-icons/fi', 'react-icons/hi', etc.
*/