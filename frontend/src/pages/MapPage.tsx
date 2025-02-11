import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Button, IconButton, Box } from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon, PeopleAlt, LocationCity } from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axiosInstance, { API_SERVER } from '../utils/AxiosInstance';
import useStoredIDs from '../utils/useStoredIDs';
import { useLoading } from '../context/LoadingContext';
import { useNavigate } from 'react-router-dom';

const CustomPopup: React.FC<{ canteen: CanteenTypeI; isSelected: boolean; handleBrowse: (id: number) => void }> = ({
  canteen,
  isSelected,
  handleBrowse,
}) => {
  const navigate = useNavigate();
  const map = useMap();
  const popupRef = useRef<L.Popup | null>(null);

  useEffect(() => {
    // Wait until map and popupRef.current are fully initialized
    if (map && popupRef.current && canteen && isSelected) {
      try {
        // Open the popup when the conditions are met
        map.setView([canteen.latitude, canteen.longitude], map.getZoom());
        map.openPopup(popupRef.current);
      } catch (e) {
        console.log('Error opening popup:', e);
      }
    }
  }, [canteen, map, isSelected]); // Dependency array

  if (!canteen) return;

  const image_url = `${API_SERVER}/${canteen.image_url}`;

  return (
    <Popup ref={popupRef} position={[canteen.latitude, canteen.longitude]}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 2 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }}
        >
          <img
            src={
              canteen.image_url
                ? image_url
                : 'https://img.freepik.com/premium-vector/restaurant-logo-design_1071427-469.jpg'
            }
            alt={canteen.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: 10 }}>{canteen.name}</h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: 5 }}>
          ⭐ {canteen.reviewsStat.rating.toFixed(1) || '4.7'} | <LocationCity sx={{ fontSize: 16 }} /> {canteen.address}
        </p>
        <p style={{ fontSize: '13px', color: '#444', marginBottom: 10 }}>📞 {canteen.phone_no}</p>
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{ borderRadius: 2, textTransform: 'none' }}
          onClick={() => handleBrowse(canteen.id)}
        >
          Browse Canteen
        </Button>
      </CardContent>
    </Popup>
  );
};

const MapPage: React.FC = () => {
  const [canteens, setCanteens] = useState<CanteenTypeI[]>([]);
  const [selectedCanteen, setSelectedCanteen] = useState<CanteenTypeI | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar state
  const { setLoading } = useLoading();
  const navigate = useNavigate();
  const { canteenID, setCanteenID } = useStoredIDs();

  useEffect(() => {
    setLoading(true);
    const fetchCanteens = async () => {
      try {
        const response = await axiosInstance.get('/canteens');
        setCanteens(response.data);
        setSelectedCanteen(response.data.find((canteen: CanteenTypeI) => canteen.id === canteenID) || response.data[0]);
      } catch (error) {
        console.error('Error fetching canteens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCanteens();
  }, [canteenID]);

  const createCustomMarker = (canteen: CanteenTypeI) => {
    const image_url = `${API_SERVER}/${canteen.image_url}`;
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
          <div style="font-size: 12px; font-weight: 600; background: white; padding: 4px 6px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
            ${canteen.name}
          </div>
          <div style="width: 36px; height: 36px; border-radius: 50%; overflow: hidden; border: 2px solid white;">
            <img src="${image_url}" alt="${canteen.name}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        </div>
      `,
      iconSize: [200, 45],
      iconAnchor: [15, 45],
      popupAnchor: [0, -45],
    });
  };

  const handleCanteenClick = () => {
    setCanteenID(selectedCanteen!.id);
    navigate('/');
  };

  const handleGoBack = () => {
    navigate('/');
  };

  if (!selectedCanteen || canteens.length === 0) {
    return;
  }

  return (
    <div className="relative w-screen h-screen">
      {/* Sidebar Toggle Button */}
      <IconButton
        className="absolute top-4 left-4 z-20 bg-white shadow-md rounded-full"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 bg-white shadow-lg p-4 rounded-lg max-h-[80vh] overflow-y-auto z-30 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ minHeight: '100vh', width: '320px' }}
      >
        <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0px 0px 8px 0px" }}>
          <h2 className="text-lg font-bold">Canteens </h2>

          <IconButton
            sx={{ display: 'inline-block' }}
            className="absolute  z-20 bg-white shadow-md rounded-full"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            size="small"
          >
          <CloseIcon/>
          </IconButton>
        </Box>
        {canteens.map((canteen) => {
          const image_url = `${API_SERVER}/${canteen.image_url}`;
          return (
            <Card
              key={canteen.id}
              onClick={() => setSelectedCanteen(canteen)}
              className={`cursor-pointer mb-2 hover:bg-gray-100 transition ${
                selectedCanteen?.id === canteen.id ? 'border-blue-500 border-2' : ''
              }`}
            >
              <CardContent className="flex items-center p-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4 overflow-hidden">
                  <img src={image_url} alt={canteen.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold">{canteen.name}</h3>
                  <p className="text-sm text-gray-600">
                    ⭐ {canteen.reviewsStat.rating.toFixed(1) || '4.7'}{' '}
                    <IconButton size="small">
                      <PeopleAlt sx={{ fontSize: '18px' }} />
                    </IconButton>
                    ({canteen.reviewsStat.reviewersNo})
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <div className="flex justify-between mt-4">
          <Button variant="outlined" color="secondary" onClick={handleGoBack}>
            Back
          </Button>
          <Button variant="contained" color="primary" onClick={handleCanteenClick}>
            Browse This Canteen
          </Button>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={[selectedCanteen!.latitude, selectedCanteen!.longitude]}
        zoom={15}
        zoomControl={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        className="absolute top-0 left-0 w-full h-full z-0"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {canteens.map((canteen) => (
          <Marker key={canteen.id} position={[canteen.latitude, canteen.longitude]} icon={createCustomMarker(canteen)}>
            {canteen && (
                <CustomPopup
                  canteen={canteen}
                  isSelected={selectedCanteen?.id === canteen.id}
                  handleBrowse={(id: number) => {
                    setCanteenID(id);
                    navigate('/');
                  }}
                />
              )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPage;


