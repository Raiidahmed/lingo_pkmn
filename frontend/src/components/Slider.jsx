import * as SliderPrimitive from '@radix-ui/react-slider';

/*
  Premium-feeling slider using Radix primitives for reliable pointer/touch handling.
*/
export default function Slider({
  label,
  value,
  min,
  max,
  step = 0.01,
  unit = '',
  format,
  onChange,
}) {
  const defaultDisplay = Number.isInteger(value)
    ? `${value}${unit}`
    : `${Number(value.toFixed(2))}${unit}`;
  const display = format ? format(value) : defaultDisplay;
  const handleValueChange = (next) => {
    if (!Array.isArray(next)) return;
    const nextValue = next[0];
    if (typeof nextValue !== 'number' || Number.isNaN(nextValue)) return;
    onChange(Number(nextValue.toFixed(4)));
  };

  return (
    <div className="slider-row">
      <div className="slider-head">
        <span className="slider-label">{label}</span>
        <span className="slider-value">{display}</span>
      </div>
      <SliderPrimitive.Root
        className="ui-slider"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={handleValueChange}
      >
        <SliderPrimitive.Track className="ui-slider-track">
          <SliderPrimitive.Range className="ui-slider-range" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="ui-slider-thumb" />
      </SliderPrimitive.Root>
    </div>
  );
}
