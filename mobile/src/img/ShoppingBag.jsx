import Svg, { Path } from 'react-native-svg'

export default function ShoppingBagSVG ({ color, ...props }) {
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
      className='icon icon-tabler icon-tabler-shopping-bag'
      viewBox='0 0 24 24'
      {...props}
    >
      <Path stroke='none' d='M0 0h24v24H0z' />
      <Path d='M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152A3 3 0 0 1 15.426 21H8.574a3 3 0 0 1-2.965-2.544l-1.255-8.152A2 2 0 0 1 6.33 8M9 11V6a3 3 0 0 1 6 0v5' />
    </Svg>
  )
}
