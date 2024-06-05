import Svg, { Path } from 'react-native-svg'

export default function EditSVG ({ color, ...props }) {
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
      viewBox='0 0 24 24'
      className='icon icon-tabler icons-tabler-outline icon-tabler-pencil-minus'
      {...props}
    >
      <Path stroke='none' d='M0 0h24v24H0z' />
      <Path d='M4 20h4L18.5 9.5a2.828 2.828 0 1 0-4-4L4 16v4M13.5 6.5l4 4M16 19h6' />
    </Svg>
  )
}
