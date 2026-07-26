import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, 
  ShieldAlert, 
  Search, 
  X, 
  BrainCircuit, 
  Phone, 
  Car, 
  Users, 
  FileText,
  Flame,
  Layers,
  Calendar,
  Grid,
  RotateCcw
} from 'lucide-react';
import { MOCK_CRIME_RECORDS } from '../data/mockCrimeData';
import { CrimeRecord, SeverityLevel } from '../types';

// Helper custom marker icon builder
const createCustomMarkerIcon = (severity: SeverityLevel) => {
  let colorHex = '#3b82f6'; // Blue
  if (severity === 'Critical') colorHex = '#ef4444'; // Red
  else if (severity === 'High') colorHex = '#f97316'; // Orange
  else if (severity === 'Medium') colorHex = '#eab308'; // Yellow

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${colorHex};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid #ffffff;
        box-shadow: 0 0 14px ${colorHex};
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 6px; height: 6px; background-color: #ffffff; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// Cluster marker icon builder
const createClusterMarkerIcon = (count: number, highestSeverity: SeverityLevel) => {
  let colorHex = '#3b82f6';
  if (highestSeverity === 'Critical') colorHex = '#ef4444';
  else if (highestSeverity === 'High') colorHex = '#f97316';
  else if (highestSeverity === 'Medium') colorHex = '#eab308';

  return L.divIcon({
    className: 'custom-leaflet-cluster-marker',
    html: `
      <div style="
        background: linear-gradient(135deg, ${colorHex}, #0f172a);
        color: #ffffff;
        font-weight: 800;
        font-family: monospace;
        font-size: 11px;
        padding: 4px 10px;
        border-radius: 20px;
        border: 2px solid #ffffff;
        box-shadow: 0 0 18px ${colorHex};
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 5px;
      ">
        <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${colorHex};"></span>
        ${count} Incidents
      </div>
    `,
    iconSize: [85, 26],
    iconAnchor: [42, 13]
  });
};

interface CrimeMapViewProps {
  onInvestigateCase?: (query: string) => void;
}

// Helper to auto-recenter Leaflet map
function MapRecenter({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom || map.getZoom());
  }, [center, zoom, map]);
  return null;
}

interface CrimeCluster {
  id: string;
  centerLat: number;
  centerLng: number;
  records: CrimeRecord[];
  highestSeverity: SeverityLevel;
}

