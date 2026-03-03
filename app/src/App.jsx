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
      zIndex: 3,
    }}>
      <Screen />
    </div>
  )
}

export default function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Background gradient layer */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(165deg, #0c0618 0%, #150d2e 25%, #1a1040 50%, #12082a 75%, #0a0416 100%)',
        zIndex: 0,
      }} />
      <ParticleBackground />
      <AppShell />
      <TabBar />
    </div>
  )
}
