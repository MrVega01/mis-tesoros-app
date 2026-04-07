import Svg, { Path } from 'react-native-svg'

export default function BackArrowSVG ({ color, ...props }) {
  return (
    <Svg
      xmlns='http://www.w3.org/2000/svg'
      width={24}
      height={24}
      fill='none'
      stroke={color}
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      viewBox='0 0 24 24'
      {...props}
    >
      <Path d='M19 12H5M12 5l-7 7 7 7' />
    </Svg>
  )
}
