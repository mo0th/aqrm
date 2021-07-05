import { render, screen } from '@/tests/test-utils'
import Home from '@/pages/index'

describe('Home page', () => {
  it('Renders next.js', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { name: /soorria/i })).toBeInTheDocument()
  })
})
