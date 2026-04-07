import Svg, { Path } from 'react-native-svg'

export default function MenuSVG ({ color, ...props }) {
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
      className='icon icon-tabler icons-tabler-outline icon-tabler-menu-2'
      viewBox='0 0 24 24'
      {...props}
    >
      <Path stroke='none' d='M0 0h24v24H0z' />
      <Path d='M4 6h16M4 12h16M4 18h16' />
    </Svg>
  )
}
