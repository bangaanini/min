import { useState, useEffect } from 'react';


const Slider = () => {
  const [sliderValue, setSliderValue] = useState(50);
  const estimatedProfit = sliderValue * 0.3;
  
  return (
    <section className="max-w-4xl mx-auto my-12 p-6 bg-gray-900 rounded-xl shadow-[0_0_20px_-5px_rgba(96,165,250,0.3)]">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center mb-8">PROFIT CALCULATION</h2>
      <div className="p-6 border border-gray-700 rounded-xl bg-gradient-to-br from-blue-900/50 to-purple-900/50">
        <div className="text-center">
          <span className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ${sliderValue}
          </span>
            <div className="text-green-400 text-md font-semibold mt-2 p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-gray-700">Estimated Profit on 30D: ${estimatedProfit.toFixed(2)}</div>
              <div className="px-6 py-4 bg-gradient-to-br from-blue-800 to-purple-800 rounded-lg mb-6">
                <label htmlFor="depositSlider" className="block text-gray-200 mb-2">
                  Slide to see profit based on USDT balance in your wallet
                </label>
                <input
                  id="depositSlider"
                  type="range"
                  min={50}
                  max={5000}
                  step={10}
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-gray-300 mt-2">
                  <span>${sliderValue}</span>
                  <span>Est. Profit: ${estimatedProfit.toFixed(2)}</span>
                </div>
              </div>
                <div className="mt-4 space-y-3">
                  {[
                    ['Participants:', '1,297'],
                    ['Total Investment:', '$92,000.00'],
                    ['Total Profit:', '$196,200.00']
                  ].map(([label, value], index) => (
                    <div
                      key={index}
                      className="flex justify-between p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-gray-700"
                    >
                      <span className="text-gray-300">{label}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
            <div className="mt-4 space-y-3">
            </div>
        </div>
      </div>
    </section>
  );
};

export default Slider;
