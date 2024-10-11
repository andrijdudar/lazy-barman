import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './Administration.css';
import { useEffect, useRef, useState } from 'react';
import { SideBarAdmin } from './components/SideBarAdmin/SideBarAdmin';


export function Administration() {
  const outletRef = useRef(null);
  const location = useLocation();
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    if (shouldScroll) {
      if (outletRef.current) {
        // const time = setTimeout(() => {
          outletRef.current.scrollIntoView({top: 200, behavior: 'smooth' });
          // clearTimeout(time);
        // }, 100);
      }
      setShouldScroll(false);
    }
  }, [shouldScroll, location]);

  const handleScrollToOutlet = () => {
    setShouldScroll(true);
  };




  return (
    <div className='Administration'>
      <SideBarAdmin onLinkClick={handleScrollToOutlet} />
      <div className='SideBarAdminContent' ref={outletRef}>
        <Outlet className='OutletAdmin' />
      </div>
    </div>

  );
}
