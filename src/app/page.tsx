'use client';

import { useState } from 'react';
import Sidebar, { type View } from '@/components/sidebar';
import Dashboard from '@/components/dashboard';
import GeoSpatial from '@/components/geospatial';
import GraphView from '@/components/graphview';
import Timeline from '@/components/timeline';
import AlertsView from '@/components/alertsview';
import DataView from '@/components/dataview';
import Phase2View from '@/components/phase2-view';
import Phase3View from '@/components/phase3-view';
import Phase45View from '@/components/phase45-view';
import { alerts } from '@/lib/data';

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const unackAlertCount = alerts.filter(a => !a.acknowledged).length;

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'geospatial': return <GeoSpatial />;
      case 'graph': return <GraphView />;
      case 'timeline': return <Timeline />;
      case 'alerts': return <AlertsView />;
      case 'dataview': return <DataView />;
      case 'phase2': return <Phase2View />;
      case 'phase3': return <Phase3View />;
      case 'phase45': return <Phase45View />;
    }
  };

  return (
    <div className="h-screen flex">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} alertCount={unackAlertCount} />
      <main className="flex-1 overflow-hidden">
        {renderView()}
      </main>
    </div>
  );
}
