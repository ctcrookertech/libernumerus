import { useTab } from './stores/app-store'
import ParticleBackground from './components/ParticleBackground'
import TabBar from './components/TabBar'
import PortalScreen from './screens/portal/PortalScreen'
import ExploreScreen from './screens/explore/ExploreScreen'
import InsightsScreen from './screens/insights/InsightsScreen'
import JournalScreen from './screens/journal/JournalScreen'
import SettingsScreen from './screens/settings/SettingsScreen'

const screens = {
  portal: PortalScreen,
  explore: ExploreScreen,
  insights: InsightsScreen,
  journal: JournalScreen,
  settings: SettingsScreen,
}

function AppShell() {
  const { activeTab } = useTab()
  const Screen = screens[activeTab] || PortalScreen

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      zIndex: 1,
    }}>
      <Screen />
    </div>
  )
}

export default function App() {
  return (
    <>
      <ParticleBackground />
      <AppShell />
      <TabBar />
    </>
  )
}