export const CrimeMapView: React.FC<CrimeMapViewProps> = ({ onInvestigateCase }) => {
  // Advanced Filters state
  const [districtFilter, setDistrictFilter] = useState('All');
  const [crimeTypeFilter, setCrimeTypeFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [datePreset, setDatePreset] = useState('All Time');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Layer Toggles
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [enableClustering, setEnableClustering] = useState(true);

  // Selected Case Modal
  const [selectedCase, setSelectedCase] = useState<CrimeRecord | null>(null);

  // Center coordinates (Karnataka centered e.g. Mysuru/Bengaluru region)
  const [mapCenter, setMapCenter] = useState<[number, number]>([12.9716, 76.8500]);
  const [mapZoom, setMapZoom] = useState(9);

  // Filter Logic
  const filteredRecords = useMemo(() => {
    return MOCK_CRIME_RECORDS.filter((r) => {
      // District Filter
      if (districtFilter !== 'All' && r.district !== districtFilter) return false;

      // Crime Type Filter
      if (crimeTypeFilter !== 'All' && r.crimeType !== crimeTypeFilter) return false;

      // Severity Filter
      if (severityFilter !== 'All' && r.severity !== severityFilter) return false;

      // Date Range Filter
      if (datePreset === 'Last 7 Days') {
        const recordDate = new Date(r.date);
        const cutoff = new Date('2026-07-15'); // Current dataset anchor July 2026
        if (recordDate < cutoff) return false;
      } else if (datePreset === 'Last 30 Days') {
        const recordDate = new Date(r.date);
        const cutoff = new Date('2026-06-22');
        if (recordDate < cutoff) return false;
      } else if (datePreset === 'Year 2026') {
        if (!r.date.startsWith('2026')) return false;
      } else if (datePreset === 'Year 2025') {
        if (!r.date.startsWith('2025')) return false;
      } else if (datePreset === 'Custom Range') {
        if (startDate && r.date < startDate) return false;
        if (endDate && r.date > endDate) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.id.toLowerCase().includes(q) ||
          r.crimeType.toLowerCase().includes(q) ||
          r.district.toLowerCase().includes(q) ||
          r.area.toLowerCase().includes(q) ||
          r.suspect.toLowerCase().includes(q) ||
          r.vehicle.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [districtFilter, crimeTypeFilter, severityFilter, datePreset, startDate, endDate, searchQuery]);

  // Dynamic Clustering Logic
  const clusters = useMemo(() => {
    if (!enableClustering) return [];

    const clusterList: CrimeCluster[] = [];
    const threshold = 0.08; // ~8km proximity grid distance

    filteredRecords.forEach((record) => {
      let matchedCluster = clusterList.find((c) => {
        const latDiff = Math.abs(c.centerLat - record.latitude);
        const lngDiff = Math.abs(c.centerLng - record.longitude);
        return latDiff < threshold && lngDiff < threshold;
      });

      if (matchedCluster) {
        matchedCluster.records.push(record);
        // Update center average
        const count = matchedCluster.records.length;
        matchedCluster.centerLat = (matchedCluster.centerLat * (count - 1) + record.latitude) / count;
        matchedCluster.centerLng = (matchedCluster.centerLng * (count - 1) + record.longitude) / count;

        // Upgrade highest severity
        const severityOrder: Record<SeverityLevel, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        if (severityOrder[record.severity] > severityOrder[matchedCluster.highestSeverity]) {
          matchedCluster.highestSeverity = record.severity;
        }
      } else {
        clusterList.push({
          id: `cluster-${record.id}`,
          centerLat: record.latitude,
          centerLng: record.longitude,
          records: [record],
          highestSeverity: record.severity
        });
      }
    });

    return clusterList;
  }, [filteredRecords, enableClustering]);

  const resetFilters = () => {
    setDistrictFilter('All');
    setCrimeTypeFilter('All');
    setSeverityFilter('All');
    setDatePreset('All Time');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-4 h-[calc(100vh-80px)] flex flex-col">
      {/* Advanced Filter Bar */}
      <div className="bg-[#0d0d10] p-4 rounded-2xl border border-slate-800 shadow-xl space-y-3 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              <MapPin className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Interactive GIS Crime Map</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase font-bold">
                  Dynamic Spatial Clustering
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Active View: <span className="text-cyan-400 font-bold">{filteredRecords.length}</span> FIR Geolocation Incidents
              </p>
            </div>
          </div>

          {/* Quick Layer Control Toggles */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setEnableClustering(!enableClustering)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                enableClustering 
                  ? 'bg-indigo-950 text-indigo-300 border border-indigo-700 shadow-md' 
                  : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Clustering {enableClustering ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                showHeatmap 
                  ? 'bg-rose-950 text-rose-300 border border-rose-800 shadow-md' 
                  : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Heatmap Density {showHeatmap ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={resetFilters}
              title="Reset All Filters"
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          {/* Search Box */}
          <div className="relative col-span-2 sm:col-span-1 lg:col-span-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Case ID or Suspect..."
              className="w-full pl-8 pr-2 py-1.5 rounded-xl bg-[#151518] border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* District Filter */}
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-[#151518] border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Police Districts</option>
            <option value="Mysuru">Mysuru</option>
            <option value="Bengaluru East">Bengaluru East</option>
            <option value="Bengaluru West">Bengaluru West</option>
            <option value="Whitefield">Whitefield</option>
            <option value="Mangaluru">Mangaluru</option>
            <option value="Hubballi">Hubballi</option>
          </select>

          {/* Crime Type Filter */}
          <select
            value={crimeTypeFilter}
            onChange={(e) => setCrimeTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-[#151518] border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Crime Types</option>
            <option value="House Burglary">House Burglary</option>
            <option value="Armed Robbery">Armed Robbery</option>
            <option value="Vehicle Theft">Vehicle Theft</option>
            <option value="Chain Snatching">Chain Snatching</option>
            <option value="Cyber Fraud">Cyber Fraud</option>
            <option value="Assault & Gang Violence">Assault & Gang Violence</option>
          </select>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-[#151518] border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Date Preset Filter */}
          <select
            value={datePreset}
            onChange={(e) => setDatePreset(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-[#151518] border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="All Time">All Time</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Year 2026">Year 2026</option>
            <option value="Year 2025">Year 2025</option>
            <option value="Custom Range">Custom Date Range</option>
          </select>

          {/* Custom Date Pickers if selected */}
          {datePreset === 'Custom Range' ? (
            <div className="flex items-center gap-1 col-span-2 sm:col-span-1">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-1/2 p-1 rounded-lg bg-[#151518] border border-slate-800 text-[10px] text-slate-200 focus:outline-none"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-1/2 p-1 rounded-lg bg-[#151518] border border-slate-800 text-[10px] text-slate-200 focus:outline-none"
              />
            </div>
          ) : (
            <div className="hidden lg:flex items-center justify-end text-[10px] font-mono text-slate-400 px-2 py-1">
              Active Date Scope: <span className="text-slate-200 font-bold ml-1">{datePreset}</span>
            </div>
          )}
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="flex-1 rounded-2xl border border-slate-800 overflow-hidden relative shadow-2xl bg-slate-950">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          {/* CARTO Dark Mode Map Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          <MapRecenter center={mapCenter} zoom={mapZoom} />

          {/* Heatmap Density Layer */}
          {showHeatmap && filteredRecords.map((r) => (
            <React.Fragment key={`heat-${r.id}`}>
              {/* Outer soft aura */}
              <CircleMarker
                center={[r.latitude, r.longitude]}
                radius={r.severity === 'Critical' ? 28 : 18}
                pathOptions={{
                  fillColor: r.severity === 'Critical' ? '#ef4444' : r.severity === 'High' ? '#f97316' : '#eab308',
                  fillOpacity: 0.12,
                  stroke: false
                }}
              />
              {/* Inner intense heat core */}
              <CircleMarker
                center={[r.latitude, r.longitude]}
                radius={r.severity === 'Critical' ? 12 : 8}
                pathOptions={{
                  fillColor: r.severity === 'Critical' ? '#ef4444' : '#f97316',
                  fillOpacity: 0.35,
                  stroke: false
                }}
              />
            </React.Fragment>
          ))}

          {/* Dynamic Spatial Cluster Markers */}
          {enableClustering && clusters.map((cluster) => {
            if (cluster.records.length === 1) {
              const r = cluster.records[0];
              return (
                <Marker
                  key={r.id}
                  position={[r.latitude, r.longitude]}
                  icon={createCustomMarkerIcon(r.severity)}
                  eventHandlers={{
                    click: () => setSelectedCase(r)
                  }}
                >
                  <Tooltip direction="top" offset={[0, -12]} opacity={0.95}>
                    <div className="p-1 text-slate-900 text-xs font-sans">
                      <span className="font-mono font-bold text-indigo-600 block">{r.id}</span>
                      <strong className="block text-slate-900">{r.crimeType}</strong>
                      <span className="text-[10px] text-slate-600 block">{r.district} • {r.area}</span>
                      <span className="text-[9px] font-mono text-cyan-700 font-bold mt-0.5 block">Click for Dossier</span>
                    </div>
                  </Tooltip>
                </Marker>
              );
            }

            return (
              <Marker
                key={cluster.id}
                position={[cluster.centerLat, cluster.centerLng]}
                icon={createClusterMarkerIcon(cluster.records.length, cluster.highestSeverity)}
                eventHandlers={{
                  click: () => {
                    setMapCenter([cluster.centerLat, cluster.centerLng]);
                    setMapZoom(12);
                  }
                }}
              >
                <Tooltip direction="top" offset={[0, -15]} opacity={0.95}>
                  <div className="p-1 text-slate-900 text-xs font-sans">
                    <strong className="block text-indigo-700 font-bold">
                      Grouped Cluster ({cluster.records.length} Incidents)
                    </strong>
                    <span className="text-[10px] text-slate-700 block">
                      District: {cluster.records[0].district}
                    </span>
                    <span className="text-[9px] font-mono text-cyan-800 block mt-0.5 font-bold">
                      Click cluster to zoom & expand
                    </span>
                  </div>
                </Tooltip>
              </Marker>
            );
          })}

          {/* Individual Markers when Clustering is OFF */}
          {!enableClustering && filteredRecords.map((r) => (
            <Marker
              key={r.id}
              position={[r.latitude, r.longitude]}
              icon={createCustomMarkerIcon(r.severity)}
              eventHandlers={{
                click: () => setSelectedCase(r)
              }}
            >
              {/* Hover Tooltip displaying Case ID & Crime Type */}
              <Tooltip direction="top" offset={[0, -12]} opacity={0.95}>
                <div className="p-1 text-slate-900 text-xs font-sans">
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-bold text-indigo-600">{r.id}</span>
                    <span className={`text-[9px] font-mono px-1 rounded uppercase font-bold ${
                      r.severity === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {r.severity}
                    </span>
                  </div>
                  <strong className="block text-slate-900 font-bold">{r.crimeType}</strong>
                  <span className="text-[10px] text-slate-600 block">{r.district} • {r.area} ({r.date})</span>
                  <span className="text-[9px] font-mono text-cyan-700 font-bold mt-0.5 block">Click for Full Inspector Dossier</span>
                </div>
              </Tooltip>

              <Popup className="custom-leaflet-popup">
                <div className="p-1 text-slate-900 text-xs font-sans">
                  <span className="font-mono font-bold text-blue-600 block">{r.id}</span>
                  <strong className="block font-bold">{r.crimeType}</strong>
                  <p className="text-[11px] text-slate-700">{r.district} • {r.area}</p>
                  <button
                    onClick={() => setSelectedCase(r)}
                    className="mt-1 text-[10px] text-blue-700 font-bold underline cursor-pointer"
                  >
                    View Inspector Dossier
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Legend Overlay */}
        <div className="absolute bottom-4 left-4 bg-[#0d0d10]/90 border border-slate-800 p-3 rounded-xl backdrop-blur-md z-[1000] text-xs space-y-1.5 shadow-xl">
          <div className="font-mono text-[10px] uppercase text-slate-400 font-bold mb-1 flex items-center justify-between">
            <span>Severity Key</span>
            <span className="text-[9px] text-cyan-400">{filteredRecords.length} Filtered</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></span>
            <span>Critical Incident</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span>High Risk</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span>Medium Severity</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>Low / Standard</span>
          </div>
        </div>
      </div>

      {/* Case Inspector Detail Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d0d10] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative text-slate-100">
            <button
              onClick={() => setSelectedCase(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30 shrink-0">
                <FileText className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-cyan-400 text-sm">{selectedCase.id}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    selectedCase.severity === 'Critical' ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {selectedCase.severity}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100">{selectedCase.crimeType}</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#151518] p-3.5 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-slate-500 block text-[10px] font-mono">DISTRICT & AREA</span>
                <span className="text-slate-200 font-semibold">{selectedCase.district} ({selectedCase.area})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-mono">DATE & TIME</span>
                <span className="text-slate-200 font-semibold">{selectedCase.date} at {selectedCase.time} hrs</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-mono">PRIMARY SUSPECT</span>
                <span className="text-cyan-300 font-semibold">{selectedCase.suspect}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-mono">INVESTIGATING OFFICER</span>
                <span className="text-slate-200 font-semibold">{selectedCase.officer}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Car className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>Vehicle Tag:</strong> {selectedCase.vehicle}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span><strong>Weapon / MO Tool:</strong> {selectedCase.weapon}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span><strong>CDR Phone Number:</strong> <span className="font-mono text-cyan-300">{selectedCase.phoneNumber}</span></span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Users className="w-4 h-4 text-purple-400 shrink-0" />
                <span><strong>Known Associates:</strong> {selectedCase.knownAssociates.join(', ')}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#151518] border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
              <strong className="text-slate-200 block mb-1">FIR Incident Summary:</strong>
              {selectedCase.description}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedCase(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-all cursor-pointer"
              >
                Close
              </button>
              {onInvestigateCase && (
                <button
                  onClick={() => {
                    const caseQuery = `Investigate FIR ${selectedCase.id} involving ${selectedCase.suspect} in ${selectedCase.district}`;
                    setSelectedCase(null);
                    onInvestigateCase(caseQuery);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <BrainCircuit className="w-4 h-4" />
                  <span>Run Deep AI Investigation</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
