import Svg, { Path } from 'react-native-svg'

export default function StoreSVG ({ color, ...props }) {
  return (
    <Svg
      xmlns='http://www.w3.org/2000/svg'
      width={26}
      height={26}
      fill='none'
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      className='icon icon-tabler icon-tabler-building-store'
      viewBox='0 0 24 24'
      {...props}
    >
      <Path stroke='none' d='M0 0h24v24H0z' />
      <Path d='M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4M5 21V10.85M19 21V10.85M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4' />
    </Svg>
  )
}
