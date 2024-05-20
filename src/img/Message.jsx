import Svg, { Path } from 'react-native-svg'

export default function MessageSVG ({ color, ...props }) {
  return (
    <Svg
      xmlns='http://www.w3.org/2000/svg'
      width={24}
      height={24}
      fill='none'
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      className='icon icon-tabler icons-tabler-outline icon-tabler-message'
      viewBox='0 0 24 24'
      {...props}
    >
      <Path stroke='none' d='M0 0h24v24H0z' />
      <Path d='M8 9h8M8 13h6M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-5l-5 3v-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h12z' />
    </Svg>
  )
}
