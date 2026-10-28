import { useRef, useState } from 'react';
import './ClockPicker.css';

const HOURS = Array.from({ length: 12 }, (_, index) => index + 1);
const MINUTES = Array.from({ length: 12 }, (_, index) => index * 5);

export default function ClockPicker({ value, onChange, label }) {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState('hour');
  const [period, setPeriod] = useState('AM');
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const pointerStart = useRef(null);
  const dragSelection = useRef(null);
  const suppressClick = useRef(false);
  const shownValue = value || '';

  function openClock() {
    if (value) {
      const [hour, minute] = value.split(':').map(Number);
      setSelectedHour(hour % 12 || 12);
      setSelectedMinute(minute);
      setPeriod(hour >= 12 ? 'PM' : 'AM');
      setStage(Number(minute) === 0 ? 'hour' : 'minute');
    } else {
      setStage('hour');
      setSelectedHour(12);
      setSelectedMinute(0);
      setPeriod('AM');
    }
    setOpen((current) => !current);
  }

  function selectHour(hour) {
    setSelectedHour(hour);
    setStage('minute');
  }

  function selectMinute(minute) {
    const hour24 = (selectedHour % 12) + (period === 'PM' ? 12 : 0);
    onChange(`${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    setOpen(false);
  }

  function readDialValue(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    const degrees = (Math.atan2(y, x) * 180 / Math.PI + 450) % 360;
    if (stage === 'hour') return { type: 'hour', value: (Math.round(degrees / 30) % 12) || 12 };
    return { type: 'minute', value: Math.round(degrees / 6) % 60 };
  }

  function handlePointerDown(event) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerStart.current = { x: event.clientX, y: event.clientY };
    dragSelection.current = readDialValue(event);
  }

  function handlePointerMove(event) {
    if (!pointerStart.current) return;
    if (Math.hypot(event.clientX - pointerStart.current.x, event.clientY - pointerStart.current.y) > 5) {
      suppressClick.current = true;
      dragSelection.current = readDialValue(event);
      if (dragSelection.current.type === 'hour') setSelectedHour(dragSelection.current.value);
      else setSelectedMinute(dragSelection.current.value);
    }
  }

  function handlePointerUp() {
    if (suppressClick.current && dragSelection.current) {
      if (dragSelection.current.type === 'hour') selectHour(dragSelection.current.value);
      else selectMinute(dragSelection.current.value);
      window.setTimeout(() => { suppressClick.current = false; }, 0);
    }
    pointerStart.current = null;
    dragSelection.current = null;
  }

  const values = stage === 'hour' ? HOURS : MINUTES;
  const previewHour = (selectedHour % 12) + (period === 'PM' ? 12 : 0);
  const previewValue = `${String(previewHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
  const activeClockValue = stage === 'hour' ? selectedHour % 12 : selectedMinute;
  const activeAngle = stage === 'hour' ? activeClockValue * 30 : activeClockValue * 6;
  const indicatorLeft = 50 + Math.sin(activeAngle * Math.PI / 180) * 39;
  const indicatorTop = 50 - Math.cos(activeAngle * Math.PI / 180) * 39;

  return (
    <div className="clock-picker">
      <button className="clock-trigger" type="button" aria-label={label} aria-haspopup="dialog" aria-expanded={open} onClick={openClock}>
        <span aria-hidden="true">◷</span>{shownValue || 'Select time'}
      </button>
      {open && <div className="clock-popover" role="dialog" aria-label={`${label} clock selector`}>
        <div className="clock-heading">
          <div><span className="clock-caption">SELECT {stage === 'hour' ? 'HOUR' : 'MINUTE'}</span><strong>{previewValue}</strong></div>
          <div className="clock-period" aria-label="AM or PM">
            {['AM', 'PM'].map((item) => <button type="button" key={item} className={period === item ? 'selected' : ''} aria-pressed={period === item} onClick={() => setPeriod(item)}>{item}</button>)}
          </div>
        </div>
        <div className="clock-face" aria-label={stage === 'hour' ? 'Choose hour' : 'Choose minute'} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
          <span className="clock-hand" style={{ transform: `rotate(${activeAngle}deg)` }} />
          {values.map((item, index) => {
            const angle = ((stage === 'hour' ? item % 12 : index) * 30 - 90) * Math.PI / 180;
            const left = 50 + Math.cos(angle) * 39;
            const top = 50 + Math.sin(angle) * 39;
            const display = stage === 'hour' ? item : String(item).padStart(2, '0');
            const selected = stage === 'hour' ? selectedHour === item : selectedMinute === item;
            return <button type="button" key={item} className={`clock-number ${selected ? 'selected' : ''}`} style={{ left: `${left}%`, top: `${top}%` }} onClick={() => { if (suppressClick.current) return; stage === 'hour' ? selectHour(item) : selectMinute(item); }}>{display}</button>;
          })}
          <span className="clock-indicator" style={{ left: `${indicatorLeft}%`, top: `${indicatorTop}%` }} />
          <span className="clock-center" />
        </div>
        <div className="clock-footer">
          {value && <button className="clock-clear" type="button" onClick={() => { onChange(''); setOpen(false); }}>Clear time</button>}
          <button className="clock-stage-toggle" type="button" onClick={() => setStage(stage === 'hour' ? 'minute' : 'hour')}>Choose {stage === 'hour' ? 'minutes' : 'hour'}</button>
        </div>
      </div>}
    </div>
  );
}
