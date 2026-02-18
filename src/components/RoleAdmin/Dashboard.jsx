import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDateShort } from '../../utils/dateHelpers';
import { loadEventsFromStorage } from '../../utils/seedData';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [emptyStateIndex] = useState(() => Math.floor(Math.random() * 3));

  useEffect(() => {
    const loadEvents = () => {
      setIsLoading(true);
      const startTime = Date.now();

      let allEvents = loadEventsFromStorage();
      
      const keys = Object.keys(localStorage);
      const seenIds = new Set(allEvents.map(e => e.id));
      
      keys.forEach(key => {
        if (key.startsWith('events_')) {
          try {
            const userEvents = JSON.parse(localStorage.getItem(key));
            if (Array.isArray(userEvents)) {
              userEvents.forEach(event => {
                if (!seenIds.has(event.id)) {
                  seenIds.add(event.id);
                  allEvents.push(event);
                }
              });
            }
          } catch (e) {
            console.error('Error parsing events:', e);
          }
        }
      });
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const updated = allEvents.map(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        if (eventDate < today && event.status !== 'Completed' && event.status !== 'Cancelled') {
          return { ...event, status: 'Cancelled', autoCancelled: true };
        }
        return event;
      });

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 700 - elapsed);

      setTimeout(() => {
        setEvents(updated);
        setIsLoading(false);
      }, remaining);
    };

    loadEvents();
    window.addEventListener('focus', loadEvents);
    return () => window.removeEventListener('focus', loadEvents);
  }, []);
  
  const statusCounts = {
    total: events.length,
    submitted: events.filter(e => e.status === 'Submitted').length,
    inProgress: events.filter(e => e.status === 'In Progress').length,
    completed: events.filter(e => e.status === 'Completed').length,
    cancelled: events.filter(e => e.status === 'Cancelled').length,
    submissionRequests: events.filter(e => !e.cancellationRequest && e.status === 'Submitted').length,
    cancellationRequests: events.filter(e => e.cancellationRequest && e.status !== 'Cancelled').length
  };

  const getStatusColor = (status) => {
    const colors = {
      'Submitted': 'bg-blue-100 text-blue-700',
      'In Progress': 'bg-yellow-100 text-yellow-700',
      'Completed': 'bg-green-100 text-green-700',
      'Cancelled': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPendingBadgeStyle = () => {
    return 'border border-orange-500 text-orange-600 bg-transparent';
  };

  const FancySpinner = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="flex gap-2 mb-3">
        <div className="w-3 h-3 rounded-full bg-purple-600 animate-bounce [animation-delay:0ms]"></div>
        <div className="w-3 h-3 rounded-full bg-pink-500 animate-bounce [animation-delay:150ms]"></div>
        <div className="w-3 h-3 rounded-full bg-purple-600 animate-bounce [animation-delay:300ms]"></div>
      </div>
      <p className="text-gray-500 text-sm">Loading events...</p>
    </div>
  );

  const SleepyMailboxEmpty = () => (
    <tr data-cy="dashboard-table-no-entry">
      <td colSpan="7" className="px-6 py-16 text-center">
        <style>{`
          @keyframes sleepySway {
            0%, 100% { transform: rotate(-2deg); }
            50% { transform: rotate(2deg); }
          }
          @keyframes floatZzz {
            0% { opacity: 0; transform: translateY(0) translateX(0); }
            50% { opacity: 1; }
            100% { opacity: 0; transform: translateY(-20px) translateX(8px); }
          }
          .mailbox-svg { animation: sleepySway 3s ease-in-out infinite; transform-origin: bottom center; }
          .zzz { display: inline-block; animation: floatZzz 2s ease-in-out infinite; font-style: italic; font-weight: 700; color: #a3a3a3; }
          .zzz:nth-child(1) { animation-delay: 0s; font-size: 12px; }
          .zzz:nth-child(2) { animation-delay: 0.4s; font-size: 16px; }
          .zzz:nth-child(3) { animation-delay: 0.8s; font-size: 20px; }
        `}</style>
        
        <div className="flex flex-col items-center">
          <div className="mb-4 flex items-start gap-2">
            <svg className="mailbox-svg" width="80" height="100" viewBox="0 0 80 100" fill="none">
              <rect x="36" y="60" width="8" height="35" rx="2" fill="#8B7355"/>
              <rect x="10" y="35" width="60" height="35" rx="6" fill="#E8D5B7"/>
              <rect x="10" y="35" width="60" height="35" rx="6" stroke="#C4A882" strokeWidth="2"/>
              <path d="M10 50 Q10 30 40 28 Q70 30 70 50" fill="#D4B896" stroke="#C4A882" strokeWidth="2"/>
              <rect x="22" y="52" width="36" height="5" rx="2.5" fill="#8B7355"/>
              <rect x="15" y="42" width="25" height="22" rx="3" fill="#C4A882" stroke="#A88B6A" strokeWidth="1.5"/>
              <path d="M60 36 L70 46 M65 36 L70 46 M60 41 L70 46" stroke="#ccc" strokeWidth="1" opacity="0.7"/>
              <circle cx="70" cy="46" r="2" fill="#999" opacity="0.5"/>
              <path d="M20 50 Q23 48 26 50" stroke="#8B7355" strokeWidth="1.5" fill="none"/>
              <path d="M28 49 Q31 47 34 49" stroke="#8B7355" strokeWidth="1.5" fill="none"/>
              <path d="M22 54 Q27 57 32 54" stroke="#8B7355" strokeWidth="1.5" fill="none"/>
            </svg>
            <div className="mt-8">
              <span className="zzz">z</span>
              <span className="zzz">z</span>
              <span className="zzz">Z</span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-700 mb-2">No mail today... ☕</h3>
          <p className="text-gray-500 text-sm mb-1">Nothing to review — go grab a coffee!</p>
          <p className="text-gray-400 text-xs italic">Events will appear here once users submit them.</p>
        </div>
      </td>
    </tr>
  );

  const TumbleweedEmpty = () => (
    <tr data-cy="dashboard-table-no-entry">
      <td colSpan="7" className="px-6 py-16 text-center">
        <style>{`
          @keyframes roll {
            0% { left: -10%; transform: translateY(-50%) rotate(0deg); }
            100% { left: 110%; transform: translateY(-50%) rotate(720deg); }
          }
          @keyframes heatShimmer {
            0%, 100% { transform: scaleY(1); opacity: 0.5; }
            50% { transform: scaleY(1.1); opacity: 1; }
          }
          .tumbleweed { animation: roll 3s linear infinite; }
          .heat-wave { animation: heatShimmer 2s ease-in-out infinite; display: inline-block; }
        `}</style>
        
        <div className="flex flex-col items-center">
          <div className="text-3xl mb-2">
            <span className="heat-wave">🌵</span>
            <span className="mx-12"></span>
            <span className="heat-wave" style={{ animationDelay: '0.5s' }}>🌵</span>
          </div>
          
          <div className="relative w-full max-w-md h-20 overflow-hidden mb-4">
            <div className="tumbleweed absolute text-4xl top-1/2">🌾</div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-700 mb-2">It's quiet... too quiet.</h3>
          <p className="text-gray-500 text-sm mb-1">No events submitted yet. Enjoy the calm before the storm!</p>
          <p className="text-gray-400 text-xs italic">Users haven't created any events yet.</p>
        </div>
      </td>
    </tr>
  );

  const BoredAdminEmpty = () => (
    <tr data-cy="dashboard-table-no-entry">
      <td colSpan="7" className="px-6 py-16 text-center">
        <style>{`
          @keyframes nod {
            0%, 100% { transform: rotate(0deg); }
            10% { transform: rotate(-3deg); }
            20% { transform: rotate(0deg); }
            30% { transform: rotate(-3deg); }
            40% { transform: rotate(0deg); }
            70% { transform: rotate(0deg); }
          }
          .desk-scene { animation: nod 4s ease-in-out infinite; transform-origin: bottom center; }
        `}</style>
        
        <div className="flex flex-col items-center">
          <svg className="desk-scene mb-4" width="100" height="90" viewBox="0 0 100 90" fill="none">
            <rect x="5" y="65" width="90" height="8" rx="3" fill="#8B7355"/>
            <rect x="10" y="73" width="6" height="15" rx="2" fill="#A0826D"/>
            <rect x="84" y="73" width="6" height="15" rx="2" fill="#A0826D"/>
            <rect x="30" y="35" width="40" height="28" rx="3" fill="#374151"/>
            <rect x="33" y="38" width="34" height="20" rx="2" fill="#1F2937"/>
            <rect x="36" y="41" width="20" height="2" rx="1" fill="#374151"/>
            <rect x="36" y="45" width="15" height="2" rx="1" fill="#374151"/>
            <rect x="36" y="49" width="18" height="2" rx="1" fill="#374151"/>
            <rect x="47" y="63" width="6" height="4" rx="1" fill="#374151"/>
            <rect x="42" y="66" width="16" height="2" rx="1" fill="#6B7280"/>
            <circle cx="22" cy="48" r="12" fill="#FBBF24"/>
            <path d="M17 46 Q19 44 21 46" stroke="#92400E" strokeWidth="1.5" fill="none"/>
            <circle cx="26" cy="46" r="1.5" fill="#92400E"/>
            <path d="M24 44 Q26 45 28 44" stroke="#92400E" strokeWidth="1" fill="#FBBF24" opacity="0.7"/>
            <path d="M17 52 L26 52" stroke="#92400E" strokeWidth="1.5"/>
            <path d="M16 58 Q18 56 22 60" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" fill="none"/>
            <rect x="68" y="55" width="14" height="10" rx="2" fill="#EF4444"/>
            <path d="M82 59 Q86 59 86 62 Q86 65 82 65" stroke="#EF4444" strokeWidth="2" fill="none"/>
            <rect x="70" y="57" width="10" height="2" rx="1" fill="white" opacity="0.4"/>
            <path d="M72 54 Q73 51 72 48" stroke="#9CA3AF" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
            <path d="M77 54 Q78 50 77 47" stroke="#9CA3AF" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
          </svg>
          
          <h3 className="text-xl font-bold text-gray-700 mb-2">Nothing to see here... yet!</h3>
          <p className="text-gray-500 text-sm mb-1">When users create events, they'll show up right here.</p>
          <p className="text-gray-400 text-xs italic">Maybe check back after lunch? ☕</p>
        </div>
      </td>
    </tr>
  );

  const EmptyStateSelector = () => {
    if (emptyStateIndex === 0) return <SleepyMailboxEmpty />;
    if (emptyStateIndex === 1) return <TumbleweedEmpty />;
    return <BoredAdminEmpty />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-elegant-50 to-royal-50/30 py-6 px-4 sm:px-6 md:px-8" data-cy="dashboard">
      <div className="max-w-full">

        {/* Header */}
        <div className="mb-8" data-cy="dashboard-header">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <h1 className="text-3xl sm:text-4xl font-display text-royal-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600 font-serif">Manage all events and requests</p>
        </div>

        {/* Event Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" data-cy="dashboard-alerts">
          {statusCounts.submissionRequests > 0 && (
            <div className={`border-l-4 p-4 rounded ${getPendingBadgeStyle()}`} data-cy="dashboard-alert-box">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚠️</span>
                <div>
                  <p className="font-semibold text-orange-800">
                    {statusCounts.submissionRequests} New Event{statusCounts.submissionRequests > 1 ? 's' : ''} Require{statusCounts.submissionRequests > 1 ? '' : 's'} Attention
                  </p>
                  <p className="text-sm text-orange-700">Review and accept/decline</p>
                </div>
              </div>
            </div>
          )}

          {statusCounts.cancellationRequests > 0 && (
            <div className={`border-l-4 p-4 rounded ${getPendingBadgeStyle()}`} data-cy="dashboard-alert-box">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚠️</span>
                <div>
                  <p className="font-semibold text-orange-800">
                    {statusCounts.cancellationRequests} Cancel Event{statusCounts.cancellationRequests > 1 ? 's' : ''} Require{statusCounts.cancellationRequests > 1 ? '' : 's'} Attention
                  </p>
                  <p className="text-sm text-orange-700">Review and approve/deny</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status Grid */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6" data-cy="dashboard-status">
          <div className="flex gap-2 flex-wrap">
            <div className="px-4 py-2 rounded bg-gray-100 text-gray-700 flex-1 text-center min-w-[110px] whitespace-nowrap text-sm" data-cy="dashboard-status-box">
              All ({statusCounts.total})
            </div>
            <div className="px-4 py-2 rounded bg-blue-100 text-blue-700 flex-1 text-center min-w-[110px] whitespace-nowrap text-sm" data-cy="dashboard-status-box">
              Submitted ({statusCounts.submitted})
            </div>
            <div className="px-4 py-2 rounded bg-yellow-100 text-yellow-700 flex-1 text-center min-w-[110px] whitespace-nowrap text-sm" data-cy="dashboard-status-box">
              In Progress ({statusCounts.inProgress})
            </div>
            <div className="px-4 py-2 rounded bg-green-100 text-green-700 flex-1 text-center min-w-[110px] whitespace-nowrap text-sm" data-cy="dashboard-status-box">
              Completed ({statusCounts.completed})
            </div>
            <div className="px-4 py-2 rounded bg-red-100 text-red-700 flex-1 text-center min-w-[110px] whitespace-nowrap text-sm" data-cy="dashboard-status-box">
              Cancelled ({statusCounts.cancelled})
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" data-cy="dashboard-table">
          {isLoading ? (
            <FancySpinner />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-royal-700 text-white">
                  <tr>
                    <th className="px-4 py-4 text-left font-sans text-sm">Event</th>
                    <th className="px-4 py-4 text-left font-sans text-sm hidden sm:table-cell">Date</th>
                    <th className="px-4 py-4 text-left font-sans text-sm hidden md:table-cell">Client</th>
                    <th className="px-4 py-4 text-left font-sans text-sm hidden lg:table-cell">Type</th>
                    <th className="px-4 py-4 text-left font-sans text-sm hidden lg:table-cell">Budget</th>
                    <th className="px-4 py-4 text-left font-sans text-sm hidden sm:table-cell">Status</th>
                    <th className="px-4 py-4 text-center font-sans text-sm hidden sm:table-cell">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {events.length === 0 ? (
                    <EmptyStateSelector />
                  ) : (
                    events.map(event => {
                      const isActiveInProgress = event.status === 'In Progress' && !event.cancellationRequest && !event.completionRequest;
                      
                      return (
                        <tr key={event.id} className="hover:bg-gray-50 transition" data-cy="dashboard-table-entry" data-event-id={event.id}>
                          <td className="px-4 py-4 hidden sm:table-cell">
                            <div className="font-semibold text-gray-900 text-base">{event.name}</div>
                          </td>

                          <td className="px-4 py-4 hidden sm:table-cell">
                            <div className="text-sm text-gray-700">{formatDateShort(event.date)}</div>
                          </td>

                          <td className="px-4 py-4 hidden md:table-cell">
                            <div className="text-sm text-gray-700">
                              {event.userId ? `User #${event.userId.toString().slice(-4)}` : 'Unknown'}
                            </div>
                            <div className="text-xs text-gray-500">{event.userEmail || 'No email'}</div>
                          </td>

                          <td className="px-4 py-4 hidden lg:table-cell">
                            <div className="text-sm text-gray-700">{event.type}</div>
                          </td>

                          <td className="px-4 py-4 hidden lg:table-cell">
                            <div className="text-sm text-gray-700">
                              ${parseInt(event.budget || event.setBudget || event.budgetTotal || 0).toLocaleString()}
                            </div>
                          </td>

                          <td className="px-4 py-4 hidden sm:table-cell">
                            <div className="flex flex-col gap-1.5">
                              <span className={`px-3 py-1 rounded text-xs font-semibold text-center min-w-[180px] max-w-[180px] ${getStatusColor(event.status)}`}>
                                {event.status}
                              </span>
                              {event.status === 'Submitted' && (
                                <span className={`px-3 py-1 rounded text-xs font-semibold text-center min-w-[180px] max-w-[180px] ${getPendingBadgeStyle()}`}>
                                  Reviewing Event
                                </span>
                              )}
                              {event.cancellationRequest && (
                                <span className={`px-3 py-1 rounded text-xs font-semibold text-center min-w-[180px] max-w-[180px] ${getPendingBadgeStyle()}`}>
                                  Reviewing Cancellation
                                </span>
                              )}
                              {event.completionRequest && (
                                <span className={`px-3 py-1 rounded text-xs font-semibold text-center min-w-[180px] max-w-[180px] ${getPendingBadgeStyle()}`}>
                                  Pending Completion
                                </span>
                              )}
                              {event.autoCancelled && (
                                <span className="px-2 py-1 rounded text-xs text-center min-w-[180px] max-w-[180px] bg-gray-100 text-gray-600">
                                  Auto-cancelled
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-4 hidden sm:table-cell">
                            <div className="flex flex-col gap-2 items-center">
                              {isActiveInProgress ? (
                                <>
                                  <button
                                    onClick={() => navigate(`/admin/events/${event.id}/edit?mode=update`)}
                                    className="min-w-[90px] py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded text-[13px] font-medium transition"
                                    data-cy="dashboard-table-entry-update-btn"
                                  >
                                    Update
                                  </button>
                                  <button
                                    onClick={() => navigate(`/admin/events/${event.id}/edit?mode=complete`)}
                                    className="min-w-[90px] py-2 bg-lime-100 hover:bg-lime-200 text-lime-700 rounded text-[13px] font-medium transition"
                                    data-cy="dashboard-table-entry-complete-btn"
                                  >
                                    Complete
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => navigate(`/admin/events/${event.id}`)}
                                  className="min-w-[90px] py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded text-[13px] font-medium transition"
                                  data-cy="dashboard-table-entry-view-btn"
                                >
                                  View
                                </button>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-4 sm:hidden" colSpan="7">
                            <div className="flex flex-col gap-3">
                              <div className="font-semibold text-gray-900 text-base">{event.name}</div>

                              <div className="text-sm text-gray-700">
                                📅 {formatDateShort(event.date)}
                              </div>
                              <div className="text-sm text-gray-700">
                                {event.userId ? `User #${event.userId.toString().slice(-4)}` : 'Unknown'} - {event.userEmail || 'No email'}
                              </div>

                              <div className="flex flex-wrap gap-1.5">
                                <span className={`flex-1 px-3 py-1 rounded text-xs font-semibold text-center min-w-[140px] ${getStatusColor(event.status)}`}>
                                  {event.status}
                                </span>
                                {event.status === 'Submitted' && (
                                  <span className={`flex-1 px-3 py-1 rounded text-xs font-semibold text-center min-w-[140px] ${getPendingBadgeStyle()}`}>
                                    Reviewing Event
                                  </span>
                                )}
                                {event.cancellationRequest && (
                                  <span className={`flex-1 px-3 py-1 rounded text-xs font-semibold text-center min-w-[140px] ${getPendingBadgeStyle()}`}>
                                    Reviewing Cancellation
                                  </span>
                                )}
                                {event.completionRequest && (
                                  <span className={`flex-1 px-3 py-1 rounded text-xs font-semibold text-center min-w-[140px] ${getPendingBadgeStyle()}`}>
                                    Pending Completion
                                  </span>
                                )}
                                {event.autoCancelled && (
                                  <span className="flex-1 px-2 py-1 rounded text-xs text-center min-w-[140px] bg-gray-100 text-gray-600">
                                    Auto-cancelled
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-col gap-2">
                                {isActiveInProgress ? (
                                  <>
                                    <button
                                      onClick={() => navigate(`/admin/events/${event.id}/edit?mode=update`)}
                                      className="w-full py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded text-[13px] font-medium transition"
                                      data-cy="dashboard-table-entry-update-btn"
                                    >
                                      Update
                                    </button>
                                    <button
                                      onClick={() => navigate(`/admin/events/${event.id}/edit?mode=complete`)}
                                      className="w-full py-2 bg-lime-100 hover:bg-lime-200 text-lime-700 rounded text-[13px] font-medium transition"
                                      data-cy="dashboard-table-entry-complete-btn"
                                    >
                                      Complete
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => navigate(`/admin/events/${event.id}`)}
                                    className="w-full py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded text-[13px] font-medium transition"
                                    data-cy="dashboard-table-entry-view-btn"
                                  >
                                    View
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;