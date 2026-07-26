import Svg, { Path } from 'react-native-svg'

export default function ChevronRightSVG ({ color, ...props }) {
  return (
    <Svg
      xmlns='http://www.w3.org/2000/svg'
      width={16}
      height={16}
      fill='none'
      stroke={color}
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      viewBox='0 0 24 24'
      {...props}
    >
      <Path d='M9 6l6 6-6 6' />
    </Svg>
  )
}
