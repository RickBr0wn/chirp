import { withClerkMiddleware } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default withClerkMiddleware((req: NextRequest) => {
  console.log('Middleware running')
  console.log(req)
  return NextResponse.next()
})

// Stop middleware from running on static files
export const config = {
  matcher: '/((?!_next/image|_next/static|favicon.ico).)*',
}
