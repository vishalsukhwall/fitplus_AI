import React from 'react'
import DashboardGrid from './Dashboard/DashboardGrid'


export default function Dashboard({
  setActiveView,
  onOpenCoach,
  activeVolume,
  setActiveVolume
}) {
  return (
    <DashboardGrid
      setActiveView={setActiveView}
      onOpenCoach={onOpenCoach}
      activeVolume={activeVolume}
    />
  )
}

