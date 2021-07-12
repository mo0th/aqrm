import type { AnchorHTMLAttributes, ElementType } from 'react'
import NextLink from 'next/link'
import clsx from 'clsx'

type LinkProps = {
  href: string
  as?: ElementType
} & AnchorHTMLAttributes<HTMLAnchorElement>

const linkClass = 'text-primary-700 hover:text-primary-600 hover:underline'

const Link: React.FC<LinkProps> = ({
  href,
  as: Component = 'a',
  children,
  className: extraClassName,
  ...rest
}) => {
  const isExternal = href.startsWith('http')
  const className = clsx(linkClass, extraClassName)
  return isExternal ? (
    <Component className={className} href={href} {...rest}>
      {children}
    </Component>
  ) : (
    <NextLink href={href} passHref>
      <Component className={className} {...rest}>
        {children}
      </Component>
    </NextLink>
  )
}

export default Link
