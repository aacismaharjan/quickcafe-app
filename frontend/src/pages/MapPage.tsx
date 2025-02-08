import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Button, IconButton } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axiosInstance from '../utils/AxiosInstance';
import useStoredIDs from '../utils/useStoredIDs';
import { useLoading } from '../context/LoadingContext';
import { useNavigate } from 'react-router-dom';
import { LocationCity, PeopleAlt } from '@mui/icons-material';

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

  const image_url = `http://localhost:8080/${canteen.image_url}`;

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
  const [canteens, setCanteens] = useState<CanteenTypeI[]>([]); // State for all canteens
  const [selectedCanteen, setSelectedCanteen] = useState<CanteenTypeI | null>(null); // Selected canteen
  const { setLoading } = useLoading();
  const navigate = useNavigate();

  const { canteenID, setCanteenID } = useStoredIDs(); // Assuming you have a hook for stored IDs

  // Fetch canteen data
  useEffect(() => {
    setLoading(true);
    const fetchCanteens = async () => {
      try {
        const response = await axiosInstance.get('/canteens');
        setCanteens(response.data); // Assuming the response is an array of canteens
        setSelectedCanteen(response.data.find((canteen: CanteenTypeI) => canteen.id === canteenID) || response.data[0]);
      } catch (error) {
        console.error('Error fetching canteens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCanteens();
  }, [canteenID]);

  // Create custom marker
  const createCustomMarker = (canteen: CanteenTypeI) => {
    const image_url = `http://localhost:8080/${canteen.image_url}`;
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          text-align: center;
        ">
          <div style="
            font-size: 12px;
            font-weight: 600;
            background: white;
            padding: 4px 6px;
            border-radius: 8px;
            -webkit-text-stroke: 0.5px rgba(0,0,0,0.2);
            -webkit-text-fill-color: #ff5722;
            text-shadow: 1px 1px 5px rgba(0,0,0,0.3);
            line-height: 1;
            margin-bottom: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          ">
            ${canteen.name}
          </div>
          <div style="
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0px 0px 0px 1px rgba(255,0,0,0.2);
            overflow: hidden;
          ">
            <img src="${image_url}" alt="${canteen.name}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="
            width: 0;
            height: 0;
            border-left:12px solid transparent;
            border-right: 12px solid transparent;
            border-top: 12px solid #ff5722;
            margin-top: -5px;
            z-index: -1;
          "></div>
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

  console.log(selectedCanteen);
  console.log('cateens', canteens);

  if (!selectedCanteen || canteens.length === 0) {
    return;
  }

  return (
    <div className="relative w-screen h-screen">
      <MapContainer
        center={[selectedCanteen!.latitude, selectedCanteen!.longitude]} // Default to Kathmandu
        zoom={15}
        zoomControl={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        className="absolute top-0 left-0 w-full h-full z-0"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {canteens.map((canteen) => {
          return (
            <Marker
              key={canteen.id}
              position={[canteen.latitude, canteen.longitude]}
              icon={createCustomMarker(canteen)}
            >
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
          );
        })}
      </MapContainer>

      <div
        className="absolute top-0 left-4 w-80 bg-white shadow-lg p-4 rounded-lg max-h-[80vh] overflow-y-auto z-10"
        style={{ top: 0, left: 0, minHeight: '100vh' }}
      >
        <h2 className="text-lg font-bold mb-2">Canteens</h2>
        {canteens.map((canteen) => {
           const image_url = `http://localhost:8080/${canteen.image_url}`;
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
                  <img
                    src={image_url}
                    alt={canteen.name}
                    className="w-full h-full object-cover"
                  />
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
          )
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
    </div>
  );
};

export default MapPage;
