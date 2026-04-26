/**
 * 59×59 submit EQ. Bars: filled path + gradient + drop filter (Figma 551_251).
 * Outer circle is only CSS on .icon-circle.audio-btn (stroke ring, no fill).
 */
export default function SubmitEqIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="59"
      height="59"
      viewBox="0 0 59 59"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_551_251)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M44.5074 27.4031C44.5074 26.3537 45.358 25.5031 46.4074 25.5031C47.4567 25.5031 48.3074 26.3537 48.3074 27.4031V30.4031C48.3074 31.4524 47.4567 32.3031 46.4074 32.3031C45.358 32.3031 44.5074 31.4524 44.5074 30.4031V27.4031ZM38.8074 22.3031C38.8074 21.2537 39.658 20.4031 40.7074 20.4031C41.7567 20.4031 42.6074 21.2537 42.6074 22.3031V35.5031C42.6074 36.5524 41.7567 37.4031 40.7074 37.4031C39.658 37.4031 38.8074 36.5524 38.8074 35.5031V22.3031ZM33.1074 24.0031C33.1074 22.9537 33.958 22.1031 35.0074 22.1031C36.0567 22.1031 36.9074 22.9537 36.9074 24.0031V33.8031C36.9074 34.8524 36.0567 35.7031 35.0074 35.7031C33.958 35.7031 33.1074 34.8524 33.1074 33.8031V24.0031ZM27.4074 18.9031C27.4074 17.8537 28.258 17.0031 29.3074 17.0031C30.3567 17.0031 31.2074 17.8537 31.2074 18.9031V38.9031C31.2074 39.9524 30.3567 40.8031 29.3074 40.8031C28.258 40.8031 27.4074 39.9524 27.4074 38.9031V18.9031ZM10.3074 27.4031C10.3074 26.3537 11.158 25.5031 12.2074 25.5031C13.2567 25.5031 14.1074 26.3537 14.1074 27.4031V30.4031C14.1074 31.4524 13.2567 32.3031 12.2074 32.3031C11.158 32.3031 10.3074 31.4524 10.3074 30.4031V27.4031ZM16.0074 22.3031C16.0074 21.2537 16.858 20.4031 17.9074 20.4031C18.9567 20.4031 19.8074 21.2537 19.8074 22.3031V35.5031C19.8074 36.5524 18.9567 37.4031 17.9074 37.4031C16.858 37.4031 16.0074 36.5524 16.0074 35.5031V22.3031ZM21.7074 13.8031C21.7074 12.7537 22.558 11.9031 23.6074 11.9031C24.6567 11.9031 25.5074 12.7537 25.5074 13.8031V44.0031C25.5074 45.0524 24.6567 45.9031 23.6074 45.9031C22.558 45.9031 21.7074 45.0524 21.7074 44.0031V13.8031Z"
          fill="url(#paint0_linear_551_251)"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_551_251"
          x="4.88758e-05"
          y="4.88758e-05"
          width="58.6149"
          height="58.6149"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="0.65" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_551_251"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_551_251"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_551_251"
          x1="29.3074"
          y1="11.9031"
          x2="29.3074"
          y2="45.9031"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.375" stopColor="#11B0FF" />
          <stop offset="0.514423" stopColor="#C5ECFF" />
          <stop offset="0.721154" stopColor="#246789" />
        </linearGradient>
      </defs>
    </svg>
  );
}
