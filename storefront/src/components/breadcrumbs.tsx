'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbsProps {
  productTitle?: string
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ productTitle }) => {
  const pathname = usePathname()
  const [segments, setSegments] = useState<Array<{ name: string; href: string }>>([])
  
  useEffect(() => {
    if (!pathname) return

    const countryCodeMatch = pathname.match(/^\/([a-z]{2})\//)
    const countryCode = countryCodeMatch ? countryCodeMatch[1] : ''
    const pathWithoutCountry = countryCodeMatch 
      ? pathname.substring(countryCodeMatch[0].length) 
      : pathname

    const pathSegments = pathWithoutCountry.split('/').filter(Boolean)

    const breadcrumbSegments = []

    breadcrumbSegments.push({
      name: 'Home',
      href: `/${countryCode}`
    })

    breadcrumbSegments.push({
      name: 'Shop',
      href: `/${countryCode}/shop`
    })

    if (pathSegments[0] === 'products' && productTitle && pathSegments.length > 1) {
      breadcrumbSegments.push({
        name: productTitle,
        href: pathname
      })
    }

    setSegments(breadcrumbSegments)
  }, [pathname, productTitle])

  return (
    <nav aria-label="Breadcrumb" className="mx-auto py-2 text-sm text-gray-800">
      <ol className="flex flex-wrap items-center">
        {segments.map((segment, index) => (
          <li key={segment.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight 
                size={16} 
                className="mx-1 text-gray-500 shrink-0" 
                aria-hidden="true" 
              />
            )}
            {index === segments.length - 1 ? (
              <span 
                className="truncate max-w-[150px] sm:max-w-xs text-gray-900 font-normal" 
                title={segment.name}
              >
                {segment.name}
              </span>
            ) : (
              <Link 
                href={segment.href}
                className="font-semibold text-gray-700 hover:text-black hover:underline transition truncate max-w-[100px] sm:max-w-xs"
                title={segment.name}
              >
                {segment.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
