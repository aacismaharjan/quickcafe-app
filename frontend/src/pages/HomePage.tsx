/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import CanteenBanner from '../components/organisms/CanteenBanner';
import axiosInstance from '../utils/AxiosInstance';
import MenuContainer from '../components/organisms/MenuItemContainer';
import { useLoading } from '../context/LoadingContext';
import useStoredIDs from '../utils/useStoredIDs';

const HomePage: React.FC = () => {
  const [canteen, setCanteen] = useState<any>(null);
  const [ledgerData, setLedgerData] = useState<any>(null); // Changed menuData to ledgerData
  const { setLoading } = useLoading();
  const { canteenID } = useStoredIDs();

  useEffect(() => {
    const fetchCanteenAndLedgerData = async () => {
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
  }, []);

  return (
    <React.Fragment>
      <Container maxWidth="xl" disableGutters>
        <Box sx={{ flexGrow: 1, bgcolor: 'white', p: 1 }}>{canteen && <CanteenBanner canteen={canteen} />}</Box>

        <Box sx={{ flexGrow: 1, bgcolor: 'white', p: 2 }}>
          <Box sx={{ marginTop: 2 }} />
          {ledgerData && (
            <>
              {/* <Ledger ledger={{ name: ledgerData.name, description: ledgerData.description }} /> */}
              {ledgerData.menus.map((menu: any) => (
                <MenuContainer
                  key={menu.id} // Unique key for each menu
                  menu={{
                    id: menu.id,
                    name: menu.name,
                    description: menu.status, // Assuming you want to use the status as a description
                    items: menu.items,
                  }}
                />
              ))}
            </>
          )}
        </Box>
      </Container>
    </React.Fragment>
  );
};

export { HomePage };
