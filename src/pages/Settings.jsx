import { Volume2, Pause, Square, Type, Contrast, Wind } from 'lucide-react'
import { PageHead } from '../components/ui'

export default function Settings({ prefs, speech }) {
  const { textSize, setTextSize, highContrast, setHighContrast, reducedMotion, setReducedMotion } = prefs
  return (
    <div className="page">
      <PageHead eyebrow="Make this space comfortable" title="Your" accent="settings">Adjust the display and read-aloud experience. Settings are saved in this browser.</PageHead>
      <div className="settings-grid rise d1">
        <section className="glass panel">
          <div className="panel-title"><Type size={22} /><div><h2>Display</h2><span>Text and motion</span></div></div>
          <div className="setting"><span><b>Text size</b><small>Drag to make text comfortable to read.</small></span>
            <div className="size-ctl"><span aria-hidden="true" className="sm">A</span><input type="range" min="90" max="125" step="5" value={textSize} onChange={(e) => setTextSize(Number(e.target.value))} aria-label="Text size" aria-valuetext={`${textSize}%`} /><span aria-hidden="true" className="lg">A</span><output>{textSize}%</output></div>
          </div>
          <label className="setting"><span><b><Contrast size={18} /> Higher contrast</b><small>Strengthen text and interface contrast.</small></span><input className="switch" type="checkbox" role="switch" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} /></label>
          <label className="setting"><span><b><Wind size={18} /> Reduce motion</b><small>Limit animations and movement.</small></span><input className="switch" type="checkbox" role="switch" checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)} /></label>
        </section>
        <section className="glass panel">
          <div className="panel-title"><Volume2 size={22} /><div><h2>Read aloud</h2><span>Spoken guidance</span></div></div>
          {!speech.supported && <p className="hint">Your browser does not support read-aloud.</p>}
          <label className="setting"><span><b>Read aloud on hover and focus</b><small>Hover over headings and guidance, or tab to them.</small></span><input className="switch" type="checkbox" role="switch" checked={speech.autoRead} onChange={(e) => speech.toggle(e.target.checked)} /></label>
          <label className="setting"><span><b>Spoken language</b><small>Roman Urdu uses a small built-in phrasebook only.</small></span>
            <select value={speech.language} onChange={(e) => speech.setLanguage(e.target.value)}><option value="en">English</option><option value="roman">Roman Urdu (supported phrases)</option></select></label>
          <label className="setting"><span><b>Speaking speed</b><small>Choose a comfortable pace.</small></span>
            <select value={speech.rate} onChange={(e) => speech.setRate(e.target.value)}><option value="slow">Slow</option><option value="normal">Normal</option><option value="fast">Fast</option></select></label>
          <label className="setting"><span><b>Device voice</b><small>Depends on your browser and system.</small></span>
            <select value={speech.voiceName} onChange={(e) => speech.setVoiceName(e.target.value)}><option value="">Automatic voice</option>{speech.voices.map((v) => <option key={v.name} value={v.name}>{v.name} · {v.lang}</option>)}</select></label>
          <div className="btn-row">
            <button className="btn btn-primary" onClick={() => speech.speak(speech.language === 'roman' ? 'Pause before you tap.' : 'Your Digital Dost is ready to help you learn at your own pace.', true)}><Volume2 size={18} /> Test read aloud</button>
            <button className="btn btn-glass" onClick={speech.pauseResume} aria-label="Pause or resume"><Pause size={18} /> Pause</button>
            <button className="btn btn-glass" onClick={speech.stop}><Square size={16} /> Stop</button>
          </div>
        </section>
      </div>
    </div>
  )
}
