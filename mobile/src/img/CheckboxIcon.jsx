import Svg, { Rect, Path } from 'react-native-svg'

export default function CheckboxIconSVG ({ checked, color, size = 20 }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox='0 0 20 20'
      fill='none'
    >
      <Rect
        x={1}
        y={1}
        width={18}
        height={18}
        rx={3}
        stroke={color}
        strokeWidth={1.5}
        fill={checked ? 'rgba(221,133,31,0.15)' : 'none'}
      />
      {checked && (
        <Path
          d='M 4 10 L 8 14 L 16 6'
          stroke={color}
          strokeWidth={2}
          strokeLinecap='round'
          strokeLinejoin='round'
          fill='none'
        />
      )}
    </Svg>
  )
}
