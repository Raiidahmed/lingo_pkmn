/*
  Premium-feeling slider with a gradient-fill track.
  --fill is set inline so the CSS `linear-gradient` paints the
  filled portion in the accent color and the unfilled in surface2.
*/
export default function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  format,
  onChange,
}) {
  const range = max - min;
  const fill = range === 0 ? 0 : ((value - min) / range) * 100;
  const display = format ? format(value) : `${value}${unit}`;
  const handleInput = (e) => onChange(Number(e.currentTarget.value));

  return (
    <div className="slider-row">
      <div className="slider-head">
        <span className="slider-label">{label}</span>
        <span className="slider-value">{display}</span>
      </div>
      <input
        type="range"
        className="ui-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onInput={handleInput}
        onChange={handleInput}
        style={{ '--fill': `${fill}%` }}
      />
    </div>
  );
}
