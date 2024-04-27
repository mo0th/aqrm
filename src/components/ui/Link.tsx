import type { AnchorHTMLAttributes } from 'react'
import NextLink from 'next/link'
import clsx from 'clsx'

type LinkProps = {
  href: string
} & AnchorHTMLAttributes<HTMLAnchorElement>

const linkClass = 'text-primary-700 hover:text-primary-600 hover:underline'

const Link: React.FC<LinkProps> = ({ href, children, className: extraClassName, ...rest }) => {
  const isExternal = href.startsWith('http')
  const className = clsx(linkClass, extraClassName)
  return isExternal ? (
    <a className={className} href={href} {...rest}>
      {children}
    </a>
  ) : (
    <NextLink href={href} passHref className={className} {...rest}>
      {children}
    </NextLink>
  )
}

export default Link
