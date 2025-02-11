export const useOwnerCanteenID = () => {
  return {
    ownerCanteenID: JSON.parse(localStorage.getItem('ownerCanteenID') || '1'),
    ownerCanteen: JSON.parse(localStorage.getItem('ownerCanteen') || '{}'),
  };
};
