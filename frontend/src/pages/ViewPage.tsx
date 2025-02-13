/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import CanteenBanner from '../components/organisms/CanteenBanner';
import axiosInstance from '../utils/AxiosInstance';
import MenuContainer from '../components/organisms/MenuItemContainer';
import { useLoading } from '../context/LoadingContext';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation
import { toast } from 'react-toastify';
import { MyAppBar } from '../components/template/AppLayout';

const ViewPage: React.FC = () => {
  const [canteen, setCanteen] = useState<any>(null);
  const [ledgerData, setLedgerData] = useState<any>(null);
  const { setLoading } = useLoading();
  const location = useLocation(); // Get the current location
  const navigate = useNavigate();

  const getCanteenIdFromQuery = (): string | null => {
    const params = new URLSearchParams(location.search); // Get query parameters
    return params.get('canteenId'); // Return the canteenId if it exists
  };

  useEffect(() => {
    const fetchCanteenAndLedgerData = async () => {
      const canteenID = getCanteenIdFromQuery(); 

      if (!canteenID) {
        toast.error('Canteen ID is missing.');
        navigate('/');
        return;
      }

      setLoading(true);
      try {
        const canteenResponse = await axiosInstance.get(`/canteens/${canteenID}`);
        setCanteen(canteenResponse.data);

        const activeLedgerId = canteenResponse.data.activeLedgerId;
        if (activeLedgerId) {
          const ledgerResponse = await axiosInstance.get(`/ledgers/${activeLedgerId}`);
          setLedgerData(ledgerResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCanteenAndLedgerData();
  }, [location.search]); // Trigger the effect whenever the location changes (i.e., query parameters)


  return (
    <React.Fragment>
      <Box>
        <MyAppBar />

        <Box component="main" sx={{ paddingTop: '64px', paddingBottom: '56px' }}>
          <Container maxWidth="xl" disableGutters>
            <Box sx={{ flexGrow: 1, bgcolor: 'white', p: 1 }}>{canteen && <CanteenBanner canteen={canteen} />}</Box>

            <Box sx={{ flexGrow: 1, bgcolor: 'white', p: 2 }}>
              <Box sx={{ marginTop: 2 }} />
              {ledgerData && (
                <>
                  {ledgerData.menus.map((menu: any) => (
                    <MenuContainer
                      key={menu.id}
                      menu={{
                        id: menu.id,
                        name: menu.name,
                        description: menu.status,
                        items: menu.items,
                      }}
                    />
                  ))}
                </>
              )}
            </Box>
          </Container>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export { ViewPage };
