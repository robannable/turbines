import { useState } from 'react'
import { calculateTurbineDesign, TurbineInputs, TurbineDesign } from './utils/calculations'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { BladeVisualization } from './components/BladeVisualization'
import { TurbineAnimation } from './components/TurbineAnimation'
import { OpenScadExport } from './components/OpenScadExport'

function App() {
  const [inputs, setInputs] = useState<TurbineInputs>({
    tipSpeedRatio: 7,
    numberOfBlades: 3,
    numberOfStations: 10
  });
  const [design, setDesign] = useState<TurbineDesign | null>(null);
  const [calculationMode, setCalculationMode] = useState<'generator' | 'diameter'>('generator');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = calculateTurbineDesign(inputs);
      setDesign(result);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Wind Turbine Propeller Designer
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              <div>
                <label htmlFor="tsr" className="block text-sm font-medium leading-6 text-gray-900">
                  Tip Speed Ratio
                </label>
                <input
                  type="number"
                  id="tsr"
                  className="input-field"
                  value={inputs.tipSpeedRatio}
                  onChange={(e) => setInputs({ ...inputs, tipSpeedRatio: Number(e.target.value) })}
                  step="0.1"
                  min="1"
                  required
                />
              </div>

              <div>
                <label htmlFor="blades" className="block text-sm font-medium leading-6 text-gray-900">
                  Number of Blades
                </label>
                <input
                  type="number"
                  id="blades"
                  className="input-field"
                  value={inputs.numberOfBlades}
                  onChange={(e) => setInputs({ ...inputs, numberOfBlades: Number(e.target.value) })}
                  min="1"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                  Calculation Mode
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-semibold rounded-md ${
                      calculationMode === 'generator'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                    onClick={() => setCalculationMode('generator')}
                  >
                    Match Generator
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-semibold rounded-md ${
                      calculationMode === 'diameter'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                    onClick={() => setCalculationMode('diameter')}
                  >
                    Choose Diameter
                  </button>
                </div>
              </div>

              {calculationMode === 'generator' ? (
                <>
                  <div>
                    <label htmlFor="power" className="block text-sm font-medium leading-6 text-gray-900">
                      Generator Power (watts)
                    </label>
                    <input
                      type="number"
                      id="power"
                      className="input-field"
                      value={inputs.generatorPower || ''}
                      onChange={(e) => setInputs({ ...inputs, generatorPower: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="rpm" className="block text-sm font-medium leading-6 text-gray-900">
                      Generator RPM
                    </label>
                    <input
                      type="number"
                      id="rpm"
                      className="input-field"
                      value={inputs.generatorRPM || ''}
                      onChange={(e) => setInputs({ ...inputs, generatorRPM: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="ratio" className="block text-sm font-medium leading-6 text-gray-900">
                      Gear Ratio (1 for direct drive)
                    </label>
                    <input
                      type="number"
                      id="ratio"
                      className="input-field"
                      value={inputs.gearRatio || 1}
                      onChange={(e) => setInputs({ ...inputs, gearRatio: Number(e.target.value) })}
                      min="1"
                      step="0.1"
                      required
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label htmlFor="diameter" className="block text-sm font-medium leading-6 text-gray-900">
                    Diameter (meters)
                  </label>
                  <input
                    type="number"
                    id="diameter"
                    className="input-field"
                    value={inputs.diameter || ''}
                    onChange={(e) => setInputs({ ...inputs, diameter: Number(e.target.value) })}
                    step="0.1"
                    required
                  />
                </div>
              )}

              <div>
                <label htmlFor="stations" className="block text-sm font-medium leading-6 text-gray-900">
                  Number of Stations
                </label>
                <input
                  type="number"
                  id="stations"
                  className="input-field"
                  value={inputs.numberOfStations}
                  onChange={(e) => setInputs({ ...inputs, numberOfStations: Number(e.target.value) })}
                  min="5"
                  max="20"
                  required
                />
              </div>
            </div>

            <div>
              <button type="submit" className="btn-primary w-full">
                Calculate Design
              </button>
            </div>
          </form>

          {design && (
            <div className="mt-8 space-y-6">
              {design.warnings.length > 0 && (
                <div className="rounded-md bg-yellow-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Attention needed</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <ul className="list-disc space-y-1 pl-5">
                          {design.warnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-4">Design Results</h2>
                  <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Diameter</dt>
                      <dd className="mt-1 text-sm text-gray-900">{design.diameter.toFixed(3)} meters</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Rated Windspeed</dt>
                      <dd className="mt-1 text-sm text-gray-900">{design.ratedWindspeed.toFixed(2)} m/s</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Torque at 3m/s</dt>
                      <dd className="mt-1 text-sm text-gray-900">{design.torque.toFixed(2)} Nm</dd>
                    </div>
                  </dl>
                </div>

                <TurbineAnimation 
                  numberOfBlades={inputs.numberOfBlades}
                  tipSpeedRatio={inputs.tipSpeedRatio}
                />
              </div>

              <BladeVisualization 
                stations={design.stations}
                diameter={design.diameter}
              />

              <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6 overflow-x-auto">
                <h2 className="text-xl font-semibold mb-4">Station Measurements</h2>
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Radius (m)</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Setting (°)</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Chord (m)</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Width (m)</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Drop (m)</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Thickness (m)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {design.stations.map((station, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{station.radius.toFixed(3)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{station.setting.toFixed(2)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{station.chord.toFixed(3)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{station.width.toFixed(3)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{station.drop.toFixed(3)}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{station.thickness.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <OpenScadExport
                stations={design.stations}
                diameter={design.diameter}
                numberOfBlades={inputs.numberOfBlades}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
