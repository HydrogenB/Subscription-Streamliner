export function DisneyPlusIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.5,8.041c-0.271-2.49-1.991-4.595-4.481-5.188c-1.849-0.442-3.793-0.203-5.467,0.643c-1.385,0.701-2.618,1.758-3.64,3.093 c-1.205,1.579-1.923,3.447-2.074,5.433c-0.103,1.365,0.117,2.736,0.643,4.01c0.413,1.002,1.018,1.91,1.787,2.678 c0.773,0.771,1.691,1.384,2.716,1.813c2.09,0.873,4.354,1.056,6.545,0.536c2.479-0.587,4.603-2.22,5.55-4.52 C21.737,13.048,22.016,10.45,21.5,8.041z" fill="url(#disneyGradient)" />
        <text x="12" y="16" fontFamily="Arial, sans-serif" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">+</text>
        <defs>
          <linearGradient id="disneyGradient" x1="2.5" y1="12" x2="21.5" y2="12" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3953A4" />
            <stop offset="1" stopColor="#00AEEF" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
