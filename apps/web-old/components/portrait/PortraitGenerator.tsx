import React, { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { SparklesIcon, PhotoIcon } from '@heroicons/react/24/outline'

interface GeneratedImage {
  url: string
  seed: number
}

interface PortraitGeneratorProps {
  modelId: string
  modelName: string
}

export default function PortraitGenerator({ modelId, modelName }: PortraitGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [numImages, setNumImages] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const supabase = useSupabaseClient()

  const generatePortraits = async () => {
    if (!prompt) {
      alert('Please enter a prompt')
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch(`/api/portrait/generate/${modelId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          negative_prompt: negativePrompt,
          num_images: numImages,
          guidance_scale: 7.5,
          num_inference_steps: 50,
        }),
      })

      if (!response.ok) throw new Error('Generation failed')

      const result = await response.json()
      
      // Save generation to Supabase
      await supabase.from('content_items').insert({
        type: 'portrait',
        status: 'completed',
        prompt,
        metadata: {
          model_id: modelId,
          negative_prompt: negativePrompt,
          images: result.images
        },
        output_urls: result.images.map((img: any) => img.url)
      })

      setGeneratedImages(result.images)
    } catch (error) {
      console.error('Generation error:', error)
      alert('Generation failed: ' + error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Generate Portraits</h2>
        <p className="text-gray-600">
          Using model: {modelName} ({modelId})
        </p>
      </div>

      {/* Prompt inputs */}
      <div className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
            Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="A professional headshot of the person in a business suit"
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="negativePrompt" className="block text-sm font-medium text-gray-700">
            Negative Prompt
          </label>
          <textarea
            id="negativePrompt"
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="blurry, low quality, distorted"
            rows={2}
          />
        </div>

        <div>
          <label htmlFor="numImages" className="block text-sm font-medium text-gray-700">
            Number of Images
          </label>
          <select
            id="numImages"
            value={numImages}
            onChange={(e) => setNumImages(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {[1, 2, 3, 4].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Generate button */}
      <div className="flex justify-end">
        <button
          onClick={generatePortraits}
          disabled={isGenerating || !prompt}
          className={`flex items-center px-4 py-2 rounded-md text-white
            ${isGenerating || !prompt
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'}`}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="h-5 w-5 mr-2" />
              Generate
            </>
          )}
        </button>
      </div>

      {/* Generated images */}
      {generatedImages.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Generated Portraits</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {generatedImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.url}
                  alt={`Generated portrait ${index + 1}`}
                  className="w-full rounded-lg shadow-lg"
                />
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={image.url}
                    download={`portrait_${index + 1}.png`}
                    className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                  >
                    <PhotoIcon className="h-5 w-5 text-gray-600" />
                  </a>
                </div>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  Seed: {image.seed}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
