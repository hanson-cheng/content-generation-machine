import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { TrashIcon, PhotoIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { useSupabaseClient } from '@supabase/auth-helpers-react'

interface TrainingImage {
  file: File
  preview: string
}

export default function PortraitTrainer() {
  const [images, setImages] = useState<TrainingImage[]>([])
  const [instanceName, setInstanceName] = useState('')
  const [isTraining, setIsTraining] = useState(false)
  const [progress, setProgress] = useState(0)
  const supabase = useSupabaseClient()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    setImages(prev => [...prev, ...newImages].slice(0, 20)) // Limit to 20 images
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 5242880, // 5MB
  })

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev]
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })
  }

  const startTraining = async () => {
    if (images.length < 5) {
      alert('Please upload at least 5 images')
      return
    }

    if (!instanceName) {
      alert('Please enter a name for your model')
      return
    }

    setIsTraining(true)
    setProgress(0)

    try {
      // Create form data
      const formData = new FormData()
      formData.append('instance_name', instanceName)
      images.forEach(image => {
        formData.append('files', image.file)
      })

      // Start training
      const response = await fetch('/api/portrait/train', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Training failed')

      const result = await response.json()
      
      // Save training info to Supabase
      await supabase.from('content_items').insert({
        type: 'portrait_model',
        status: 'completed',
        prompt: instanceName,
        metadata: {
          model_id: result.model_id,
          num_images: images.length
        }
      })

      alert('Training completed! Model ID: ' + result.model_id)
    } catch (error) {
      console.error('Training error:', error)
      alert('Training failed: ' + error.message)
    } finally {
      setIsTraining(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Train Portrait Model</h2>
        <p className="text-gray-600">
          Upload 5-20 high-quality photos of the subject to train a personalized portrait model.
        </p>
      </div>

      {/* Name input */}
      <div>
        <label htmlFor="instanceName" className="block text-sm font-medium text-gray-700">
          Model Name
        </label>
        <input
          type="text"
          id="instanceName"
          value={instanceName}
          onChange={(e) => setInstanceName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="e.g., John's Portrait Model"
        />
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
      >
        <input {...getInputProps()} />
        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag & drop images here, or click to select files
        </p>
        <p className="text-xs text-gray-500">
          JPG, PNG up to 5MB
        </p>
      </div>

      {/* Image previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={image.preview} className="relative group">
              <img
                src={image.preview}
                alt={`Training image ${index + 1}`}
                className="h-32 w-full object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Training button */}
      <div className="flex justify-end">
        <button
          onClick={startTraining}
          disabled={isTraining || images.length < 5 || !instanceName}
          className={`flex items-center px-4 py-2 rounded-md text-white
            ${isTraining || images.length < 5 || !instanceName
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'}`}
        >
          {isTraining ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Training...
            </>
          ) : (
            <>
              <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
              Start Training
            </>
          )}
        </button>
      </div>

      {/* Progress bar */}
      {isTraining && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  )
}
