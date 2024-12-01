import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ContentGenerator } from '../components/content/ContentGenerator'
import { useContentGeneration } from '../hooks/useContentGeneration'
import { mockContentResponse } from '../__mocks__/contentResponses'

// Mock the content generation hook
jest.mock('../hooks/useContentGeneration')
const mockUseContentGeneration = useContentGeneration as jest.Mock

describe('ContentGenerator Component', () => {
  beforeEach(() => {
    mockUseContentGeneration.mockReturnValue({
      generate: jest.fn().mockResolvedValue(mockContentResponse),
      isLoading: false,
      error: null
    })
  })

  it('renders the content generation form', () => {
    render(<ContentGenerator />)
    
    expect(screen.getByLabelText(/prompt/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument()
  })

  it('handles content generation submission', async () => {
    const mockGenerate = jest.fn().mockResolvedValue(mockContentResponse)
    mockUseContentGeneration.mockReturnValue({
      generate: mockGenerate,
      isLoading: false,
      error: null
    })

    render(<ContentGenerator />)
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/prompt/i), {
      target: { value: 'Test prompt' }
    })
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /generate/i }))
    
    await waitFor(() => {
      expect(mockGenerate).toHaveBeenCalledWith({
        prompt: 'Test prompt',
        settings: expect.any(Object)
      })
    })
  })

  it('displays loading state', () => {
    mockUseContentGeneration.mockReturnValue({
      generate: jest.fn(),
      isLoading: true,
      error: null
    })

    render(<ContentGenerator />)
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('displays error message when generation fails', () => {
    const errorMessage = 'Generation failed'
    mockUseContentGeneration.mockReturnValue({
      generate: jest.fn(),
      isLoading: false,
      error: new Error(errorMessage)
    })

    render(<ContentGenerator />)
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('displays generated content', async () => {
    const mockResponse = {
      status: 'success',
      outputs: [{
        type: 'image',
        url: 'https://example.com/image.jpg'
      }]
    }

    mockUseContentGeneration.mockReturnValue({
      generate: jest.fn().mockResolvedValue(mockResponse),
      isLoading: false,
      error: null
    })

    render(<ContentGenerator />)
    
    // Generate content
    fireEvent.change(screen.getByLabelText(/prompt/i), {
      target: { value: 'Test prompt' }
    })
    fireEvent.click(screen.getByRole('button', { name: /generate/i }))
    
    // Wait for content to be displayed
    await waitFor(() => {
      expect(screen.getByAltText(/generated content/i)).toHaveAttribute(
        'src',
        'https://example.com/image.jpg'
      )
    })
  })

  it('handles different content types', async () => {
    const mockResponse = {
      status: 'success',
      outputs: [
        {
          type: 'image',
          url: 'https://example.com/image.jpg'
        },
        {
          type: 'audio',
          url: 'https://example.com/audio.mp3'
        }
      ]
    }

    mockUseContentGeneration.mockReturnValue({
      generate: jest.fn().mockResolvedValue(mockResponse),
      isLoading: false,
      error: null
    })

    render(<ContentGenerator />)
    
    // Generate content
    fireEvent.change(screen.getByLabelText(/prompt/i), {
      target: { value: 'Test prompt' }
    })
    fireEvent.click(screen.getByRole('button', { name: /generate/i }))
    
    // Wait for all content to be displayed
    await waitFor(() => {
      expect(screen.getByAltText(/generated content/i)).toBeInTheDocument()
      expect(screen.getByRole('audio')).toBeInTheDocument()
    })
  })
})
