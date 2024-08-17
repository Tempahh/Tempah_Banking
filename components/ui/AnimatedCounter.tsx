'use client'

import CountUp from 'react-countup'

const AnimatedCounter = ({amount} : {amount: number}) => {
  return (
    <div>
      <CountUp end={amount} duration={2.5} prefix='$' decimals={2} separator=','/>
    </div>
  )
}

export default AnimatedCounter
