import React, { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './Administration.scss';
import { useRef } from 'react';
import { SideBarAdmin } from './components/SideBarAdmin/SideBarAdmin';


export function Administration() {
  const outletRef = useRef(null);
  const location = useLocation();

  useLayoutEffect(() => {
    if (location.state?.scrollTo && outletRef.current) {
      outletRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    // if (shouldScroll && outletRef.current && location.pathname.includes('addDish')) {
    //   outletRef.current.scrollIntoView({ behavior: 'smooth' });
    //   setShouldScroll(false);
    // }
    // if (shouldScroll) {
    //   if (outletRef.current) {
    //     const time = setTimeout(() => {
    //       outletRef.current.scrollIntoView({top: 200, behavior: 'smooth' });
    //       clearTimeout(time);
    //     }, 100);
    //   }
    //   setShouldScroll(false);
    // }
  }, [ location]);

  const handleScrollToOutlet = () => {
    if (outletRef.current) {
      const time = setTimeout(() => {
        outletRef.current.scrollIntoView({ behavior: 'smooth' });
        clearTimeout(time);
      }, 500);
    }
    // setShouldScroll(true);
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
