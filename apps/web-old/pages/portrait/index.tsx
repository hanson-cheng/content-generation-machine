import { useState } from 'react'
import { Tab } from '@headlessui/react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import PortraitTrainer from '../../components/portrait/PortraitTrainer'
import PortraitGenerator from '../../components/portrait/PortraitGenerator'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function PortraitPage() {
  const [selectedModel, setSelectedModel] = useState<{id: string, name: string} | null>(null)
  const supabase = useSupabaseClient()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            AI Portrait Studio
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Train custom models and generate stunning AI portraits
          </p>
        </div>

        <div className="mt-12">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-blue-700 shadow'
                      : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                  )
                }
              >
                Train New Model
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white text-blue-700 shadow'
                      : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                  )
                }
              >
                Generate Portraits
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-8">
              <Tab.Panel>
                <PortraitTrainer />
              </Tab.Panel>
              <Tab.Panel>
                <div className="space-y-8">
                  {/* Model selector */}
                  <div className="max-w-4xl mx-auto">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Model
                    </label>
                    <select
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      value={selectedModel?.id || ''}
                      onChange={async (e) => {
                        if (e.target.value) {
                          const { data } = await supabase
                            .from('content_items')
                            .select('metadata, prompt')
                            .eq('id', e.target.value)
                            .single()
                          
                          if (data) {
                            setSelectedModel({
                              id: data.metadata.model_id,
                              name: data.prompt
                            })
                          }
                        } else {
                          setSelectedModel(null)
                        }
                      }}
                    >
                      <option value="">Select a trained model</option>
                      {/* Models will be populated from Supabase */}
                    </select>
                  </div>

                  {selectedModel && (
                    <PortraitGenerator
                      modelId={selectedModel.id}
                      modelName={selectedModel.name}
                    />
                  )}
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  )
}
