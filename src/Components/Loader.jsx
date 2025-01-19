import React from 'react';
import { GridLoader } from 'react-spinners';
import { useAuth } from './context/AuthProvider';

const Loader = () => {
  const { isLoading } = useAuth()

  return isLoading ? (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <GridLoader color="#F66803" />
    </div>
  ) : null;
};

export default Loader;
