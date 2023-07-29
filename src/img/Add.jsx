import Svg, { Path } from 'react-native-svg'

export default function AddSVG ({ color, ...props }) {
  return (
    <Svg
      xmlns='http://www.w3.org/2000/svg'
      width={26}
      height={26}
      fill='none'
      stroke={color}
      viewBox='0 0 24 24'
      {...props}
    >
      <Path stroke='none' d='M0 0h24v24H0z' />
      <Path d='M3 12a9 9 0 1 0 18 0 9 9 0 1 0-18 0m6 0h6m-3-3v6' />
    </Svg>
  )
}
