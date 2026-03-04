import React, { useState } from 'react';
import { MapPin, AlertTriangle, Users, Route } from 'lucide-react';
import { MapContainer, TileLayer, Circle, Marker, Popup, Polyline } from 'react-leaflet';
import { Icon } from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';


const DefaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41]
});

interface Location {
  lat: number;
  lng: number;
}

interface Traveler {
  id: number;
  name: string;
  phone: string;
  emergencyContact: string;
  age: number;
  gender: 'male' | 'female' | 'other';
}

interface Journey {
  id: number;
  guideName: string;
  guidePhone: string;
  destination: string;
  startDate: string;
  endDate: string;
  tourists: number;
  status: 'in-zone' | 'out-of-zone';
  currentLocation: Location;
  boundaryCenter: Location;
  boundaryRadius: number;
  path: Location[];
  travelers: Traveler[];
  localPoliceNumber: string;
  localAmbulanceNumber: string;
}

// Mock data for active journeys
const MOCK_JOURNEYS: Journey[] = [
  {
    id: 1,
    guideName: 'Ravi Kumar',
    guidePhone: '+91 98765 43210',
    destination: 'Jaipur',
    startDate: '2025-08-01',
    endDate: '2025-08-05',
    tourists: 4,
    status: 'in-zone',
    currentLocation: { lat: 26.9124, lng: 75.7873 },
    boundaryCenter: { lat: 26.9124, lng: 75.7873 },
    boundaryRadius: 5000, // 5km in meters
    path: [
      { lat: 26.9124, lng: 75.7873 },
      { lat: 26.9224, lng: 75.7973 },
      { lat: 26.9324, lng: 75.8073 }
    ],
    travelers: [
      {
        id: 1,
        name: 'John Doe',
        phone: '+1 234-567-8901',
        emergencyContact: '+1 234-567-8902',
        age: 30,
        gender: 'male'
      }
    ],
    localPoliceNumber: '100',
    localAmbulanceNumber: '108'
  },
  {
    id: 2,
    guideName: 'Priya Singh',
    guidePhone: '+91 98765 43211',
    destination: 'Udaipur',
    startDate: '2025-08-02',
    endDate: '2025-08-06',
    tourists: 2,
    status: 'out-of-zone',
    currentLocation: { lat: 24.6259, lng: 73.9128 },
    boundaryCenter: { lat: 24.5854, lng: 73.7125 },
    boundaryRadius: 4000,
    path: [
      { lat: 24.5854, lng: 73.7125 },
      { lat: 24.5954, lng: 73.7225 },
      { lat: 24.6259, lng: 73.9128 }
    ],
    travelers: [
      {
        id: 2,
        name: 'Jane Smith',
        phone: '+1 234-567-8902',
        emergencyContact: '+1 234-567-8903',
        age: 28,
        gender: 'female'
      }
    ],
    localPoliceNumber: '100',
    localAmbulanceNumber: '108'
  }
   
];

const GuideTrackingPage: React.FC = () => {
  const [selectedJourney, setSelectedJourney] = useState<Journey>(MOCK_JOURNEYS[0]);
  const [showAlert, setShowAlert] = useState(false);

  
  React.useEffect(() => {
    if (selectedJourney.id === 2) {
      const timer = setTimeout(() => {
        setShowAlert(true);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowAlert(false);
    }
  }, [selectedJourney]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Active Journeys Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Active Journeys</h2>
              <div className="space-y-4">
                {MOCK_JOURNEYS.map((journey) => (
                  <div
                    key={journey.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedJourney.id === journey.id
                        ? 'border-cyan-600 bg-cyan-50'
                        : 'border-gray-200 hover:border-cyan-300'
                    }`}
                    onClick={() => setSelectedJourney(journey)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{journey.guideName}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          journey.status === 'in-zone'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {journey.status === 'in-zone' ? 'In Zone' : 'Out of Zone'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-1 mb-1">
                        <MapPin className="h-4 w-4" />
                        {journey.destination}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {journey.tourists} tourists
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map View */}
          <div className="lg:w-3/4">
            {showAlert && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <div>
                  <p className="font-bold">Alert: Guide Out of Zone</p>
                  <p>Guide {selectedJourney.guideName} has moved outside the designated area.</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    Tracking {selectedJourney.guideName}
                  </h2>
                  <p className="text-gray-600">
                    Journey in {selectedJourney.destination} with {selectedJourney.tourists} tourists
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Route className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    {selectedJourney.startDate} - {selectedJourney.endDate}
                  </span>
                </div>
              </div>

              {/* Map Container */}
              <div className="w-full h-[600px] rounded-lg overflow-hidden">
                <MapContainer
                  center={[selectedJourney.currentLocation.lat, selectedJourney.currentLocation.lng]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {/* Zone Boundary */}
                  <Circle
                    center={[selectedJourney.boundaryCenter.lat, selectedJourney.boundaryCenter.lng]}
                    radius={selectedJourney.boundaryRadius}
                    pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
                  />

                  {/* Guide Marker */}
                  <Marker
                    position={[selectedJourney.currentLocation.lat, selectedJourney.currentLocation.lng]}
                    icon={DefaultIcon}
                  >
                    <Popup>
                      Guide {selectedJourney.guideName}
                      <br />
                      Lat: {selectedJourney.currentLocation.lat.toFixed(4)}
                      <br />
                      Lng: {selectedJourney.currentLocation.lng.toFixed(4)}
                    </Popup>
                  </Marker>

                  {/* Movement Path */}
                  <Polyline
                    positions={selectedJourney.path.map(p => [p.lat, p.lng] as [number, number])}
                    pathOptions={{ color: 'cyan', weight: 3 }}
                  />
                </MapContainer>
              </div>

              {/* Legend */}
              <div className="mt-4 p-4 bg-white rounded-lg shadow space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500/20"></div>
                  <span className="text-sm text-gray-600">Zone Boundary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Guide Location</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-cyan-500"></div>
                  <span className="text-sm text-gray-600">Movement History</span>
                </div>
              </div>

              {/* Emergency Contact Buttons */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contacts</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <a
                    href={`tel:${selectedJourney.guidePhone}`}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                  >
                    <MapPin className="h-5 w-5" />
                    Contact Guide
                  </a>
                  <a
                    href={`tel:${selectedJourney.localPoliceNumber}`}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <AlertTriangle className="h-5 w-5" />
                    Contact Police
                  </a>
                  <a
                    href={`tel:${selectedJourney.localAmbulanceNumber}`}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <span className="text-xl">🚑</span>
                    Ambulance
                  </a>
                  <button
                    onClick={() => window.alert('Opening group chat...')}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Users className="h-5 w-5" />
                    Group Chat
                  </button>
                </div>
              </div>

              {/* Journey Stats */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Current Speed</div>
                  <div className="font-semibold text-gray-800">12 km/h</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Distance Covered</div>
                  <div className="font-semibold text-gray-800">8.5 km</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Time in Zone</div>
                  <div className="font-semibold text-gray-800">4h 23m</div>
                </div>
              </div>

              {/* Travelers List */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Travelers Information</h3>
                <div className="bg-white border rounded-lg divide-y">
                  {selectedJourney.travelers?.map((traveler) => (
                    <div key={traveler.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{traveler.name}</h4>
                          <p className="text-sm text-gray-600">Age: {traveler.age} • Gender: {traveler.gender}</p>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={`tel:${traveler.phone}`}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            Call Traveler
                          </a>
                          <a
                            href={`tel:${traveler.emergencyContact}`}
                            className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors"
                          >
                            Emergency Contact
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideTrackingPage;
