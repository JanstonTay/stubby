export function Sitemap() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[1400px] p-8">
        {/* 3.0 Home Page - Small at top */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-col items-center">
            <div className="border-2 border-gray-800 bg-white p-4 rounded-lg w-48">
              <div className="border-b-2 border-gray-800 pb-2 mb-3">
                <p className="text-center">3.0 Home</p>
              </div>
              <div className="space-y-2 text-xs">
                <div className="border border-gray-400 rounded p-1.5 text-center bg-gray-50">
                  Matchmaking
                </div>
                <div className="border border-gray-400 rounded p-1.5 text-center bg-gray-50">
                  Sessions
                </div>
                <div className="border border-gray-400 rounded p-1.5 text-center bg-gray-50">
                  Chat
                </div>
              </div>
            </div>
            {/* Arrow down */}
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-8 bg-gray-800"></div>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-gray-800"></div>
            </div>
          </div>
        </div>

        {/* 6.0 Matchmaking Page - Bigger in center */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-col items-center">
            <div className="border-2 border-gray-800 bg-white p-4 rounded-lg w-80">
              <div className="border-b-2 border-gray-800 pb-2 mb-3 flex items-center justify-between">
                <p>6.0 Matchmaking</p>
                <span className="text-xs">⚙</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="border border-gray-400 p-1.5 rounded flex items-center justify-between bg-gray-50">
                  <span>Header bar with ⚙</span>
                </div>
                <div className="border border-gray-400 p-1.5 rounded bg-gray-50">
                  [Filter row]
                </div>
                <div className="border-2 border-gray-800 p-3 rounded bg-yellow-50">
                  <div className="flex items-center justify-between">
                    <span>Best Match</span>
                    <span>★</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="border border-gray-400 p-1.5 rounded bg-gray-50">Card 2</div>
                  <div className="border border-gray-400 p-1.5 rounded bg-gray-50">Card 3</div>
                </div>
                <div className="border border-gray-800 p-1.5 rounded text-center bg-blue-100">
                  Group session
                </div>
              </div>
            </div>
            {/* Four arrows down */}
            <div className="flex justify-between w-full pt-4">
              <div className="flex flex-col items-center w-1/4">
                <div className="w-0.5 h-8 bg-gray-800"></div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-gray-800"></div>
              </div>
              <div className="flex flex-col items-center w-1/4">
                <div className="w-0.5 h-8 bg-gray-800"></div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-gray-800"></div>
              </div>
              <div className="flex flex-col items-center w-1/4">
                <div className="w-0.5 h-8 bg-gray-800"></div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-gray-800"></div>
              </div>
              <div className="flex flex-col items-center w-1/4">
                <div className="w-0.5 h-8 bg-gray-800"></div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-gray-800"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Row of 6.1, 6.2, 6.3, 6.4 */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {/* 6.1 Preferences */}
          <div className="flex flex-col items-center">
            <div className="border-2 border-gray-800 bg-white p-4 rounded-lg w-full">
              <div className="border-b-2 border-gray-800 pb-2 mb-3">
                <p className="text-sm">6.1 Preferences</p>
              </div>
              <div className="space-y-2 text-xs">
                <div className="border border-gray-400 p-1.5 rounded bg-gray-50">
                  [Summary panel]
                </div>
                <div className="border border-gray-400 p-1.5 rounded flex items-center justify-between bg-gray-50">
                  <span>Modules & diff</span>
                  <span>&gt;</span>
                </div>
                <div className="border border-gray-400 p-1.5 rounded flex items-center justify-between bg-gray-50">
                  <span>Mode & time</span>
                  <span>&gt;</span>
                </div>
                <div className="border border-gray-400 p-1.5 rounded flex items-center justify-between bg-gray-50">
                  <span>Auto-match</span>
                  <span>&gt;</span>
                </div>
                <div className="border border-gray-800 p-1.5 rounded text-center mt-3 bg-red-50">
                  Reset
                </div>
              </div>
            </div>
            {/* Three arrows down for sub-pages */}
            <div className="flex justify-between w-full pt-4">
              <div className="flex flex-col items-center w-1/3">
                <div className="w-0.5 h-8 bg-gray-800"></div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-gray-800"></div>
              </div>
              <div className="flex flex-col items-center w-1/3">
                <div className="w-0.5 h-8 bg-gray-800"></div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-gray-800"></div>
              </div>
              <div className="flex flex-col items-center w-1/3">
                <div className="w-0.5 h-8 bg-gray-800"></div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-gray-800"></div>
              </div>
            </div>
          </div>

          {/* 6.2 Match Profile */}
          <div className="border-2 border-gray-800 bg-white p-4 rounded-lg">
            <div className="border-b-2 border-gray-800 pb-2 mb-3">
              <p className="text-sm">6.2 Match Profile</p>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-gray-400 bg-gray-50"></div>
              </div>
              <div className="text-center border-b border-gray-300 pb-1">
                [Name + course]
              </div>
              <div className="border border-gray-400 rounded bg-green-100 p-1 text-center">
                Match 92%
              </div>
              <div className="space-y-1 text-xs">
                <div>• Why match point 1</div>
                <div>• Why match point 2</div>
              </div>
              <div className="border border-gray-400 rounded p-1.5 bg-gray-50 text-xs">
                [Intro text block]
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="border border-gray-800 p-1 rounded text-center bg-blue-100">
                  Request
                </div>
                <div className="border border-gray-800 p-1 rounded text-center bg-green-100">
                  Chat
                </div>
              </div>
            </div>
          </div>

          {/* 6.3 Send Request */}
          <div className="border-2 border-gray-800 bg-white p-4 rounded-lg">
            <div className="border-b-2 border-gray-800 pb-2 mb-3">
              <p className="text-sm">6.3 Send Request</p>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex gap-2 items-center">
                <span>(•) 1-1</span>
                <span>( ) Group</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-gray-400 p-1.5 rounded bg-gray-50">Date</div>
                <div className="border border-gray-400 p-1.5 rounded bg-gray-50">Time</div>
              </div>
              <div className="border border-gray-400 p-1.5 rounded bg-gray-50">
                [Mode dropdown ▼]
              </div>
              <div className="border border-gray-400 p-2 rounded bg-gray-50">
                Topic field
              </div>
              <div className="border border-gray-400 p-3 rounded bg-gray-50">
                Message field
              </div>
              <div className="border border-gray-800 p-1.5 rounded text-center bg-blue-100 mt-2">
                Send
              </div>
            </div>
          </div>

          {/* 6.4 Match Status */}
          <div className="border-2 border-gray-800 bg-white p-4 rounded-lg">
            <div className="border-b-2 border-gray-800 pb-2 mb-3 flex items-center justify-between">
              <p className="text-sm">6.4 Match Status</p>
              <span className="text-xs">↻</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="border border-gray-400 p-2 rounded bg-yellow-50">
                <div>Cheryl – Pending</div>
                <div className="flex gap-1 items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-gray-800"></div>
                  <div className="w-2 h-2 rounded-full border border-gray-400"></div>
                  <div className="w-2 h-2 rounded-full border border-gray-400"></div>
                </div>
              </div>
              <div className="border border-gray-800 p-1 rounded text-center bg-red-50">
                Cancel
              </div>
              <div className="pt-2 border-t border-gray-300">
                <p className="mb-1">Other matches</p>
                <div className="space-y-1">
                  <div className="border border-gray-400 p-1 rounded flex justify-between bg-gray-50">
                    <span>Match 1</span>
                    <span>&gt;</span>
                  </div>
                  <div className="border border-gray-400 p-1 rounded flex justify-between bg-gray-50">
                    <span>Match 2</span>
                    <span>&gt;</span>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-300">
                <p>Upcoming list</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-pages under 6.1 */}
        <div className="grid grid-cols-4 gap-6">
          {/* 6.1.1 Modules & Difficulty */}
          <div className="border-2 border-gray-800 bg-white p-4 rounded-lg">
            <div className="border-b-2 border-gray-800 pb-2 mb-3">
              <p className="text-xs">6.1.1 Modules & Diff</p>
            </div>
            <div className="space-y-2 text-xs">
              <div className="border-b border-gray-300 pb-1">Modules</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="border border-gray-400 w-3 h-3 rounded"></span>
                  <span>MS0105</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="border border-gray-400 w-3 h-3 rounded bg-gray-800"></span>
                  <span>FOP</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="border border-gray-400 w-3 h-3 rounded"></span>
                  <span>BED</span>
                </div>
              </div>
              <div className="border-b border-gray-300 pb-1 pt-2">Level</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border border-gray-400"></span>
                  <span>Weaker</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border-2 border-gray-800 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-800"></span>
                  </span>
                  <span>Same</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border border-gray-400"></span>
                  <span>Stronger</span>
                </div>
              </div>
            </div>
          </div>

          {/* 6.1.2 Mode & Availability */}
          <div className="border-2 border-gray-800 bg-white p-4 rounded-lg">
            <div className="border-b-2 border-gray-800 pb-2 mb-3">
              <p className="text-xs">6.1.2 Mode & Time</p>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex gap-2 flex-wrap">
                <span className="border border-gray-800 px-2 py-0.5 rounded-full bg-blue-50">Online</span>
                <span className="border border-gray-400 px-2 py-0.5 rounded-full">On campus</span>
              </div>
              <div className="border-b border-gray-300 pb-1 pt-2">Time slots</div>
              <div className="flex gap-1 flex-wrap">
                <span className="border border-gray-400 px-2 py-0.5 rounded text-xs">Morning</span>
                <span className="border border-gray-400 px-2 py-0.5 rounded text-xs">Afternoon</span>
                <span className="border border-gray-400 px-2 py-0.5 rounded text-xs">Eve</span>
              </div>
              <div className="flex gap-1 flex-wrap">
                <span className="border border-gray-400 px-2 py-0.5 rounded text-xs">Weekdays</span>
                <span className="border border-gray-400 px-2 py-0.5 rounded text-xs">Weekends</span>
              </div>
              <div className="border border-gray-400 p-2 rounded bg-gray-50 mt-2">
                [Note field]
              </div>
            </div>
          </div>

          {/* 6.1.3 Auto-match */}
          <div className="border-2 border-gray-800 bg-white p-4 rounded-lg">
            <div className="border-b-2 border-gray-800 pb-2 mb-3">
              <p className="text-xs">6.1.3 Auto-match</p>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>Auto-match</span>
                <div className="w-10 h-5 rounded-full bg-green-500 border border-gray-800 flex items-center px-0.5">
                  <div className="w-4 h-4 rounded-full bg-white ml-auto"></div>
                </div>
              </div>
              <div className="border-b border-gray-300 pb-1 pt-2">Refresh</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border-2 border-gray-800 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-800"></span>
                  </span>
                  <span>Daily</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border border-gray-400"></span>
                  <span>Weekly</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border border-gray-400"></span>
                  <span>Manual</span>
                </div>
              </div>
              <div className="border-b border-gray-300 pb-1 pt-2">Notifications</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="border border-gray-400 w-3 h-3 rounded bg-gray-800"></span>
                  <span>New matches</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="border border-gray-400 w-3 h-3 rounded"></span>
                  <span>Updates</span>
                </div>
              </div>
            </div>
          </div>

          {/* Empty space to align with grid */}
          <div></div>
        </div>
      </div>
    </div>
  );
}