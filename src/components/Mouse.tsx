import Image from 'next/image'
import Link from 'next/link'

type MouseProps = {} 

const Mouse = ({} : MouseProps) => {
  return (
    <div>
        <div className="mouse"/>
        <Image
          className="arrow"
          alt="arrow"
          width={2}
          height={2}
          src="/arrow.svg"
        />
        <Image
          className="mouse"
          alt="mouse"
          width={2}
          height={2}
          src="/mouse.svg"
        />
        <li>
          <Link href="/">
            <Image
              alt="corner"
              className="corner"
              height={2}
              width={2}
              src="/corner.svg"
            />
          </Link>
        </li>
    </div>
  )
}
