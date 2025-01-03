/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import CanteenBanner from '../components/organisms/CanteenBanner';
import axiosInstance from '../utils/AxiosInstance';
import Ledger from '../components/organisms/Ledger';
import MenuContainer from '../components/organisms/MenuItemContainer';
import { useLoading } from '../context/LoadingContext';

const HomePage: React.FC = () => {
  const [canteen, setCanteen] = useState<any>(null);
  const [ledgerData, setLedgerData] = useState<any>(null); // Changed menuData to ledgerData
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchCanteenData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/canteens/3');
        setCanteen(response.data);
      } catch (error) {
        console.error('Error fetching canteen data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCanteenData();
  }, []);

  useEffect(() => {
    const fetchMenuData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/ledgers/2'); // Adjust the endpoint as necessary
        setLedgerData(response.data); // Set your ledger data
      } catch (error) {
        console.error('Error fetching ledger data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 1, bgcolor: 'white', p: 1 }}>{canteen && <CanteenBanner canteen={canteen} />}</Box>

      <Box sx={{ flexGrow: 1, bgcolor: 'white', p: 2 }}>
        <Box sx={{ marginTop: 2 }} />
        {ledgerData && (
          <>
            <Ledger ledger={{ name: ledgerData.name, description: ledgerData.description }} />
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
    </React.Fragment>
  );
};

export { HomePage };
