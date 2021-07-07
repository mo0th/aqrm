import type { AnchorHTMLAttributes, ElementType } from 'react'
import NextLink from 'next/link'

type LinkProps = {
  href: string
  as?: ElementType
} & AnchorHTMLAttributes<HTMLAnchorElement>

const linkClass = 'text-purple-700 hover:text-purple-600 hover:underline'

const Link: React.FC<LinkProps> = ({ href, as: Component = 'a', children, ...rest }) => {
  const isExternal = href.startsWith('http')
  return isExternal ? (
    <Component className={linkClass} href={href} {...rest}>
      {children}
    </Component>
  ) : (
    <NextLink href={href} passHref>
      <Component className={linkClass} {...rest}>
        {children}
      </Component>
    </NextLink>
  )
}

export default Link
